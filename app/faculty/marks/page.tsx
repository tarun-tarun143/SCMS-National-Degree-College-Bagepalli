import GenericPage from "@/components/portal/GenericPage"; import {facultyItems} from "@/components/portal/portalItems";
export default function Page(){return <GenericPage role="faculty" items={facultyItems} title="Marks" description="Enter and review assessment marks." rows={["Programming \u00b7 DBMS \u00b7 Computer Networks"]}/>}
