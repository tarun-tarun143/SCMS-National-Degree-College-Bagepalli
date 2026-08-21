"use client";

import { useEffect, useState } from "react";
import { GraduationCap, Loader2 } from "lucide-react";

export default function SplashScreen({
  duration = 3500,
}: {
  duration?: number;
}) {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setShow(false);
    }, duration);

    return () => {
      window.clearTimeout(timer);
    };
  }, [duration]);

  if (!show) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[999999] grid min-h-screen place-items-center overflow-hidden bg-[#061329] text-white">
      <div className="absolute -left-32 -top-32 h-80 w-80 rounded-full bg-blue-600/20 blur-[100px]" />
      <div className="absolute -right-32 top-10 h-96 w-96 rounded-full bg-cyan-500/15 blur-[110px]" />

      <div className="relative flex flex-col items-center text-center">

        <div className="relative">
          <div className="absolute inset-0 animate-ping rounded-3xl bg-cyan-400/20" />

          <div className="relative grid h-24 w-24 place-items-center rounded-3xl border border-white/15 bg-white/10 shadow-2xl backdrop-blur-xl">
            <GraduationCap className="h-12 w-12 text-cyan-300" />
          </div>
        </div>

        <h1 className="mt-7 text-3xl font-black">
          SCMS
        </h1>

        <p className="mt-2 text-xs font-bold uppercase tracking-[0.25em] text-blue-200/70">
          Smart College Management System
        </p>

        <p className="mt-2 text-sm text-slate-400">
          The National Degree College, Bagepalli
        </p>

        <div className="mt-8 h-1.5 w-56 overflow-hidden rounded-full bg-white/10">
          <div className="h-full origin-left animate-[loadingBar_3.5s_ease-in-out_forwards] rounded-full bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-500" />
        </div>

        <div className="mt-5 flex items-center gap-2 text-xs text-slate-400">
          <Loader2 className="h-4 w-4 animate-spin text-cyan-400" />
          Loading SCMS...
        </div>
      </div>

      <style jsx global>{`
        @keyframes loadingBar {
          from {
            transform: scaleX(0);
          }
          to {
            transform: scaleX(1);
          }
        }
      `}</style>
    </div>
  );
}