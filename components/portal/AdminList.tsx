"use client";

import PortalShell from "@/components/portal/PortalShell";
import PageHeading from "@/components/portal/PageHeading";
import Badge from "@/components/ui/Badge";

interface AdminListProps {
  title: string;
  description: string;
  rows: string[];
}

export default function AdminList({
  title,
  description,
  rows,
}: AdminListProps) {
  return (
    <PortalShell
      role="admin"
      title={title}
    >
      <PageHeading
        title={title}
        description={description}
      />

      <div className="card overflow-hidden">
        <div className="flex flex-col gap-3 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between">
          <input
            type="text"
            placeholder="Search records..."
            className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-100 sm:max-w-sm"
          />

          <button
            type="button"
            className="rounded-xl bg-[var(--blue)] px-4 py-2.5 text-sm font-bold text-white hover:opacity-90"
          >
            Add new
          </button>
        </div>

        {rows.map((row, index) => (
          <div
            key={`${row}-${index}`}
            className="flex flex-col gap-3 border-b border-slate-100 p-5 last:border-b-0 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <div className="font-bold text-[var(--navy)]">
                {row}
              </div>

              <div className="mt-1 text-xs text-slate-500">
                Managed by administrators
              </div>
            </div>

            <div className="flex gap-2">
              <Badge tone="green">
                Active
              </Badge>

              <button
                type="button"
                className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-bold hover:bg-slate-50"
              >
                Edit
              </button>
            </div>
          </div>
        ))}
      </div>
    </PortalShell>
  );
}