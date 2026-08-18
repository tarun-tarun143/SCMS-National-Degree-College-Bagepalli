import GenericPage from "@/components/portal/GenericPage";

export default function Page() {
  return (
    <GenericPage
      role="faculty"
      title="Settings"
      description="Manage faculty portal preferences and account settings."
      rows={[
        "Account preferences",
        "Notification preferences",
        "Security settings",
      ]}
    />
  );
}