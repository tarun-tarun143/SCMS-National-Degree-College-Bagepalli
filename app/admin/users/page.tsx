"use client";
import { doc, updateDoc } from "firebase/firestore";
import { useState } from "react";
import { ShieldCheck, UserCog } from "lucide-react";
import PortalShell from "@/components/portal/PortalShell";
import { adminItems } from "@/components/portal/portalItems";
import PageHeading from "@/components/portal/PageHeading";
import { firestoreDb } from "@/lib/firebase/client";
import { useLiveCollection } from "@/hooks/useLiveCollection";

type Account = { id: string; uid: string; name?: string; email?: string; role?: string; status?: string };

export default function AdminUsers() {
  return <PortalShell role="admin" items={adminItems} title="User & Role Management"><UsersManager /></PortalShell>;
}

function UsersManager() {
  const { data, loading, error } = useLiveCollection<Account>(firestoreDb, "users", { limit: 200 });
  const [saving, setSaving] = useState<string | null>(null);

  async function updateRole(id: string, role: "pending" | "student" | "faculty" | "admin", status: "pending" | "active" | "inactive") {
    if (!firestoreDb) return;
    setSaving(id);
    try {
      await updateDoc(doc(firestoreDb, "users", id), { role, status, updatedAt: new Date().toISOString() });
    } finally {
      setSaving(null);
    }
  }

  return <div><PageHeading eyebrow="Central administration" title="User & role management" description="New Google accounts appear as Pending. Activate them only after the college has verified the person and assigned the correct role."/><div className="mt-6 card overflow-hidden"><div className="border-b border-slate-100 p-5"><div className="flex items-center gap-2 font-extrabold text-[var(--navy)]"><UserCog className="h-5 w-5 text-[var(--blue)]"/> Live user directory</div><p className="mt-1 text-xs text-slate-500">This list updates automatically from Cloud Firestore.</p></div>{loading&&<div className="p-8 text-sm text-slate-500">Loading live accounts…</div>}{error&&<div className="p-8 text-sm text-red-600">{error}</div>}{!loading&&!error&&!data.length&&<div className="p-8 text-sm text-slate-500">No user accounts have registered yet.</div>}{!loading&&!error&&data.map((account)=><div key={account.id} className="flex flex-col gap-4 border-b border-slate-100 p-5 lg:flex-row lg:items-center lg:justify-between"><div className="min-w-0"><div className="font-bold text-[var(--navy)]">{account.name || "Unnamed user"}</div><div className="truncate text-xs text-slate-500">{account.email || "No email"}</div></div><div className="grid grid-cols-2 gap-2 sm:flex"><select value={`${account.role ?? "pending"}:${account.status ?? "pending"}`} onChange={(event)=>{const [role,status]=event.target.value.split(":") as ["pending"|"student"|"faculty"|"admin","pending"|"active"|"inactive"]; updateRole(account.id,role,status);}} disabled={saving===account.id} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold"><option value="pending:pending">Pending</option><option value="student:active">Student · Active</option><option value="faculty:active">Faculty · Active</option><option value="admin:active">Admin · Active</option><option value="student:inactive">Student · Inactive</option><option value="faculty:inactive">Faculty · Inactive</option></select><span className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-50 px-3 py-2 text-xs font-bold text-slate-600"><ShieldCheck className="h-4 w-4 text-emerald-600"/>{saving===account.id?"Saving…":account.status ?? "pending"}</span></div></div>)}</div></div>;
}
