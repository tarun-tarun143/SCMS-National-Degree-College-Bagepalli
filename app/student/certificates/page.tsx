import GenericPage from "@/components/portal/GenericPage";

export default function Page() {
  return (
    <GenericPage
      role="student"
      title="Certificates"
      description="View and manage your academic and college certificate requests."
      rows={[
        "Available certificates",
        "Certificate request status",
        "Issued certificate records",
      ]}
    />
  );
}