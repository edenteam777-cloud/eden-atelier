import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import ProjetoTimeline from "@/components/ProjetoTimeline";
import ArquivosGaleria from "@/components/ArquivosGaleria";
import ChatProjeto from "@/components/ChatProjeto";
import { statusProjetoLabel } from "@/lib/format";
import EdenAtelierLogo from "@/components/EdenAtelierLogo";

export default async function ClienteProjetoPage({ params, searchParams }: {
  params: Promise<{ slug: string; id: string }>;
  searchParams: Promise<{ tab?: string }>;
}) {
  const { slug, id } = await params;
  const { tab = "progresso" } = await searchParams;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect(`/login?redirect=/${slug}/cliente`);

  const { data: studio } = await supabase.from("studios").select("id, nome_studio").eq("slug", slug).single();
  if (!studio) notFound();

  const { data: projeto } = await supabase.from("projetos").select("*").eq("id", id).eq("studio_id", studio.id).single();
  if (!projeto) notFound();

  const [{ data: etapas }, { data: arquivos }] = await Promise.all([
    supabase.from("etapas").select("*").eq("projeto_id", id).order("ordem"),
    supabase.from("arquivos").select("*").eq("projeto_id", id).eq("visivel_cliente", true),
  ]);

  const tabs = [
    { id: "progresso", label: "Progresso" },
    { id: "arquivos", label: "Arquivos" },
    { id: "chat", label: "Mensagens" },
  ];

  return (
    <div className="min-h-screen py-12 px-6" style={{ background: "var(--bg)" }}>
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <EdenAtelierLogo size={28} />
          <Link href={`/${slug}/cliente`} style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>{studio.nome_studio}</Link>
        </div>
        <h1 className="font-display mb-1" style={{ fontSize: "1.75rem" }}>{projeto.nome}</h1>
        <p className="mb-6" style={{ color: "var(--text-muted)" }}>{statusProjetoLabel(projeto.status)}</p>

        <div className="flex gap-2 mb-6">
          {tabs.map((t) => (
            <Link key={t.id} href={`/${slug}/cliente/projetos/${id}?tab=${t.id}`}
              className="btn"
              style={{
                background: tab === t.id ? "var(--brand-700)" : "var(--surface)",
                color: tab === t.id ? "var(--text-inverse)" : "var(--text-secondary)",
                borderColor: tab === t.id ? "var(--brand-700)" : "var(--border-strong)",
              }}
            >
              {t.label}
            </Link>
          ))}
        </div>

        {tab === "progresso" && (
          <div className="card-feature p-6">
            <ProjetoTimeline etapas={etapas || []} />
          </div>
        )}
        {tab === "arquivos" && <ArquivosGaleria arquivos={arquivos || []} />}
        {tab === "chat" && (
          <div className="card overflow-hidden" style={{ minHeight: "400px" }}>
            <ChatProjeto projetoId={id} />
          </div>
        )}
      </div>
    </div>
  );
}
