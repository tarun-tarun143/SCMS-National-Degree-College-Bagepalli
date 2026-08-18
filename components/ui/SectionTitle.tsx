export default function SectionTitle({eyebrow,title,description}:{eyebrow?:string;title:string;description?:string}){
 return <div className="max-w-2xl"><div className="mb-2 text-xs font-bold uppercase tracking-[.22em] text-[var(--gold)]">{eyebrow}</div><h2 className="text-balance text-3xl font-extrabold tracking-tight text-[var(--navy)] sm:text-4xl">{title}</h2>{description&&<p className="mt-4 text-base leading-7 text-slate-600">{description}</p>}</div>
}
