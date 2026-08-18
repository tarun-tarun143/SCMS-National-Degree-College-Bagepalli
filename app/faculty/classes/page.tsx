import GenericPage from "@/components/portal/GenericPage"; import {facultyItems} from "@/components/portal/portalItems";
export default function Page(){return <GenericPage role="faculty" items={facultyItems} title="My Classes" description="Assigned classes, sections and subjects." rows={["BCA V-A \u00b7 Programming", "BCA V-B \u00b7 Lab"]}/>}
