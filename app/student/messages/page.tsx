import GenericPage from "@/components/portal/GenericPage"; import {studentItems} from "@/components/portal/portalItems";
export default function Messages(){return <GenericPage role="student" items={studentItems} title="Messages" description="Authorized communication with faculty and administration." rows={["Academic Advisor","Class Faculty","Administration"]}/>}
