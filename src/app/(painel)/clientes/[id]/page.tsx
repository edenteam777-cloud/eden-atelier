import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Topbar from "@/components/Topbar";
import Link from "next/link";
import { getInitials, formatCurrency, statusProjetoLabel, statusProjetoBadge } from "@/lib/format";

export default async function ClienteDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: studio } = await supabase.from("studios").select("id, moeda_principal").eq("owner_user_id", user.id).single();
  if (!studio) return null;
  const { data: cliente } = await supabase.from("clientes").select("*").eq("id", id).eq("studio_id", studio.id).single();
  if (!cliente) notFound();

  const [{ data: projetos }, { data: propostas }] = await Promise.all([
    supabase.from("projetos").select("id, nome, status, data_entrega_prevista").eq("cliente_id", id).order("created_at", { ascending: false }),
    supabase.from("propostas").select("id, titulo, valor_total, moeda, status, enviada_em").eq("cliente_id", id).order("created_at", { ascending: false }),
  ]);

  const statusBadge: Record<string, string> = { lead: "badge-gray", qualificado: "badge-blue", ativo: "badge-green", inativo: "badge-yellow", encerrado: "badge-red" };

  return (
    <div>
      <Topbar title={cliente.nome} breadcrumb={[{ href: "/clientes", label: "Clientes" }, { label: cliente.nome }]}>
        <Link href={`/clientes/${id}/editar`} className="btn btn-secondary">Editar</Link>
        <Link href={`/projetos/novo?cliente=${id}`} className="btn btn-primary">+ Novo projeto</Link>
      </Topbar>
      <div className="p-8">
        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6">
          <div className="space-y-4">
            <div className="card-feature p-6 text-center">
              <div className="avatar avatar-lg avatar-brand mx-auto mb-3">{getInitials(cliente.nome)}</div>
              <h2 className="font-display mb-1" style={{ fontSize: "1.25rem" }}>{cliente.nome}</h2>
              <span className={`badge ${statusBadge[cliente.status] || "badge-gray"}`}>{cliente.status}</span>
              {cliente.tags && (
                <div className="flex flex-wrap gap-1 justify-center mt-3">
                  {cliente.tags.map((tag: string) => <span key={tag} className="badge badge-brand">{tag}</span>)}
                </div>
              )}
              <div className="mt-4 text-left space-y-2 text-sm" style={{ color: "var(--text-muted)" }}>
                {cliente.telefone && <p>📱 {cliente.telefone}</p>}
                {cliente.email && <p>✉️ {cliente.email}</p>}
                {cliente.cidade && <p>📍 {cliente.cidade}{cliente.estado ? `, ${cliente.estado}` : ""}</p>}
                {cliente.pais && cliente.pais !== "Brasil" && <p>🌍 {cliente.pais}</p>}
              </div>
              <div className="grid grid-cols-3 gap-2 mt-4 text-center">
                <div className="p-2 rounded-xl" style={{ background: "var(--bg-subtle)" }}>
                  <p className="font-semibold text-lg" style={{ fontFamily: "Fraunces, serif" }}>{cliente.total_projetos}</p>
                  <p className="text-xs" style={{ color: "var(--text-muted)" }}>Projetos</p>
                </div>
                <div className="p-2 rounded-xl" style={{ background: "var(--bg-subtle)" }}>
                  <p className="font-semibold text-sm" style={{ fontFamily: "Fraunces, serif" }}>{formatCurrency(cliente.valor_total_pago, cliente.moeda)}</p>
                  <p className="text-xs" style={{ color: "var(--text-muted)" }}>Pago</p>
                </div>
                <div className="p-2 rounded-xl" style={{ background: "var(--bg-subtle)" }}>
                  <p className="font-semibold text-lg" style={{ fontFamily: "Fraunces, serif" }}>{(projetos || []).filter((p) => p.status !== "concluido" && p.status !== "cancelado").length}</p>
                  <p className="text-xs" style={{ color: "var(--text-muted)" }}>Ativos</p>
                </div>
              </div>
              {cliente.telefone && (
                <a href={`https://wa.me/${cliente.telefone.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer" className="btn btn-secondary w-full mt-4">WhatsApp</a>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="card p-5">
              <h3 className="mb-4">Projetos</h3>
              {(projetos || []).length === 0 ? (
                <p style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>Nenhum projeto.</p>
              ) : (
                <div className="space-y-2">
                  {(projetos || []).map((p) => (
                    <Link key={p.id} href={`/projetos/${p.id}`} className="flex items-center justify-between p-3 rounded-xl hover:opacity-70 transition-opacity" style={{ background: "var(--bg-subtle)" }}>
                      <p className="font-semibold text-sm">{p.nome}</p>
                      <span className={`badge ${statusProjetoBadge(p.status)}`}>{statusProjetoLabel(p.status)}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <div className="card p-5">
              <h3 className="mb-4">Propostas</h3>
              {(propostas || []).length === 0 ? (
                <p style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>Nenhuma proposta.</p>
              ) : (
                <div className="space-y-2">
                  {(propostas || []).map((p) => (
                    <Link key={p.id} href={`/propostas/${p.id}`} className="flex items-center justify-between p-3 rounded-xl hover:opacity-70" style={{ background: "var(--bg-subtle)" }}>
                      <p className="font-semibold text-sm">{p.titulo}</p>
                      <span>{formatCurrency(p.valor_total, p.moeda)}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {cliente.observacoes && (
              <div className="card p-5">
                <h3 className="mb-3">Observações</h3>
                <p style={{ color: "var(--text-secondary)", lineHeight: 1.7, fontSize: "0.875rem" }}>{cliente.observacoes}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
