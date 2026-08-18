import GenericPage from "@/components/portal/GenericPage";

export default function Page() {
  return (
    <GenericPage
      role="student"
      title="Timetable"
      description="View your daily and weekly class timetable."
      rows={[
        "Monday · Programming · 09:00 · Room 201",
        "Tuesday · Database Management · 11:00 · Room 203",
        "Wednesday · Web Technology · 10:00 · Room 205",
      ]}
    />
  );
}