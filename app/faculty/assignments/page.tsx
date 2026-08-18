import GenericPage from "@/components/portal/GenericPage"; import {facultyItems} from "@/components/portal/portalItems";
export default function Page(){return <GenericPage role="faculty" items={facultyItems} title="Assignments" description="Create assignments and review submissions." rows={["Java Collections & OOP", "Normalization Case Study"]}/>}
