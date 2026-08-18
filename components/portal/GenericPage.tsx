import PortalShell from "@/components/portal/PortalShell";
import PageHeading from "@/components/portal/PageHeading";
import Badge from "@/components/ui/Badge";

type PortalRole = "student" | "faculty" | "admin";

interface GenericPageProps {
  role: PortalRole;
  title: string;
  description?: string;
  rows?: string[];
}

export default function GenericPage({
  role,
  title,
  description,
  rows = ["No records available yet."],
}: GenericPageProps) {
  return (
    <PortalShell
      role={role}
      title={title}
    >
      <PageHeading
        title={title}
        description={description}
      />

      <div className="grid gap-4">
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
                SCMS module · configurable through the appropriate portal
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