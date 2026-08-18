import GenericPage from "@/components/portal/GenericPage"; import {facultyItems} from "@/components/portal/portalItems";
export default function Page(){return <GenericPage role="faculty" items={facultyItems} title="Attendance" description="Mark and review attendance for authorized classes." rows={["BCA V-A \u00b7 Programming \u00b7 Today"]}/>}
