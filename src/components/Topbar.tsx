"use client";
import Link from "next/link";
import { ReactNode } from "react";

type Crumb = { href?: string; label: string };

export default function Topbar({
  title,
  subtitle,
  breadcrumb,
  children,
}: {
  title: string;
  subtitle?: string;
  breadcrumb?: Crumb[];
  children?: ReactNode;
}) {
  return (
    <header
      className="px-8 py-6 flex items-start justify-between gap-4 flex-shrink-0"
      style={{ borderBottom: "1px solid var(--border)", background: "var(--surface)" }}
    >
      <div>
        {breadcrumb && breadcrumb.length > 0 && (
          <nav className="flex items-center gap-1 mb-1 text-xs" style={{ color: "var(--text-muted)" }}>
            {breadcrumb.map((crumb, i) => (
              <span key={i} className="flex items-center gap-1">
                {i > 0 && <span>/</span>}
                {crumb.href ? (
                  <Link href={crumb.href} className="hover:underline" style={{ color: "var(--text-muted)" }}>
                    {crumb.label}
                  </Link>
                ) : (
                  <span>{crumb.label}</span>
                )}
              </span>
            ))}
          </nav>
        )}
        <button
          className="lg:hidden mr-2"
          onClick={() => window.dispatchEvent(new Event("toggle-sidebar"))}
          aria-label="Abrir menu"
          style={{ color: "var(--text-secondary)" }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
            <path d="M3 12h18M3 6h18M3 18h18" />
          </svg>
        </button>
        <h1 className="font-display" style={{ fontSize: "1.75rem" }}>{title}</h1>
        {subtitle && <p className="page-subtitle">{subtitle}</p>}
      </div>
      {children && <div className="flex items-center gap-2 flex-shrink-0">{children}</div>}
    </header>
  );
}
