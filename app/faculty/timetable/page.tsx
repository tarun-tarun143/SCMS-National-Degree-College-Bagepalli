import GenericPage from "@/components/portal/GenericPage"; import {facultyItems} from "@/components/portal/portalItems";
export default function Page(){return <GenericPage role="faculty" items={facultyItems} title="Timetable" description="Review your teaching timetable." rows={["Monday \u00b7 Programming \u00b7 09:00 \u00b7 Room 201"]}/>}
