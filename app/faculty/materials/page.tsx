import GenericPage from "@/components/portal/GenericPage"; import {facultyItems} from "@/components/portal/portalItems";
export default function Page(){return <GenericPage role="faculty" items={facultyItems} title="Study Materials" description="Publish resources to authorized students." rows={["Java Notes", "DBMS Question Bank", "Syllabus"]}/>}
