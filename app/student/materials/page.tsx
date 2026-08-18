import GenericPage from "@/components/portal/GenericPage";

export default function Page() {
  return (
    <GenericPage
      role="student"
      title="Materials"
      description="Access study materials shared by your faculty members."
      rows={[
        "Course study materials",
        "Recently uploaded materials",
        "Downloaded materials",
      ]}
    />
  );
}