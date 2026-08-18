import GenericPage from "@/components/portal/GenericPage";

export default function Page() {
  return (
    <GenericPage
      role="student"
      title="Notifications"
      description="View alerts, reminders and important SCMS notifications."
      rows={[
        "Unread notifications",
        "Academic alerts",
        "Recent system notifications",
      ]}
    />
  );
}