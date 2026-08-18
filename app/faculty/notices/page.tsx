import GenericPage from "@/components/portal/GenericPage"; import {facultyItems} from "@/components/portal/portalItems";
export default function Page(){return <GenericPage role="faculty" items={facultyItems} title="Notices" description="Department and college announcements." rows={["Academic notice", "Examination update"]}/>}
