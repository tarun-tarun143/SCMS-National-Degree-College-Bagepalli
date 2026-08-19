"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";

const links = [
  { label: "About", href: "/about" },
  { label: "Courses", href: "/courses" },
  { label: "Departments", href: "/departments" },
  { label: "Faculty", href: "/faculty" },
  { label: "Admissions", href: "/admissions" },
  { label: "Events", href: "/events" },
  { label: "Notices", href: "/notices" },
  { label: "Contact", href: "/contact" },
];

export default function PublicNavbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur">
      <div className="container-page flex h-20 items-center justify-between">

        {/* College branding */}
        <Link
          href="/"
          className="flex min-w-0 items-center gap-3"
        >
          <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-white">
            <img
              src="/college-logo.jpg"
              alt="The National Degree College, Bagepalli"
              width={48}
              height={48}
              className="block h-12 w-12 object-contain p-1"
            />
          </div>

          <div className="min-w-0">
            <div className="truncate text-sm font-extrabold text-[var(--navy)]">
              THE NATIONAL DEGREE COLLEGE
            </div>

            <div className="text-xs font-semibold tracking-wider text-slate-500">
              BAGEPALLI
            </div>
          </div>
        </Link>

        {/* Desktop navigation */}
        <nav className="hidden items-center gap-6 lg:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-semibold text-slate-700 transition-colors hover:text-[var(--blue)]"
            >
              {link.label}
            </Link>
          ))}

          <Link
            href="/login"
            className="rounded-xl bg-[var(--blue)] px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:-translate-y-0.5"
          >
            Login
          </Link>
        </nav>

        {/* Mobile menu button */}
        <button
          type="button"
          aria-label="Toggle navigation"
          aria-expanded={open}
          onClick={() => setOpen(!open)}
          className="rounded-xl border border-slate-200 p-2 lg:hidden"
        >
          {open ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* Mobile navigation */}
      {open && (
        <div className="border-t border-slate-200 bg-white lg:hidden">
          <div className="container-page py-4">

            {links.map((link) => (
              <Link
                key={link.href}
                onClick={() => setOpen(false)}
                href={link.href}
                className="block rounded-lg px-3 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                {link.label}
              </Link>
            ))}

            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className="mt-2 block rounded-xl bg-[var(--blue)] px-4 py-3 text-center text-sm font-bold text-white"
            >
              Login Portal
            </Link>

          </div>
        </div>
      )}
    </header>
  );
}