import GenericPage from "@/components/portal/GenericPage";

export default function Page() {
  return (
    <GenericPage
      role="student"
      title="Leave"
      description="Submit and monitor your leave requests."
      rows={[
        "New leave request",
        "Pending leave requests",
        "Leave history",
      ]}
    />
  );
}