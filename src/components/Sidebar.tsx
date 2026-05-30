"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import EdenAtelierLogo from "./EdenAtelierLogo";
import { createClient } from "@/lib/supabase/client";
import { getInitials } from "@/lib/format";

type Studio = {
  id: string;
  nome_studio: string;
  tipo: string | null;
  slug: string | null;
};

const navGroups = [
  {
    label: null,
    items: [
      { href: "/dashboard", label: "Início", icon: "home" },
      { href: "/projetos", label: "Projetos", icon: "folder" },
    ],
  },
  {
    label: "Atendimento",
    items: [
      { href: "/clientes", label: "Clientes", icon: "users" },
      { href: "/propostas", label: "Propostas", icon: "file-text" },
    ],
  },
  {
    label: "Criação",
    items: [
      { href: "/moodboards", label: "Moodboards", icon: "layout-grid" },
      { href: "/fornecedores", label: "Fornecedores", icon: "store" },
      { href: "/portfolio", label: "Portfólio", icon: "image" },
    ],
  },
  {
    label: "Gestão",
    items: [
      { href: "/financeiro", label: "Financeiro", icon: "dollar-sign" },
      { href: "/relatorios", label: "Relatórios", icon: "bar-chart" },
    ],
  },
  {
    label: "Sistema",
    items: [
      { href: "/configuracoes", label: "Configurações", icon: "settings" },
    ],
  },
];

function NavIcon({ name }: { name: string }) {
  const icons: Record<string, React.ReactNode> = {
    home: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
    folder: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>,
    users: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
    "file-text": <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>,
    "layout-grid": <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>,
    store: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>,
    image: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>,
    "dollar-sign": <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
    "bar-chart": <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
    settings: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
  };
  return <span className="nav-item-icon">{icons[name] || null}</span>;
}

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [studio, setStudio] = useState<Studio | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return;
      supabase
        .from("studios")
        .select("id, nome_studio, tipo, slug")
        .eq("owner_user_id", user.id)
        .single()
        .then(({ data }) => setStudio(data));
    });
  }, []);

  useEffect(() => {
    function handleToggle() { setOpen((o) => !o); }
    window.addEventListener("toggle-sidebar", handleToggle);
    return () => window.removeEventListener("toggle-sidebar", handleToggle);
  }, []);

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  }

  const tipoLabel: Record<string, string> = { interiores: "Design de Interiores", grafico: "Design Gráfico", misto: "Interiores & Gráfico" };

  return (
    <>
      {open && (
        <div className="lg:hidden fixed inset-0 z-30" style={{ background: "rgba(0,0,0,0.3)" }} onClick={() => setOpen(false)} />
      )}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-40 flex flex-col h-full transition-transform duration-200
          ${open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
        style={{
          width: "var(--sidebar-w)",
          background: "var(--surface)",
          borderRight: "1px solid var(--border)",
          flexShrink: 0,
        }}
      >
        <div className="px-5 pt-6 pb-4">
          <div className="flex items-center gap-2 mb-1">
            <EdenAtelierLogo size={28} />
            <span className="font-display text-base" style={{ color: "var(--brand-800)" }}>Eden Atelier</span>
          </div>
          <div className="divider-curve" />
          {studio && (
            <div className="flex items-center gap-3 mt-2">
              <div className="avatar avatar-md avatar-brand flex-shrink-0">
                {getInitials(studio.nome_studio)}
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-sm truncate" style={{ color: "var(--text-primary)" }}>{studio.nome_studio}</p>
                <p className="text-xs truncate" style={{ color: "var(--text-muted)" }}>{tipoLabel[studio.tipo || "interiores"] || studio.tipo}</p>
              </div>
            </div>
          )}
        </div>

        <nav className="flex-1 overflow-y-auto px-3 pb-4">
          {navGroups.map((group, gi) => (
            <div key={gi}>
              {group.label && <p className="nav-group-label">{group.label}</p>}
              {group.items.map((item) => {
                const active = pathname === item.href || pathname.startsWith(item.href + "/");
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`nav-item ${active ? "active" : ""}`}
                    onClick={() => setOpen(false)}
                  >
                    <NavIcon name={item.icon} />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        <div className="px-3 pb-6 border-t pt-4" style={{ borderColor: "var(--border)" }}>
          {studio?.slug && (
            <a
              href={`/${studio.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="nav-item text-xs mb-1"
              style={{ color: "var(--text-muted)" }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
              Ver portfólio público
            </a>
          )}
          <button onClick={handleSignOut} className="nav-item w-full" style={{ color: "var(--text-muted)" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            Sair
          </button>
        </div>
      </aside>
    </>
  );
}
