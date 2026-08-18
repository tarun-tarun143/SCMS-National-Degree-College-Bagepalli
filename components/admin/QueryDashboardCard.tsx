"use client";

import Link from "next/link";
import { MessageSquare, ArrowRight } from "lucide-react";
import { useQueries } from "@/hooks/useQueries";

export default function QueryDashboardCard() {
  const { queries, loading } = useQueries();

  const newQueries = queries.filter(
    (query) => query.status === "new"
  ).length;

  return (
    <Link
      href="/admin/queries"
      className="group block rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="flex items-start justify-between">
        <div className="rounded-xl bg-blue-100 p-3 text-blue-700">
          <MessageSquare size={24} />
        </div>

        <ArrowRight
          size={20}
          className="text-slate-400 transition group-hover:translate-x-1 group-hover:text-blue-600"
        />
      </div>

      <div className="mt-5">
        <p className="text-sm font-medium text-slate-500">
          College Queries
        </p>

        <p className="mt-1 text-3xl font-bold text-slate-900">
          {loading ? "..." : newQueries}
        </p>

        <p className="mt-1 text-sm text-slate-500">
          New queries
        </p>
      </div>
    </Link>
  );
}