"use client";

import {
  collection,
  limit,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";

export interface CollegeQuery {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  category: string;
  subject: string;
  message: string;
  status: "new" | "pending" | "resolved";
  emailSent?: boolean;
  createdAt?: {
    seconds: number;
    nanoseconds: number;
  } | null;
}

export function useQueries() {
  const [queries, setQueries] = useState<CollegeQuery[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const queriesRef = collection(db, "queries");

    const queriesQuery = query(
      queriesRef,
      orderBy("createdAt", "desc"),
      limit(100)
    );

    const unsubscribe = onSnapshot(
      queriesQuery,
      (snapshot) => {
        const data: CollegeQuery[] = snapshot.docs.map((doc) => {
          const item = doc.data();

          return {
            id: doc.id,
            name: item.name ?? "",
            email: item.email ?? "",
            phone: item.phone ?? null,
            category: item.category ?? "General",
            subject: item.subject ?? "",
            message: item.message ?? "",
            status: item.status ?? "new",
            emailSent: item.emailSent ?? false,
            createdAt: item.createdAt ?? null,
          };
        });

        setQueries(data);
        setLoading(false);
        setError(null);
      },

      (snapshotError) => {
        console.error(
          "REAL-TIME QUERY LISTENER ERROR:",
          snapshotError
        );

        setError(
          "Unable to load real-time queries."
        );

        setLoading(false);
      }
    );

    return () => {
      unsubscribe();
    };
  }, []);

  return {
    queries,
    loading,
    error,
  };
}