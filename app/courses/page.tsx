"use client";
import Link from "next/link";
import PublicShell from "@/components/public/PublicShell";
import SectionTitle from "@/components/ui/SectionTitle";
import { firestoreDb } from "@/lib/firebase/client";
import { useLiveCollection } from "@/hooks/useLiveCollection";

type Course = { id:string; code?:string; name?:string; duration?:string; description?:string; status?:string };
export default function Courses(){ const {data,loading,error}=useLiveCollection<Course>(firestoreDb,"courses",{limit:100}); return <PublicShell><main><section className="bg-slate-50 py-16"><div className="container-page"><SectionTitle eyebrow="Academic programs" title="Courses & curriculum" description="Courses published by the college administration appear here automatically."/><div className="mt-10 grid gap-5 lg:grid-cols-3">{loading&&<LiveMessage text="Loading published courses…"/>}{error&&<LiveError text={error}/>} {!loading&&!error&&!data.length&&<LiveMessage text="No courses have been published yet. The college administrator can add them from the Admin Portal."/>}{data.filter(c=>c.status!=="inactive").map(c=><article key={c.id} className="card overflow-hidden"><div className="h-2 bg-[var(--gold)]"/><div className="p-7"><div className="flex items-center justify-between"><span className="text-2xl font-black text-[var(--navy)]">{c.code||"COURSE"}</span><span className="text-xs font-bold text-slate-500">{c.duration||"Duration configured by college"}</span></div><h2 className="mt-5 text-xl font-extrabold">{c.name||"Untitled course"}</h2><p className="mt-3 text-sm leading-7 text-slate-600">{c.description||"Course description has not been published yet."}</p><Link href="/contact" className="mt-6 inline-flex rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-[var(--navy)] hover:bg-slate-50">Enquire about course</Link></div></article>)}</div></div></section></main></PublicShell> }
function LiveMessage({text}:{text:string}){return <div className="card p-7 text-sm text-slate-500 lg:col-span-3">{text}</div>}
function LiveError({text}:{text:string}){return <div className="card border-red-100 bg-red-50 p-7 text-sm text-red-700 lg:col-span-3">{text}</div>}
