import GenericPage from "@/components/portal/GenericPage";

export default function Page() {
  return (
    <GenericPage
      role="student"
      title="Settings"
      description="Manage your student portal preferences and account settings."
      rows={[
        "Account preferences",
        "Notification preferences",
        "Security settings",
      ]}
    />
  );
}