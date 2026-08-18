import GenericPage from "@/components/portal/GenericPage";

export default function Page() {
  return (
    <GenericPage
      role="student"
      title="Messages"
      description="Communicate with faculty and college administration."
      rows={[
        "Faculty conversations",
        "Administrative messages",
        "Recent messages",
      ]}
    />
  );
}