"use client";

import {
  collection,
  limit,
  onSnapshot,
  query,
  where,
  type DocumentData,
  type Firestore,
  type QueryConstraint,
  type WhereFilterOp,
} from "firebase/firestore";

import { useEffect, useMemo, useState } from "react";

type Filter = {
  field: string;
  op: WhereFilterOp;
  value: string | number | boolean | null;
};

type LiveDocument<T> = T & {
  id: string;
};

type LiveCollectionOptions = {
  filters?: Filter[];
  limit?: number;
};

export function useLiveCollection<T extends DocumentData>(
  db: Firestore | null,
  collectionName: string,
  options?: LiveCollectionOptions
) {
  const serializedOptions = useMemo(
    () => JSON.stringify(options ?? {}),
    [options]
  );

  const [data, setData] = useState<LiveDocument<T>[]>([]);
  const [loading, setLoading] = useState(Boolean(db));
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!db) {
      setData([]);
      setLoading(false);
      setError(
        "Firebase is not configured. Add your Firebase web app settings to .env.local."
      );
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const constraints: QueryConstraint[] = [];

      for (const filter of options?.filters ?? []) {
        constraints.push(
          where(filter.field, filter.op, filter.value)
        );
      }

      if (options?.limit && options.limit > 0) {
        constraints.push(limit(options.limit));
      }

      const collectionRef = collection(db, collectionName);

      const firestoreQuery =
        constraints.length > 0
          ? query(collectionRef, ...constraints)
          : collectionRef;

      const unsubscribe = onSnapshot(
        firestoreQuery,
        (snapshot) => {
          const documents = snapshot.docs.map((document) => ({
            id: document.id,
            ...document.data(),
          })) as LiveDocument<T>[];

          setData(documents);
          setLoading(false);
          setError(null);
        },
        (snapshotError) => {
          console.error(
            `SCMS realtime listener failed for ${collectionName}`,
            snapshotError
          );

          setData([]);
          setLoading(false);

          if (snapshotError.code === "permission-denied") {
            setError(
              `Permission denied while reading "${collectionName}". Check your Firestore Security Rules and user role.`
            );
          } else {
            setError(
              snapshotError.message ||
                `Unable to load ${collectionName}.`
            );
          }
        }
      );

      return unsubscribe;
    } catch (error) {
      console.error(
        `SCMS realtime listener setup failed for ${collectionName}`,
        error
      );

      setData([]);
      setLoading(false);

      setError(
        error instanceof Error
          ? error.message
          : "Unable to initialize realtime listener."
      );
    }

    // serializedOptions intentionally controls resubscription.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [db, collectionName, serializedOptions]);

  return {
    data,
    loading,
    error,
  };
}