"use client";

import { useQueries } from "@/hooks/useQueries";

export default function RealtimeQueries() {
  const {
    queries,
    loading,
    error,
  } = useQueries();

  if (loading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-slate-500">
          Loading queries...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

        <div>
          <h2 className="text-2xl font-bold text-slate-900">
            College Queries
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            New queries appear automatically without refreshing.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-full bg-green-50 px-4 py-2 text-sm font-semibold text-green-700">

          <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-green-500" />

          Live

        </div>

      </div>

      {/* Empty */}
      {queries.length === 0 && (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">

          <h3 className="text-lg font-semibold text-slate-800">
            No queries yet
          </h3>

          <p className="mt-2 text-sm text-slate-500">
            New queries submitted through Contact will appear here.
          </p>

        </div>
      )}

      {/* Queries */}
      <div className="space-y-4">

        {queries.map((item) => (

          <article
            key={item.id}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md"
          >

            <div className="flex flex-col justify-between gap-4 md:flex-row">

              <div>

                <div className="flex flex-wrap items-center gap-2">

                  <h3 className="text-lg font-bold text-slate-900">
                    {item.subject}
                  </h3>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      item.status === "new"
                        ? "bg-blue-100 text-blue-700"
                        : item.status === "pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {item.status.toUpperCase()}
                  </span>

                </div>

                <p className="mt-2 text-sm text-slate-500">
                  {item.category}
                </p>

              </div>

              <span className="text-xs font-medium text-green-600">
                {item.emailSent
                  ? "✓ Email sent"
                  : "Email pending"}
              </span>

            </div>

            <div className="mt-5 grid gap-4 border-t border-slate-100 pt-5 sm:grid-cols-2">

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  From
                </p>

                <p className="mt-1 font-medium text-slate-800">
                  {item.name}
                </p>

                <p className="text-sm text-blue-600">
                  {item.email}
                </p>

                {item.phone && (
                  <p className="text-sm text-slate-500">
                    {item.phone}
                  </p>
                )}
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Query
                </p>

                <p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-slate-700">
                  {item.message}
                </p>
              </div>

            </div>

          </article>

        ))}

      </div>

    </div>
  );
}