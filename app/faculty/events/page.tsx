import GenericPage from "@/components/portal/GenericPage";

export default function Page() {
  return (
    <GenericPage
      role="faculty"
      title="Events"
      description="Review college events, programs and faculty activities."
      rows={[
        "Upcoming college events",
        "Faculty event schedule",
        "Recent event activity",
      ]}
    />
  );
}