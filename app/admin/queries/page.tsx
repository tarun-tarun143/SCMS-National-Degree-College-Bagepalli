import RealtimeQueries from "@/components/admin/RealtimeQueries";

export const metadata = {
  title: "Queries | SCMS Admin",
  description: "Manage college queries in real time.",
};

export default function QueriesPage() {
  return (
    <RealtimeQueries />
  );
}