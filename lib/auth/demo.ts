export type DemoRole = "student" | "faculty" | "admin";
export const demoUser = {
  student: { name:"Demo Student", email:"student@ndc-demo.local", role:"student" as const, id:"NDC-DEMO-001", course:"BCA", semester:"V", section:"A" },
  faculty: { name:"Demo Faculty", email:"faculty@ndc-demo.local", role:"faculty" as const, id:"FAC-DEMO-001", department:"Computer Applications", designation:"Assistant Professor" },
  admin: { name:"Demo Administrator", email:"admin@ndc-demo.local", role:"admin" as const, id:"ADM-DEMO-001", department:"Administration", designation:"Super Administrator" },
};
export function setDemoSession(role:DemoRole){if(typeof window!=="undefined") localStorage.setItem("scms-demo-user", JSON.stringify(demoUser[role]));}
export function clearDemoSession(){if(typeof window!=="undefined") localStorage.removeItem("scms-demo-user");}
export function getDemoSession(){if(typeof window==="undefined") return null; const raw=localStorage.getItem("scms-demo-user"); return raw?JSON.parse(raw) as {role:DemoRole;name:string;email:string;id:string}:null;}
