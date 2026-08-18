import GenericPage from "@/components/portal/GenericPage";

export default function Page() {
  return (
    <GenericPage
      role="faculty"
      title="Messages"
      description="Communicate with students and college administration."
      rows={[
        "Student conversations",
        "Faculty communication",
        "Recent messages",
      ]}
    />
  );
}