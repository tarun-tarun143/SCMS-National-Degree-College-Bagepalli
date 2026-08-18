import GenericPage from "@/components/portal/GenericPage"; import {studentItems} from "@/components/portal/portalItems";
export default function Leave(){return <GenericPage role="student" items={studentItems} title="Leave Requests" description="Submit and track student leave applications." rows={["No pending leave requests","Leave workflow is ready for form/database integration"]}/>}
