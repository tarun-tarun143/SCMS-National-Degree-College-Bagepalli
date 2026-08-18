import GenericPage from "@/components/portal/GenericPage";

export default function Page() {
  return (
    <GenericPage
      role="faculty"
      title="Exams"
      description="Manage examination schedules, assessments and related academic activities."
      rows={[
        "Upcoming examination schedule",
        "Assessment configuration",
        "Recent examination activity",
      ]}
    />
  );
}