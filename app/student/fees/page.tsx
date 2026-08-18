import GenericPage from "@/components/portal/GenericPage";

export default function Page() {
  return (
    <GenericPage
      role="student"
      title="Fees"
      description="View fee details, payment records and outstanding balances."
      rows={[
        "Current fee structure",
        "Payment history",
        "Outstanding fee details",
      ]}
    />
  );
}