import GenericPage from "@/components/portal/GenericPage";

export default function Page() {
  return (
    <GenericPage
      role="student"
      title="Notices"
      description="View important college announcements and student notices."
      rows={[
        "Published college notices",
        "Academic announcements",
        "Recent notice activity",
      ]}
    />
  );
}