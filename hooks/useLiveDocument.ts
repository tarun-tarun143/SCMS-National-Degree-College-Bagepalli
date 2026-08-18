"use client";
import { doc, onSnapshot, type DocumentData, type Firestore } from "firebase/firestore";
import { useEffect, useState } from "react";

export function useLiveDocument<T extends DocumentData>(db: Firestore | null, collectionName: string, id?: string | null) {
  const [data, setData] = useState<(T & { id: string }) | null>(null);
  const [loading, setLoading] = useState(Boolean(db && id));
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!db || !id) {
      setData(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    return onSnapshot(doc(db, collectionName, id), (snapshot) => {
      setData(snapshot.exists() ? ({ id: snapshot.id, ...snapshot.data() } as T & { id: string }) : null);
      setLoading(false);
    }, (snapshotError) => {
      console.error(`SCMS realtime document listener failed for ${collectionName}/${id}`, snapshotError);
      setError(snapshotError.message || "Unable to load live data.");
      setLoading(false);
    });
  }, [db, collectionName, id]);

  return { data, loading, error };
}
