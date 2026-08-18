import GenericPage from "@/components/portal/GenericPage";

export default function Page() {
  return (
    <GenericPage
      role="student"
      title="Events"
      description="View upcoming college events, programs and student activities."
      rows={[
        "Upcoming college events",
        "Registered events",
        "Recent event activity",
      ]}
    />
  );
}