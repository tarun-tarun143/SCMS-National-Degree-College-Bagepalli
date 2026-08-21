"use client";

import {
  collection,
  limit as firestoreLimit,
  onSnapshot,
  query,
  where,
  type DocumentData,
  type Firestore,
  type QueryConstraint,
  type WhereFilterOp,
} from "firebase/firestore";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

/* ============================================================
   TYPES
============================================================ */

export type LiveFilter = {
  field: string;
  op: WhereFilterOp;
  value:
    | string
    | number
    | boolean
    | null;
};

export type LiveDocument<T> = T & {
  id: string;
};

export type LiveCollectionOptions = {
  filters?: LiveFilter[];
  limit?: number;
};

/* ============================================================
   REAL-TIME FIRESTORE COLLECTION HOOK
============================================================ */

export function useLiveCollection<
  T extends DocumentData
>(
  db: Firestore | null,
  collectionName: string,
  options?: LiveCollectionOptions
) {
  /*
   * Serialize query options so that inline objects such as:
   *
   * {
   *   filters: [...]
   * }
   *
   * do not constantly create a new Firestore listener
   * on every React render.
   */
  const serializedOptions = useMemo(
    () => JSON.stringify(options ?? {}),
    [options]
  );

  /* ==========================================================
     STATE
  ========================================================== */

  const [data, setData] = useState<
    LiveDocument<T>[]
  >([]);

  const [loading, setLoading] = useState(
    Boolean(db)
  );

  const [error, setError] = useState<
    string | null
  >(null);

  /* ==========================================================
     REAL-TIME LISTENER
  ========================================================== */

  useEffect(() => {
    /*
     * No Firestore instance.
     */
    if (!db) {
      setData([]);
      setLoading(false);

      setError(
        "Firebase is not configured. Check your .env.local Firebase settings."
      );

      return;
    }

    setLoading(true);
    setError(null);

    let unsubscribe:
      | (() => void)
      | null = null;

    try {
      /* ======================================================
         BUILD QUERY CONSTRAINTS
      ====================================================== */

      const constraints: QueryConstraint[] =
        [];

      const filters =
        options?.filters ?? [];

      for (const filter of filters) {
        /*
         * Ignore invalid filters rather than crashing
         * the entire listener.
         */
        if (!filter.field) {
          continue;
        }

        constraints.push(
          where(
            filter.field,
            filter.op,
            filter.value
          )
        );
      }

      /* ======================================================
         LIMIT
      ====================================================== */

      if (
        typeof options?.limit === "number" &&
        options.limit > 0
      ) {
        constraints.push(
          firestoreLimit(options.limit)
        );
      }

      /* ======================================================
         COLLECTION REFERENCE
      ====================================================== */

      const collectionRef = collection(
        db,
        collectionName
      );

      /* ======================================================
         FINAL QUERY
      ====================================================== */

      const firestoreQuery =
        constraints.length > 0
          ? query(
              collectionRef,
              ...constraints
            )
          : collectionRef;

      /* ======================================================
         REAL-TIME SNAPSHOT
      ====================================================== */

      unsubscribe = onSnapshot(
        firestoreQuery,

        (snapshot) => {
          const records: LiveDocument<T>[] =
            snapshot.docs.map((document) => {
              const documentData =
                document.data();

              return {
                id: document.id,
                ...(documentData as T),
              };
            });

          setData(records);
          setLoading(false);
          setError(null);
        },

        (snapshotError) => {
          console.error(
            `SCMS realtime listener failed for "${collectionName}":`,
            snapshotError
          );

          setData([]);
          setLoading(false);

          /* ==================================================
             FIRESTORE PERMISSION ERROR
          ================================================== */

          if (
            snapshotError.code ===
            "permission-denied"
          ) {
            setError(
              `Permission denied while reading "${collectionName}". Check your Firestore Security Rules and authenticated user role.`
            );

            return;
          }

          /* ==================================================
             UNAVAILABLE / NETWORK
          ================================================== */

          if (
            snapshotError.code ===
            "unavailable"
          ) {
            setError(
              `Firestore is temporarily unavailable while reading "${collectionName}". Check your internet connection.`
            );

            return;
          }

          /* ==================================================
             FAILED PRECONDITION
          ================================================== */

          if (
            snapshotError.code ===
            "failed-precondition"
          ) {
            setError(
              `Firestore query configuration error for "${collectionName}". Check the query and required indexes.`
            );

            return;
          }

          /* ==================================================
             DEFAULT
          ================================================== */

          setError(
            snapshotError.message ||
              `Unable to load "${collectionName}".`
          );
        }
      );

      return () => {
        unsubscribe?.();
      };
    } catch (listenerError) {
      console.error(
        `SCMS realtime listener setup failed for "${collectionName}":`,
        listenerError
      );

      setData([]);
      setLoading(false);

      setError(
        listenerError instanceof Error
          ? listenerError.message
          : `Unable to initialize "${collectionName}" realtime listener.`
      );

      return () => {
        unsubscribe?.();
      };
    }

    /*
     * serializedOptions intentionally controls
     * Firestore listener recreation.
     */
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    db,
    collectionName,
    serializedOptions,
  ]);

  /* ==========================================================
     RETURN
  ========================================================== */

  return {
    data,
    loading,
    error,
  };
}