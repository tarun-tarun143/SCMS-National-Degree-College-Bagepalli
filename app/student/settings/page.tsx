import GenericPage from "@/components/portal/GenericPage"; import {studentItems} from "@/components/portal/portalItems";
export default function Settings(){return <GenericPage role="student" items={studentItems} title="Settings" description="Manage your portal preferences and account information." rows={["Profile preferences","Notification preferences","Security settings","Appearance"]}/>}
