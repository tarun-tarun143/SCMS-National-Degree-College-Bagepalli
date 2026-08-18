"use client";
import { Loader2 } from "lucide-react";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & { children: ReactNode; loading?: boolean; variant?: "primary"|"secondary"|"outline"|"danger" };
export default function Button({children, loading, variant="primary", className="", disabled, ...props}: Props) {
  const base = "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-200";
  const variants = { primary:"bg-[var(--blue)] text-white hover:-translate-y-0.5 hover:shadow-lg", secondary:"bg-[var(--navy)] text-white hover:-translate-y-0.5", outline:"border border-slate-200 bg-white text-[var(--navy)] hover:bg-slate-50", danger:"bg-red-600 text-white hover:bg-red-700" };
  return <button className={`${base} ${variants[variant]} ${className}`} disabled={disabled || loading} {...props}>{loading && <Loader2 className="h-4 w-4 animate-spin"/>}{children}</button>;
}
