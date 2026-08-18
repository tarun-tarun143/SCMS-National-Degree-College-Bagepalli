import GenericPage from "@/components/portal/GenericPage"; import {facultyItems} from "@/components/portal/portalItems";
export default function Page(){return <GenericPage role="faculty" items={facultyItems} title="Settings" description="Manage faculty preferences and security." rows={["Profile", "Notifications", "Security"]}/>}
