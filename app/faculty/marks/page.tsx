import GenericPage from "@/components/portal/GenericPage";

export default function Page() {
  return (
    <GenericPage
      role="faculty"
      title="Marks"
      description="Manage student marks, assessments and academic performance."
      rows={[
        "Internal assessment records",
        "Student marks overview",
        "Recent marks activity",
      ]}
    />
  );
}