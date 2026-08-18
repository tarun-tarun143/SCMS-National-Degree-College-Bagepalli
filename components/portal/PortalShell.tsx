"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AlertTriangle, Loader2, LogOut, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import PublicFooter from "@/components/public/PublicFooter";
import { useScmsSession, requiredRoleLabel } from "@/lib/auth/session";
import type { UserRole } from "@/types/scms";

type Item = { label: string; href: string; icon: React.ComponentType<{ className?: string }> };

export default function PortalShell({ role, items, children, title }: { role: UserRole; items: Item[]; children: React.ReactNode; title: string }) {
  const path = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const { user, loading, error, logout } = useScmsSession(role);

  useEffect(() => {
    if (!loading && !user) router.replace(error?.includes("role") ? "/unauthorized" : "/login");
  }, [error, loading, router, user]);

  async function handleLogout() {
    await logout();
    router.replace("/login");
  }

  if (loading) {
    return <div className="grid min-h-screen place-items-center bg-[var(--bg)]"><div className="flex items-center gap-3 rounded-2xl bg-white px-5 py-4 shadow-sm"><Loader2 className="h-5 w-5 animate-spin text-[var(--blue)]" /><span className="text-sm font-bold text-[var(--navy)]">Verifying your SCMS account…</span></div></div>;
  }

  if (!user) {
    return <div className="grid min-h-screen place-items-center bg-[var(--bg)] p-6"><div className="max-w-md rounded-2xl border border-slate-200 bg-white p-7 text-center shadow-sm"><AlertTriangle className="mx-auto h-9 w-9 text-amber-500" /><h1 className="mt-4 text-xl font-black text-[var(--navy)]">Access not available</h1><p className="mt-2 text-sm leading-6 text-slate-500">{error ?? "Please sign in with an active college account."}</p><Link href="/login" className="mt-5 inline-flex rounded-xl bg-[var(--navy)] px-4 py-3 text-sm font-bold text-white">Return to secure login</Link></div></div>;
  }

  const roleTitle = requiredRoleLabel(role);
  return <div className="min-h-screen bg-[var(--bg)]"><div className="flex min-h-screen"><aside className={`fixed inset-y-0 left-0 z-50 w-72 transform border-r border-slate-200 bg-white transition-transform lg:static lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}><div className="flex h-20 items-center justify-between border-b border-slate-100 px-5"><Link href={`/${role}`} className="flex items-center gap-3"><div className="grid h-11 w-11 place-items-center rounded-xl bg-[var(--navy)] text-sm font-black text-[var(--gold)]">NDC</div><div><div className="text-xs font-extrabold text-[var(--navy)]">NATIONAL DEGREE COLLEGE</div><div className="text-[10px] font-bold tracking-widest text-slate-400">SCMS · {roleTitle.toUpperCase()}</div></div></Link><button onClick={() => setOpen(false)} className="rounded-lg p-2 lg:hidden"><X className="h-5 w-5" /></button></div><div className="p-4"><div className="rounded-2xl bg-slate-50 p-4"><div className="text-xs font-bold uppercase tracking-wider text-slate-400">Signed in as</div><div className="mt-1 truncate font-extrabold text-[var(--navy)]">{user.name}</div><div className="mt-1 truncate text-xs text-slate-500">{user.email}</div><div className="mt-2 inline-flex rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-emerald-700">Active {roleTitle}</div></div><nav className="mt-5 grid gap-1">{items.map((item) => { const Icon = item.icon; const active = path === item.href || path.startsWith(`${item.href}/`); return <Link key={item.href} href={item.href} onClick={() => setOpen(false)} className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold ${active ? "bg-blue-50 text-[var(--blue)]" : "text-slate-600 hover:bg-slate-50 hover:text-[var(--navy)]"}`}><Icon className="h-4 w-4" />{item.label}</Link>; })}</nav><button onClick={handleLogout} className="mt-5 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50"><LogOut className="h-4 w-4" /> Logout</button></div></aside><div className="min-w-0 flex-1"><header className="sticky top-0 z-40 flex h-20 items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur md:px-7"><button onClick={() => setOpen(true)} className="rounded-xl border border-slate-200 p-2 lg:hidden"><Menu className="h-5 w-5" /></button><div className="ml-2 lg:ml-0"><div className="text-xs font-bold uppercase tracking-wider text-slate-400">{roleTitle} Portal</div><h1 className="text-lg font-extrabold text-[var(--navy)]">{title}</h1></div><Link href="/" className="hidden text-sm font-bold text-slate-500 hover:text-[var(--blue)] sm:inline-flex">Public Website</Link></header><main className="p-4 md:p-7">{children}</main><PublicFooter /></div></div></div>;
}
