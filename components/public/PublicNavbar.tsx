"use client";

import Link from "next/link";
import {
  ArrowRight,
  Menu,
  Sparkles,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";

const links = [
  { label: "About", href: "/about" },
  { label: "Courses", href: "/courses" },
  { label: "Departments", href: "/departments" },
  { label: "Admissions", href: "/admissions" },
  { label: "Events", href: "/events" },
  { label: "Notices", href: "/notices" },
  { label: "Contact", href: "/contact" },
];

export default function PublicNavbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activePath, setActivePath] = useState("");

  useEffect(() => {
    setActivePath(window.location.pathname);

    const handleScroll = () => {
      setScrolled(window.scrollY > 16);
    };

    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setOpen(false);
      }
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header
        className={`site-header ${
          scrolled ? "site-header-scrolled" : ""
        }`}
      >
        {/* Animated top border */}
        <div className="header-rainbow-line" />

        {/* Moving light sweep */}
        <div className="header-light-sweep" />

        {/* Decorative particles */}
        <div className="header-particle particle-a" />
        <div className="header-particle particle-b" />
        <div className="header-particle particle-c" />
        <div className="header-particle particle-d" />

        <div className="container-page site-header-inner">
          {/* BRAND */}
          <Link
            href="/"
            className="site-brand"
            onClick={() => setOpen(false)}
          >
            <div className="site-logo-wrapper">
              <div className="site-logo-aura" />

              <div className="site-logo-ring ring-a" />
              <div className="site-logo-ring ring-b" />

              <div className="site-logo">
                <img
                  src="/college-logo.jpg"
                  alt="The National Degree College, Bagepalli"
                  width={54}
                  height={54}
                  className="site-logo-image"
                />
              </div>

              <span className="site-status-dot" />
            </div>

            <div className="site-brand-text">
              <div className="site-brand-title">
                THE NATIONAL DEGREE COLLEGE
              </div>

              <div className="site-brand-subtitle">
                <span>BAGEPALLI</span>
                <span className="subtitle-dot" />
                <span>SMART CAMPUS</span>
              </div>
            </div>
          </Link>

          {/* DESKTOP NAV */}
          <nav className="site-desktop-nav">
            {links.map((link) => {
              const isActive =
                activePath === link.href ||
                activePath.startsWith(`${link.href}/`);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`site-nav-link ${
                    isActive ? "site-nav-link-active" : ""
                  }`}
                >
                  <span>{link.label}</span>

                  <span className="nav-glow-dot" />

                  <span className="nav-underline" />
                </Link>
              );
            })}

            <Link
              href="/login"
              className="portal-button"
            >
              <span className="portal-shimmer" />

              <span className="portal-icon">
                <Sparkles className="h-3.5 w-3.5" />
              </span>

              <span>Login Portal</span>

              <ArrowRight className="portal-arrow h-3.5 w-3.5" />
            </Link>
          </nav>

          {/* MOBILE BUTTON */}
          <button
            type="button"
            aria-label={
              open
                ? "Close navigation"
                : "Open navigation"
            }
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
            className={`mobile-toggle ${
              open ? "mobile-toggle-open" : ""
            }`}
          >
            <span className="mobile-toggle-inner">
              {open ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </span>
          </button>
        </div>

        {/* MOBILE BACKDROP */}
        <div
          className={`mobile-backdrop ${
            open ? "mobile-backdrop-visible" : ""
          }`}
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />

        {/* MOBILE MENU */}
        <div
          className={`mobile-navigation ${
            open ? "mobile-navigation-open" : ""
          }`}
        >
          <div className="container-page mobile-navigation-inner">
            {/* Mobile heading */}
            <div className="mobile-nav-header">
              <div>
                <div className="mobile-nav-eyebrow">
                  SMART COLLEGE MANAGEMENT SYSTEM
                </div>

                <div className="mobile-nav-title">
                  Explore the campus
                </div>
              </div>

              <div className="mobile-online">
                <span />
                Online
              </div>
            </div>

            {/* Links */}
            <nav className="mobile-nav-list">
              {links.map((link, index) => {
                const isActive =
                  activePath === link.href ||
                  activePath.startsWith(
                    `${link.href}/`
                  );

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className={`mobile-nav-item ${
                      isActive
                        ? "mobile-nav-item-active"
                        : ""
                    }`}
                    style={{
                      transitionDelay: open
                        ? `${80 + index * 45}ms`
                        : "0ms",
                    }}
                  >
                    <span className="mobile-nav-number">
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <span className="mobile-nav-label">
                      {link.label}
                    </span>

                    <ArrowRight className="h-4 w-4" />
                  </Link>
                );
              })}
            </nav>

            {/* Login */}
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className="mobile-portal-button"
            >
              <span className="mobile-portal-left">
                <span className="mobile-portal-icon">
                  <Sparkles className="h-4 w-4" />
                </span>

                <span>
                  <strong>
                    Open Secure Portal
                  </strong>

                  <small>
                    Student & Admin access
                  </small>
                </span>
              </span>

              <ArrowRight className="h-5 w-5" />
            </Link>

            <div className="mobile-footer-line">
              THE NATIONAL DEGREE COLLEGE • BAGEPALLI
            </div>
          </div>
        </div>
      </header>

      <style jsx global>{`
        /* ==================================================
           HEADER BASE
        ================================================== */

        .site-header {
          position: sticky;
          top: 0;
          z-index: 100;
          overflow: visible;
          border-bottom: 1px solid rgba(226, 232, 240, 0.75);
          background: rgba(255, 255, 255, 0.78);
          backdrop-filter: blur(22px);
          -webkit-backdrop-filter: blur(22px);
          transition:
            background 0.3s ease,
            box-shadow 0.3s ease,
            transform 0.3s ease;
        }

        .site-header-scrolled {
          background: rgba(255, 255, 255, 0.95);
          box-shadow:
            0 12px 40px rgba(15, 23, 42, 0.08);
        }

        .site-header-inner {
          position: relative;
          z-index: 5;
          display: flex;
          height: 84px;
          align-items: center;
          justify-content: space-between;
          gap: 26px;
        }

        /* ==================================================
           TOP ANIMATED LINE
        ================================================== */

        .header-rainbow-line {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background:
            linear-gradient(
              90deg,
              #2563eb,
              #7c3aed,
              #db2777,
              #eab308,
              #16a34a,
              #2563eb
            );
          background-size: 300% 100%;
          animation: headerRainbow 8s linear infinite;
        }

        .header-light-sweep {
          position: absolute;
          inset: 0;
          pointer-events: none;
          overflow: hidden;
          opacity: 0.45;
        }

        .header-light-sweep::before {
          content: "";
          position: absolute;
          width: 35%;
          height: 100%;
          top: 0;
          left: -40%;
          background:
            linear-gradient(
              90deg,
              transparent,
              rgba(255, 255, 255, 0.42),
              transparent
            );
          transform: skewX(-20deg);
          animation: headerSweep 7s ease-in-out infinite;
        }

        /* ==================================================
           PARTICLES
        ================================================== */

        .header-particle {
          position: absolute;
          pointer-events: none;
          border-radius: 50%;
        }

        .particle-a {
          width: 5px;
          height: 5px;
          left: 34%;
          top: 20px;
          background: #3b82f6;
          box-shadow: 0 0 14px rgba(59, 130, 246, 0.6);
          animation: particleFloatA 5s ease-in-out infinite;
        }

        .particle-b {
          width: 4px;
          height: 4px;
          right: 26%;
          top: 29px;
          background: #8b5cf6;
          box-shadow: 0 0 14px rgba(139, 92, 246, 0.6);
          animation: particleFloatB 6s ease-in-out infinite;
        }

        .particle-c {
          width: 3px;
          height: 3px;
          right: 40%;
          top: 15px;
          background: #eab308;
          box-shadow: 0 0 12px rgba(234, 179, 8, 0.6);
          animation: particleFloatC 4s ease-in-out infinite;
        }

        .particle-d {
          width: 4px;
          height: 4px;
          left: 57%;
          top: 63px;
          background: #22c55e;
          opacity: 0.7;
          animation: particleFloatD 7s ease-in-out infinite;
        }

        /* ==================================================
           BRAND
        ================================================== */

        .site-brand {
          display: inline-flex;
          min-width: 0;
          align-items: center;
          gap: 13px;
          text-decoration: none;
        }

        .site-logo-wrapper {
          position: relative;
          width: 56px;
          height: 56px;
          flex-shrink: 0;
        }

        .site-logo-aura {
          position: absolute;
          inset: 0;
          border-radius: 18px;
          background:
            linear-gradient(
              135deg,
              rgba(37, 99, 235, 0.25),
              rgba(124, 58, 237, 0.20),
              rgba(234, 179, 8, 0.18)
            );
          filter: blur(10px);
          opacity: 0.45;
          animation: logoAura 4s ease-in-out infinite;
        }

        .site-logo {
          position: relative;
          z-index: 3;
          display: grid;
          height: 53px;
          width: 53px;
          place-items: center;
          overflow: hidden;
          border-radius: 16px;
          border: 1px solid rgba(226, 232, 240, 0.95);
          background: white;
          box-shadow:
            0 8px 22px rgba(15, 23, 42, 0.08),
            inset 0 1px 0 white;
          transition:
            transform 0.3s cubic-bezier(.16,1,.3,1),
            box-shadow 0.3s ease;
        }

        .site-brand:hover .site-logo {
          transform:
            translateY(-2px)
            rotate(-3deg)
            scale(1.03);
          box-shadow:
            0 15px 30px rgba(37, 99, 235, 0.15);
        }

        .site-logo-image {
          display: block;
          height: 46px;
          width: 46px;
          object-fit: contain;
          padding: 2px;
        }

        .site-logo-ring {
          position: absolute;
          inset: -4px;
          border-radius: 19px;
          border: 1px solid transparent;
          pointer-events: none;
        }

        .ring-a {
          border-color: rgba(59, 130, 246, 0.18);
          animation: logoRing 5s linear infinite;
        }

        .ring-b {
          inset: -7px;
          border-color: rgba(139, 92, 246, 0.12);
          animation:
            logoRingReverse
            7s
            linear
            infinite;
        }

        .site-status-dot {
          position: absolute;
          right: -2px;
          bottom: 0;
          z-index: 5;
          width: 11px;
          height: 11px;
          border-radius: 50%;
          border: 2px solid white;
          background: #22c55e;
          box-shadow:
            0 0 0 3px rgba(34, 197, 94, 0.10),
            0 0 14px rgba(34, 197, 94, 0.55);
          animation: statusPulse 2s ease-in-out infinite;
        }

        .site-brand-text {
          min-width: 0;
        }

        .site-brand-title {
          max-width: 330px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          color: var(--navy);
          font-size: 13px;
          font-weight: 950;
          letter-spacing: -0.015em;
        }

        .site-brand-subtitle {
          display: flex;
          align-items: center;
          gap: 7px;
          margin-top: 3px;
          color: #64748b;
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 0.16em;
        }

        .subtitle-dot {
          width: 3px;
          height: 3px;
          border-radius: 50%;
          background: var(--gold);
          box-shadow: 0 0 6px rgba(234, 179, 8, 0.4);
        }

        /* ==================================================
           DESKTOP NAV
        ================================================== */

        .site-desktop-nav {
          display: flex;
          align-items: center;
          gap: 2px;
        }

        .site-nav-link {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 11px 10px;
          color: #475569;
          font-size: 12px;
          font-weight: 800;
          text-decoration: none;
          transition:
            color 0.2s ease,
            transform 0.2s ease;
        }

        .site-nav-link:hover {
          color: var(--blue);
          transform: translateY(-1px);
        }

        .site-nav-link-active {
          color: var(--blue);
        }

        .nav-underline {
          position: absolute;
          left: 10px;
          right: 10px;
          bottom: 4px;
          height: 2px;
          overflow: hidden;
          border-radius: 999px;
          background:
            linear-gradient(
              90deg,
              #2563eb,
              #7c3aed,
              #ec4899
            );
          transform:
            scaleX(
              0
            );
          transform-origin: center;
          transition: transform 0.25s ease;
        }

        .site-nav-link:hover .nav-underline,
        .site-nav-link-active .nav-underline {
          transform: scaleX(1);
        }

        .nav-glow-dot {
          position: absolute;
          width: 4px;
          height: 4px;
          top: 5px;
          right: 5px;
          border-radius: 50%;
          background: #8b5cf6;
          opacity: 0;
          transform: scale(0);
          transition:
            opacity 0.2s ease,
            transform 0.2s ease;
        }

        .site-nav-link:hover .nav-glow-dot {
          opacity: 1;
          transform: scale(1);
        }

        /* ==================================================
           LOGIN BUTTON
        ================================================== */

        .portal-button {
          position: relative;
          isolation: isolate;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          margin-left: 8px;
          overflow: hidden;
          padding: 11px 15px;
          border-radius: 13px;
          background:
            linear-gradient(
              135deg,
              #2563eb 0%,
              #4f46e5 55%,
              #7c3aed 100%
            );
          color: white;
          font-size: 11px;
          font-weight: 900;
          text-decoration: none;
          box-shadow:
            0 9px 25px rgba(37, 99, 235, 0.20);
          transition:
            transform 0.2s ease,
            box-shadow 0.25s ease;
        }

        .portal-button:hover {
          transform: translateY(-3px);
          box-shadow:
            0 16px 32px rgba(37, 99, 235, 0.28);
        }

        .portal-shimmer {
          position: absolute;
          inset: 0;
          z-index: -1;
          width: 45%;
          background:
            linear-gradient(
              90deg,
              transparent,
              rgba(255, 255, 255, 0.38),
              transparent
            );
          transform: skewX(-20deg) translateX(-170%);
          animation: buttonShimmer 4.5s ease-in-out infinite;
        }

        .portal-icon {
          display: grid;
          height: 24px;
          width: 24px;
          place-items: center;
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.14);
        }

        .portal-arrow {
          transition:
            transform 0.2s ease;
        }

        .portal-button:hover .portal-arrow {
          transform: translateX(3px);
        }

        /* ==================================================
           MOBILE
        ================================================== */

        .mobile-toggle {
          display: none;
          border: 0;
          background: transparent;
          padding: 3px;
        }

        .mobile-toggle-inner {
          display: grid;
          width: 44px;
          height: 44px;
          place-items: center;
          border-radius: 14px;
          border: 1px solid #e2e8f0;
          background: rgba(255, 255, 255, 0.9);
          color: var(--navy);
          box-shadow:
            0 7px 18px rgba(15, 23, 42, 0.05);
          transition:
            transform 0.2s ease,
            background 0.2s ease,
            color 0.2s ease;
        }

        .mobile-toggle:hover .mobile-toggle-inner,
        .mobile-toggle-open .mobile-toggle-inner {
          transform: rotate(4deg);
          background: #eff6ff;
          color: var(--blue);
        }

        .mobile-backdrop {
          position: fixed;
          inset: 0;
          z-index: -1;
          visibility: hidden;
          background: rgba(15, 23, 42, 0.20);
          opacity: 0;
          backdrop-filter: blur(2px);
          transition:
            opacity 0.3s ease,
            visibility 0.3s ease;
        }

        .mobile-backdrop-visible {
          visibility: visible;
          opacity: 1;
        }

        .mobile-navigation {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          overflow: hidden;
          max-height: 0;
          opacity: 0;
          transform:
            translateY(-12px)
            scaleY(0.98);
          transform-origin: top;
          border-top: 1px solid transparent;
          background: rgba(255, 255, 255, 0.96);
          box-shadow:
            0 25px 60px rgba(15, 23, 42, 0.12);
          backdrop-filter: blur(22px);
          -webkit-backdrop-filter: blur(22px);
          transition:
            max-height 0.45s cubic-bezier(.16,1,.3,1),
            opacity 0.3s ease,
            transform 0.35s cubic-bezier(.16,1,.3,1),
            border-color 0.25s ease;
        }

        .mobile-navigation-open {
          max-height: 760px;
          opacity: 1;
          transform:
            translateY(0)
            scaleY(1);
          border-color: #e2e8f0;
        }

        .mobile-navigation-inner {
          padding-top: 18px;
          padding-bottom: 20px;
        }

        .mobile-nav-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 15px;
          padding-bottom: 15px;
          border-bottom: 1px solid #f1f5f9;
        }

        .mobile-nav-eyebrow {
          color: #64748b;
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 0.14em;
        }

        .mobile-nav-title {
          margin-top: 4px;
          color: var(--navy);
          font-size: 20px;
          font-weight: 950;
        }

        .mobile-online {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 7px 9px;
          border-radius: 999px;
          border: 1px solid #dcfce7;
          background: #f0fdf4;
          color: #15803d;
          font-size: 8px;
          font-weight: 900;
          text-transform: uppercase;
        }

        .mobile-online span {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #22c55e;
          box-shadow:
            0 0 9px rgba(34, 197, 94, 0.55);
          animation:
            statusPulse
            2s
            ease-in-out
            infinite;
        }

        .mobile-nav-list {
          display: grid;
          gap: 5px;
          margin-top: 12px;
        }

        .mobile-nav-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 13px;
          border-radius: 13px;
          color: #334155;
          opacity: 0;
          transform: translateX(-12px);
          text-decoration: none;
          transition:
            opacity 0.3s ease,
            transform 0.3s ease,
            background 0.2s ease,
            color 0.2s ease;
        }

        .mobile-navigation-open .mobile-nav-item {
          opacity: 1;
          transform: translateX(0);
        }

        .mobile-nav-item:hover {
          background: #eff6ff;
          color: var(--blue);
        }

        .mobile-nav-item-active {
          background: linear-gradient(
            90deg,
            #eff6ff,
            #f5f3ff
          );
          color: var(--blue);
        }

        .mobile-nav-number {
          width: 24px;
          color: #94a3b8;
          font-size: 9px;
          font-weight: 900;
        }

        .mobile-nav-label {
          flex: 1;
          font-size: 13px;
          font-weight: 850;
        }

        .mobile-portal-button {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin-top: 14px;
          overflow: hidden;
          padding: 14px;
          border-radius: 16px;
          background:
            linear-gradient(
              135deg,
              #2563eb,
              #4f46e5,
              #7c3aed
            );
          color: white;
          text-decoration: none;
          box-shadow:
            0 12px 28px rgba(37, 99, 235, 0.22);
        }

        .mobile-portal-button::before {
          content: "";
          position: absolute;
          width: 40%;
          top: 0;
          bottom: 0;
          left: -45%;
          background:
            linear-gradient(
              90deg,
              transparent,
              rgba(255, 255, 255, 0.28),
              transparent
            );
          transform: skewX(-20deg);
          animation:
            mobileButtonShimmer
            4s
            ease-in-out
            infinite;
        }

        .mobile-portal-left {
          display: inline-flex;
          align-items: center;
          gap: 10px;
        }

        .mobile-portal-icon {
          display: grid;
          width: 38px;
          height: 38px;
          place-items: center;
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.13);
        }

        .mobile-portal-button strong {
          display: block;
          font-size: 12px;
          font-weight: 900;
        }

        .mobile-portal-button small {
          display: block;
          margin-top: 2px;
          color: #bfdbfe;
          font-size: 9px;
        }

        .mobile-footer-line {
          margin-top: 14px;
          text-align: center;
          color: #94a3b8;
          font-size: 7px;
          font-weight: 900;
          letter-spacing: 0.17em;
        }

        /* ==================================================
           RESPONSIVE
        ================================================== */

        @media (max-width: 1100px) {
          .site-desktop-nav {
            gap: 0;
          }

          .site-nav-link {
            padding-left: 7px;
            padding-right: 7px;
          }

          .site-brand-title {
            max-width: 270px;
          }
        }

        @media (max-width: 1023px) {
          .site-desktop-nav {
            display: none;
          }

          .mobile-toggle {
            display: block;
          }

          .site-header-inner {
            height: 78px;
          }
        }

        @media (max-width: 640px) {
          .site-header-inner {
            height: 72px;
          }

          .site-brand {
            gap: 10px;
          }

          .site-logo-wrapper {
            width: 48px;
            height: 48px;
          }

          .site-logo {
            width: 46px;
            height: 46px;
            border-radius: 13px;
          }

          .site-logo-image {
            width: 40px;
            height: 40px;
          }

          .site-brand-title {
            max-width: 220px;
            font-size: 10px;
          }

          .site-brand-subtitle {
            font-size: 7px;
            gap: 5px;
          }

          .mobile-toggle-inner {
            width: 42px;
            height: 42px;
          }
        }

        /* ==================================================
           ANIMATIONS
        ================================================== */

        @keyframes headerRainbow {
          0% {
            background-position: 0% 50%;
          }

          50% {
            background-position: 100% 50%;
          }

          100% {
            background-position: 0% 50%;
          }
        }

        @keyframes headerSweep {
          0%,
          60% {
            transform: translateX(0) skewX(-20deg);
          }

          80% {
            transform: translateX(500%) skewX(-20deg);
          }

          100% {
            transform: translateX(500%) skewX(-20deg);
          }
        }

        @keyframes particleFloatA {
          0%,
          100% {
            transform:
              translate(0, 0)
              scale(1);
          }

          50% {
            transform:
              translate(18px, 7px)
              scale(1.35);
          }
        }

        @keyframes particleFloatB {
          0%,
          100% {
            transform:
              translate(0, 0)
              scale(1);
          }

          50% {
            transform:
              translate(-14px, 9px)
              scale(1.3);
          }
        }

        @keyframes particleFloatC {
          0%,
          100% {
            transform: translateY(0);
          }

          50% {
            transform: translateY(10px);
          }
        }

        @keyframes particleFloatD {
          0%,
          100% {
            transform:
              translate(0, 0)
              scale(1);
          }

          50% {
            transform:
              translate(12px, -8px)
              scale(1.25);
          }
        }

        @keyframes logoAura {
          0%,
          100% {
            transform: scale(0.98);
            opacity: 0.38;
          }

          50% {
            transform: scale(1.08);
            opacity: 0.6;
          }
        }

        @keyframes logoRing {
          from {
            transform: rotate(0deg);
          }

          to {
            transform: rotate(360deg);
          }
        }

        @keyframes logoRingReverse {
          from {
            transform: rotate(360deg);
          }

          to {
            transform: rotate(0deg);
          }
        }

        @keyframes statusPulse {
          0%,
          100% {
            transform: scale(1);
            opacity: 1;
          }

          50% {
            transform: scale(1.3);
            opacity: 0.65;
          }
        }

        @keyframes buttonShimmer {
          0%,
          55% {
            transform: skewX(-20deg) translateX(-170%);
          }

          75% {
            transform: skewX(-20deg) translateX(380%);
          }

          100% {
            transform: skewX(-20deg) translateX(380%);
          }
        }

        @keyframes mobileButtonShimmer {
          0%,
          55% {
            transform: skewX(-20deg) translateX(-170%);
          }

          75% {
            transform: skewX(-20deg) translateX(380%);
          }

          100% {
            transform: skewX(-20deg) translateX(380%);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </>
  );
}