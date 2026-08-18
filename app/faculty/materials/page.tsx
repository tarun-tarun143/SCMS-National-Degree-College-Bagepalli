import GenericPage from "@/components/portal/GenericPage";

export default function Page() {
  return (
    <GenericPage
      role="faculty"
      title="Materials"
      description="Manage and share academic materials with assigned students."
      rows={[
        "Uploaded study materials",
        "Course material configuration",
        "Recent material activity",
      ]}
    />
  );
}