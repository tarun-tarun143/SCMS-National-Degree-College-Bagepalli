"use client";
import { collection, limit, onSnapshot, query, where, type Firestore, type QueryConstraint, type DocumentData, type WhereFilterOp } from "firebase/firestore";
import { useEffect, useMemo, useState } from "react";

type Filter = { field: string; op: WhereFilterOp; value: string | number | boolean };

export function useLiveCollection<T extends DocumentData>(db: Firestore | null, collectionName: string, options?: { filters?: Filter[]; limit?: number }) {
  const serializedOptions = useMemo(() => JSON.stringify(options ?? {}), [options]);
  const [data, setData] = useState<Array<T & { id: string }>>([]);
  const [loading, setLoading] = useState(Boolean(db));
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!db) {
      setLoading(false);
      setError("Firebase is not configured. Add your Firebase web app settings to .env.local.");
      return;
    }
    setLoading(true);
    setError(null);
    const constraints: QueryConstraint[] = [];
    for (const filter of options?.filters ?? []) constraints.push(where(filter.field, filter.op, filter.value));
    if (options?.limit) constraints.push(limit(options.limit));
    const ref = collection(db, collectionName);
    const q = constraints.length ? query(ref, ...constraints) : ref;
    return onSnapshot(q, (snapshot) => {
      setData(snapshot.docs.map((item) => ({ id: item.id, ...item.data() })) as Array<T & { id: string }>);
      setLoading(false);
    }, (snapshotError) => {
      console.error(`SCMS realtime listener failed for ${collectionName}`, snapshotError);
      setError(snapshotError.message || "Unable to load live data.");
      setLoading(false);
    });
  // serializedOptions prevents object identity from causing resubscribe loops.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [db, collectionName, serializedOptions]);

  return { data, loading, error };
}
