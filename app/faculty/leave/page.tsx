import GenericPage from "@/components/portal/GenericPage";

export default function Page() {
  return (
    <GenericPage
      role="faculty"
      title="Leave"
      description="Manage faculty leave requests, history and approval status."
      rows={[
        "Leave request configuration",
        "Current leave balance",
        "Recent leave activity",
      ]}
    />
  );
}