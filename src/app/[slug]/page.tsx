import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import CurvaDecorativa from "@/components/CurvaDecorativa";
import EdenAtelierLogo from "@/components/EdenAtelierLogo";

export default async function PortfolioPublicoPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: studio } = await supabase.from("studios").select("*").eq("slug", slug).single();
  if (!studio) notFound();

  const { data: projetos } = await supabase
    .from("projetos")
    .select("id, nome, categoria, capa_url, tipo, clientes(nome), created_at")
    .eq("studio_id", studio.id)
    .eq("publicar_portfolio", true)
    .order("publicado_em", { ascending: false });

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh" }}>
      <div className="portfolio-hero">
        <div className="flex justify-center mb-4">
          <EdenAtelierLogo size={40} />
        </div>
        <h1 className="font-display" style={{ fontSize: "3.5rem", marginBottom: "1rem" }}>{studio.nome_studio}</h1>
        {studio.bio && (
          <p style={{ maxWidth: "560px", margin: "0 auto 1.5rem", color: "var(--text-muted)", fontSize: "1.0625rem", lineHeight: 1.7 }}>
            {studio.bio}
          </p>
        )}
        <div className="flex items-center justify-center gap-2 mb-6 flex-wrap">
          {studio.atende_remoto && <span className="badge badge-leaf">Atendimento remoto</span>}
          {studio.atende_internacional && <span className="badge badge-blue">Internacional</span>}
          {studio.atende_presencial && <span className="badge badge-gray">Presencial</span>}
        </div>
        <Link href={`/${slug}/briefing`} className="btn btn-primary btn-lg">Solicitar projeto</Link>
        <div className="flex justify-center mt-8">
          <CurvaDecorativa width={300} />
        </div>
      </div>

      <div className="portfolio-grid">
        {(projetos || []).map((p) => {
          const clienteRaw = p.clientes as unknown;
          const cliente = (Array.isArray(clienteRaw) ? clienteRaw[0] : clienteRaw) as { nome: string } | null;
          const ano = p.created_at ? new Date(p.created_at).getFullYear() : "";
          const nomeCliente = cliente?.nome ? cliente.nome.split(" ")[0] : "";
          return (
            <div key={p.id} className="portfolio-card">
              <div className="portfolio-card-image">
                {p.capa_url ? (
                  <img src={p.capa_url} alt={p.nome} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-5xl" style={{ background: "var(--bg-subtle)" }}>✦</div>
                )}
              </div>
              <div className="portfolio-card-content">
                <p className="portfolio-card-title font-display">{p.nome}</p>
                <p className="portfolio-card-meta">
                  {p.categoria && `${p.categoria} · `}{nomeCliente && `${nomeCliente} · `}{ano}
                </p>
              </div>
            </div>
          );
        })}
        {(projetos || []).length === 0 && (
          <div className="col-span-full text-center py-20" style={{ color: "var(--text-muted)" }}>
            <p>Nenhum projeto publicado ainda.</p>
          </div>
        )}
      </div>

      <footer className="text-center py-8" style={{ borderTop: "1px solid var(--border)", color: "var(--text-muted)", fontSize: "0.8125rem" }}>
        <p>Eden Atelier · {studio.nome_studio} · 2026</p>
        <Link href="/login" className="mt-2 inline-block" style={{ color: "var(--brand-600)" }}>Entrar (cliente)</Link>
      </footer>
    </div>
  );
}
