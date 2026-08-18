import GenericPage from "@/components/portal/GenericPage"; import {facultyItems} from "@/components/portal/portalItems";
export default function Page(){return <GenericPage role="faculty" items={facultyItems} title="Students" description="Students within your assigned classes." rows={["Ananya Rao", "Rahul Kumar", "Asha K"]}/>}
