import GenericPage from "@/components/portal/GenericPage";

export default function Page() {
  return (
    <GenericPage
      role="student"
      title="Subjects"
      description="View your enrolled subjects and academic course information."
      rows={[
        "Current semester subjects",
        "Subject faculty information",
        "Course subject overview",
      ]}
    />
  );
}