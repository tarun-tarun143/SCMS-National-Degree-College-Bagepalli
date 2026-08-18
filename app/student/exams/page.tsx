import GenericPage from "@/components/portal/GenericPage";

export default function Page() {
  return (
    <GenericPage
      role="student"
      title="Exams"
      description="View examination schedules, assessments and important exam information."
      rows={[
        "Upcoming examination schedule",
        "Internal assessments",
        "Recent examination notices",
      ]}
    />
  );
}