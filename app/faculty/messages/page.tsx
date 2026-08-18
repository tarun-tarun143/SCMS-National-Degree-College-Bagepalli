import GenericPage from "@/components/portal/GenericPage"; import {facultyItems} from "@/components/portal/portalItems";
export default function Page(){return <GenericPage role="faculty" items={facultyItems} title="Messages" description="Authorized student and administration conversations." rows={["Academic Advisor", "Class Group"]}/>}
