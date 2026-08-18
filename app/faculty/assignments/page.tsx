import GenericPage from "@/components/portal/GenericPage";

export default function Page() {
  return (
    <GenericPage
      role="faculty"
      title="Assignments"
      description="Create, review and manage student assignments."
      rows={[
        "Assignment configuration",
        "Recent assignment activity",
        "Submission overview",
      ]}
    />
  );
}