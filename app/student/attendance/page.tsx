import GenericPage from "@/components/portal/GenericPage";

export default function Page() {
  return (
    <GenericPage
      role="student"
      title="Attendance"
      description="View your attendance records, percentages and shortage information."
      rows={[
        "Current semester attendance",
        "Subject-wise attendance",
        "Attendance shortage overview",
      ]}
    />
  );
}