import GenericPage from "@/components/portal/GenericPage";

export default function Page() {
  return (
    <GenericPage
      role="faculty"
      title="Students"
      description="View students assigned to your classes and academic activities."
      rows={[
        "Assigned student list",
        "Student academic information",
        "Recent student activity",
      ]}
    />
  );
}