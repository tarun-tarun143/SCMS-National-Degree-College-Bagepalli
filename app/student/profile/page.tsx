import GenericPage from "@/components/portal/GenericPage";

export default function Page() {
  return (
    <GenericPage
      role="student"
      title="Profile"
      description="View your student profile and academic information."
      rows={[
        "Personal information",
        "Academic details",
        "Contact information",
      ]}
    />
  );
}