import GenericPage from "@/components/portal/GenericPage"; import {facultyItems} from "@/components/portal/portalItems";
export default function Page(){return <GenericPage role="faculty" items={facultyItems} title="Notifications" description="Attendance, assignment and examination alerts." rows={["New assignment submission", "Exam reminder"]}/>}
