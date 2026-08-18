import GenericPage from "@/components/portal/GenericPage"; import {facultyItems} from "@/components/portal/portalItems";
export default function Page(){return <GenericPage role="faculty" items={facultyItems} title="Leave Requests" description="Track faculty leave applications." rows={["No pending requests"]}/>}
