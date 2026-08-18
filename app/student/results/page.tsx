import GenericPage from "@/components/portal/GenericPage";

export default function Page() {
  return (
    <GenericPage
      role="student"
      title="Results"
      description="View your examination results and academic performance."
      rows={[
        "Current semester results",
        "Previous examination results",
        "Academic performance summary",
      ]}
    />
  );
}