"use client";

import { ShieldCheck } from "lucide-react";

type PublicFooterProps = {
  role?: string;
};

export default function PublicFooter({
  role = "SCMS",
}: PublicFooterProps) {
  const safeRole =
    typeof role === "string" && role.trim()
      ? role.trim()
      : "SCMS";

  const roleLabel =
    safeRole.charAt(0).toUpperCase() +
    safeRole.slice(1);

  return (
    <footer className="border-t border-slate-200 bg-white px-3 py-2 md:px-6">
      <div className="flex min-h-8 items-center justify-between gap-3 text-[9px] text-slate-400">
        <div className="flex min-w-0 items-center gap-1.5">
          <ShieldCheck className="h-3 w-3 shrink-0 text-emerald-500" />

          <span className="truncate font-semibold">
            SCMS · {roleLabel}
          </span>
        </div>

        <div className="flex shrink-0 items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />

          <span>Online</span>

          <span className="hidden sm:inline">•</span>

          <span className="hidden sm:inline">
            © {new Date().getFullYear()}
          </span>

          <span className="hidden md:inline">
            The National Degree College, Bagepalli
          </span>
        </div>
      </div>
    </footer>
  );
}