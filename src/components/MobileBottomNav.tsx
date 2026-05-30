"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

const mainItems = [
  { href: "/dashboard", label: "Início", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg> },
  { href: "/projetos", label: "Projetos", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg> },
  { href: "/clientes", label: "Clientes", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg> },
  { href: "/financeiro", label: "Financeiro", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg> },
];

const moreItems = [
  { href: "/moodboards", label: "Moodboards" },
  { href: "/fornecedores", label: "Fornecedores" },
  { href: "/portfolio", label: "Portfólio" },
  { href: "/propostas", label: "Propostas" },
  { href: "/relatorios", label: "Relatórios" },
  { href: "/configuracoes", label: "Configurações" },
];

export default function MobileBottomNav() {
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const router = useRouter();

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  }

  return (
    <>
      <nav
        className="lg:hidden fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around px-2 py-2"
        style={{ background: "var(--surface)", borderTop: "1px solid var(--border)" }}
      >
        {mainItems.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition-colors"
              style={{ color: active ? "var(--brand-700)" : "var(--text-muted)" }}
            >
              {item.icon}
              <span style={{ fontSize: "0.625rem", fontWeight: 500 }}>{item.label}</span>
            </Link>
          );
        })}
        <button
          onClick={() => setDrawerOpen(true)}
          className="flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl"
          style={{ color: "var(--text-muted)" }}
          aria-label="Mais opções"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
            <circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/>
          </svg>
          <span style={{ fontSize: "0.625rem", fontWeight: 500 }}>Mais</span>
        </button>
      </nav>

      {drawerOpen && (
        <div className="lg:hidden fixed inset-0 z-50" onClick={() => setDrawerOpen(false)}>
          <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.3)" }} />
          <div
            className="absolute bottom-0 left-0 right-0 rounded-t-2xl p-6"
            style={{ background: "var(--surface)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="grid grid-cols-3 gap-3 mb-4">
              {moreItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setDrawerOpen(false)}
                  className="flex flex-col items-center gap-1 p-3 rounded-xl text-center text-sm"
                  style={{ background: "var(--bg-subtle)", color: "var(--text-secondary)" }}
                >
                  {item.label}
                </Link>
              ))}
            </div>
            <button
              onClick={handleSignOut}
              className="w-full btn btn-secondary mt-2"
            >
              Sair
            </button>
          </div>
        </div>
      )}
    </>
  );
}
