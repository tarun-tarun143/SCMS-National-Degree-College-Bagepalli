import GenericPage from "@/components/portal/GenericPage";

export default function Page() {
  return (
    <GenericPage
      role="faculty"
      title="Attendance"
      description="Record and monitor attendance for your assigned classes."
      rows={[
        "Attendance configuration",
        "Current attendance records",
        "Attendance shortage overview",
      ]}
    />
  );
}