import GenericPage from "@/components/portal/GenericPage"; import {facultyItems} from "@/components/portal/portalItems";
export default function Page(){return <GenericPage role="faculty" items={facultyItems} title="Examinations" description="View exam schedules and responsibilities." rows={["Internal Assessment", "Semester Examination"]}/>}
