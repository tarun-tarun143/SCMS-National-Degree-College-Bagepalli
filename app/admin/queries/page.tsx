import RealtimeQueries from "@/components/admin/RealtimeQueries";

export const metadata = {
  title: "Queries | SCMS Admin",
  description: "Manage student and visitor queries.",
};

export default function AdminQueriesPage() {
  return (
    <main className="min-h-screen bg-slate-100 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <RealtimeQueries />
      </div>
    </main>
  );
}