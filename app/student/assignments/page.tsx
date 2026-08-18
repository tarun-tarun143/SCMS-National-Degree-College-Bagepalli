"use client";

import PortalShell from "@/components/portal/PortalShell";
import PageHeading from "@/components/portal/PageHeading";
import Badge from "@/components/ui/Badge";

export default function Page() {
  const rows = [
    "Current assignment list",
    "Pending submissions",
    "Recently completed assignments",
  ];

  return (
    <PortalShell
      role="student"
      title="Assignments"
    >
      <PageHeading
        eyebrow="Student portal"
        title="Assignments"
        description="View your academic assignments, deadlines and submission status."
      />

      <div className="mt-6 grid gap-4">
        {rows.map((row, index) => (
          <div
            key={`${row}-${index}`}
            className="card flex items-center justify-between p-5"
          >
            <div>
              <div className="font-bold text-[var(--navy)]">
                {row}
              </div>

              <div className="mt-1 text-xs text-slate-500">
                SCMS student module
              </div>
            </div>

            <Badge tone="blue">
              View
            </Badge>
          </div>
        ))}
      </div>
    </PortalShell>
  );
}