import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Topbar from "@/components/Topbar";
import Link from "next/link";
import ProjetoTimeline from "@/components/ProjetoTimeline";
import BriefingForm from "@/components/BriefingForm";
import MoodboardGrid from "@/components/MoodboardGrid";
import ArquivosGaleria from "@/components/ArquivosGaleria";
import ChatProjeto from "@/components/ChatProjeto";
import CurvaDecorativa from "@/components/CurvaDecorativa";
import { formatCurrency, formatDate, statusProjetoLabel, statusProjetoBadge } from "@/lib/format";

export default async function ProjetoDetailPage({ params, searchParams }: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ tab?: string }>;
}) {
  const { id } = await params;
  const { tab = "visao-geral" } = await searchParams;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: studio } = await supabase.from("studios").select("id, nome_studio, moeda_principal, taxa_revisao_extra").eq("owner_user_id", user.id).single();
  if (!studio) return null;

  const [{ data: projeto }, { data: etapas }, { data: briefing }, { data: moodboards }, { data: arquivos }] = await Promise.all([
    supabase.from("projetos").select("*, clientes(id, nome, telefone, email)").eq("id", id).eq("studio_id", studio.id).single(),
    supabase.from("etapas").select("*").eq("projeto_id", id).order("ordem"),
    supabase.from("briefings").select("*").eq("projeto_id", id).single(),
    supabase.from("moodboards").select("*, moodboard_itens(*)").eq("projeto_id", id),
    supabase.from("arquivos").select("*").eq("projeto_id", id),
  ]);

  if (!projeto) notFound();

  const etapasConcluidas = (etapas || []).filter((e) => e.status === "aprovado").length;
  const totalEtapas = (etapas || []).length;
  const progresso = totalEtapas > 0 ? Math.round((etapasConcluidas / totalEtapas) * 100) : 0;
  const cliente = projeto.clientes as { id: string; nome: string; telefone: string | null; email: string | null } | null;

  const tabs = [
    { id: "visao-geral", label: "Visão Geral" },
    { id: "etapas", label: "Etapas" },
    { id: "briefing", label: "Briefing" },
    { id: "moodboard", label: "Moodboard" },
    { id: "arquivos", label: "Arquivos" },
    { id: "chat", label: "Chat" },
  ];

  const allMoodboardItens = (moodboards || []).flatMap((m) => (m.moodboard_itens || []).map((item: { id: string; imagem_url: string; legenda: string | null; ordem: number }) => item));

  return (
    <div>
      <Topbar
        title={projeto.nome}
        breadcrumb={[{ href: "/projetos", label: "Projetos" }, { label: projeto.nome }]}
      />
      <div className="p-8">
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] xl:grid-cols-[280px_1fr_280px] gap-6">
          {/* Sidebar esquerda */}
          <div className="space-y-4">
            <div className="card p-5">
              <div className="mb-4 rounded-xl overflow-hidden" style={{ aspectRatio: "16/9", background: "var(--bg-subtle)" }}>
                {projeto.capa_url ? (
                  <img src={projeto.capa_url} alt="Capa" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl">✦</div>
                )}
              </div>
              <h2 className="font-display mb-3" style={{ fontSize: "1.125rem" }}>{projeto.nome}</h2>
              {cliente && (
                <Link href={`/clientes/${cliente.id}`} className="text-sm mb-3 block hover:underline" style={{ color: "var(--brand-600)" }}>
                  {cliente.nome}
                </Link>
              )}
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="badge badge-gray">{projeto.tipo}</span>
                {projeto.categoria && <span className="badge badge-brand">{projeto.categoria}</span>}
              </div>
              <span className={`badge ${statusProjetoBadge(projeto.status)}`}>{statusProjetoLabel(projeto.status)}</span>
              <div className="mt-4 space-y-2 text-sm" style={{ color: "var(--text-muted)" }}>
                {projeto.data_inicio && <p>Início: {formatDate(projeto.data_inicio)}</p>}
                {projeto.data_entrega_prevista && <p>Entrega: {formatDate(projeto.data_entrega_prevista)}</p>}
                {projeto.valor_total && <p className="font-semibold" style={{ color: "var(--text-primary)" }}>{formatCurrency(projeto.valor_total, projeto.moeda)}</p>}
              </div>
              <div className="mt-4">
                <div className="flex justify-between text-xs mb-1" style={{ color: "var(--text-muted)" }}>
                  <span>Progresso</span>
                  <span>{progresso}%</span>
                </div>
                <div className="rounded-full h-2" style={{ background: "var(--bg-subtle)" }}>
                  <div className="h-2 rounded-full transition-all" style={{ width: `${progresso}%`, background: "var(--brand-500)" }} />
                </div>
              </div>
              <div className="mt-4">
                <CurvaDecorativa width={160} color="var(--brand-200)" />
              </div>
              <Link href={`/projetos/${id}/editar`} className="btn btn-secondary w-full mt-3 text-sm">Editar projeto</Link>
            </div>
          </div>

          {/* Conteúdo central */}
          <div>
            <div className="flex gap-1 mb-6 overflow-x-auto">
              {tabs.map((t) => (
                <Link
                  key={t.id}
                  href={`/projetos/${id}?tab=${t.id}`}
                  className="btn flex-shrink-0"
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

            {tab === "visao-geral" && (
              <div className="space-y-4">
                {projeto.descricao && (
                  <div className="card p-5">
                    <h3 className="mb-2">Descrição</h3>
                    <p style={{ color: "var(--text-secondary)", lineHeight: 1.7 }}>{projeto.descricao}</p>
                  </div>
                )}
                <div className="card p-5">
                  <h3 className="mb-3">Próximas etapas</h3>
                  <ProjetoTimeline etapas={(etapas || []).slice(0, 3)} />
                </div>
              </div>
            )}

            {tab === "etapas" && (
              <div className="card p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3>Etapas</h3>
                  <Link href={`/projetos/${id}/etapas`} className="btn btn-secondary text-sm">Gerenciar etapas</Link>
                </div>
                <ProjetoTimeline etapas={etapas || []} />
              </div>
            )}

            {tab === "briefing" && (
              <div className="card p-5">
                <h3 className="mb-4">Briefing</h3>
                {briefing ? (
                  <div className="space-y-3 text-sm" style={{ color: "var(--text-secondary)" }}>
                    {briefing.objetivo && <div><strong>Objetivo:</strong> <p>{briefing.objetivo}</p></div>}
                    {briefing.estilo_preferido && <div><strong>Estilo:</strong> <p>{briefing.estilo_preferido}</p></div>}
                    {briefing.referencias_visuais && <div><strong>Referências:</strong> <p>{briefing.referencias_visuais}</p></div>}
                  </div>
                ) : (
                  <BriefingForm projetoId={id} tipo={projeto.tipo || "interiores"} studioId={studio.id} />
                )}
              </div>
            )}

            {tab === "moodboard" && (
              <div className="card p-5">
                <h3 className="mb-4">Moodboard</h3>
                <MoodboardGrid itens={allMoodboardItens} />
              </div>
            )}

            {tab === "arquivos" && (
              <div>
                <ArquivosGaleria arquivos={arquivos || []} />
              </div>
            )}

            {tab === "chat" && (
              <div className="card overflow-hidden" style={{ minHeight: "500px" }}>
                <ChatProjeto projetoId={id} />
              </div>
            )}
          </div>

          {/* Coluna direita */}
          <div className="hidden xl:block space-y-4">
            <div className="card p-5">
              <h4 className="mb-3">Revisões</h4>
              <p className="text-2xl font-semibold" style={{ fontFamily: "Fraunces, serif" }}>
                {projeto.revisoes_usadas}/{projeto.limite_revisoes}
              </p>
              <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>revisões usadas</p>
            </div>
            {cliente && (
              <div className="card p-5">
                <h4 className="mb-3">Cliente</h4>
                <p className="font-semibold text-sm">{cliente.nome}</p>
                {cliente.email && <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>{cliente.email}</p>}
                {cliente.telefone && (
                  <a
                    href={`https://wa.me/${cliente.telefone.replace(/\D/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-secondary w-full mt-3 text-xs"
                  >
                    WhatsApp
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
