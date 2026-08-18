import GenericPage from "@/components/portal/GenericPage";

export default function Page() {
  return (
    <GenericPage
      role="faculty"
      title="Notifications"
      description="View important alerts, updates and system notifications."
      rows={[
        "Unread notifications",
        "Academic alerts",
        "Recent system updates",
      ]}
    />
  );
}