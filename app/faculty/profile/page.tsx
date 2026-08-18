import GenericPage from "@/components/portal/GenericPage"; import {facultyItems} from "@/components/portal/portalItems";
export default function Page(){return <GenericPage role="faculty" items={facultyItems} title="Faculty Profile" description="View and maintain faculty information." rows={["Faculty identity \u00b7 Department \u00b7 Designation"]}/>}
