import GenericPage from "@/components/portal/GenericPage";

export default function Page() {
  return (
    <GenericPage
      role="faculty"
      title="Faculty Profile"
      description="View and manage your faculty profile and account information."
      rows={[
        "Personal and faculty information",
        "Department and designation",
        "Contact details",
      ]}
    />
  );
}