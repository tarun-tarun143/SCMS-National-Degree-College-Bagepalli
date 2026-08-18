import GenericPage from "@/components/portal/GenericPage"; import {facultyItems} from "@/components/portal/portalItems";
export default function Page(){return <GenericPage role="faculty" items={facultyItems} title="Events" description="Campus activities and event coordination." rows={["Orientation", "Cultural Showcase"]}/>}
