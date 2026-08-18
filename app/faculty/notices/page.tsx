import GenericPage from "@/components/portal/GenericPage";

export default function Page() {
  return (
    <GenericPage
      role="faculty"
      title="Notices"
      description="View college announcements and faculty-specific notices."
      rows={[
        "Published college notices",
        "Faculty announcements",
        "Recent notice activity",
      ]}
    />
  );
}