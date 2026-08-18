import GenericPage from "@/components/portal/GenericPage";

export default function Page() {
  return (
    <GenericPage
      role="faculty"
      title="My Classes"
      description="View and manage your assigned classes."
      rows={[
        "Assigned class configuration",
        "Current class schedule",
        "Student roster overview",
      ]}
    />
  );
}