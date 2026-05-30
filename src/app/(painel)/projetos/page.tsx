import { createClient } from "@/lib/supabase/server";
import Topbar from "@/components/Topbar";
import Link from "next/link";
import ProjetoKanban from "@/components/ProjetoKanban";
import { statusProjetoBadge, statusProjetoLabel, formatCurrency, formatDate } from "@/lib/format";

export default async function ProjetosPage({ searchParams }: { searchParams: Promise<{ view?: string }> }) {
  const params = await searchParams;
  const view = params.view || "kanban";
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: studio } = await supabase.from("studios").select("id").eq("owner_user_id", user.id).single();
  if (!studio) return null;

  const { data: projetos } = await supabase
    .from("projetos")
    .select("id, nome, tipo, status, data_entrega_prevista, valor_total, moeda, clientes(nome)")
    .eq("studio_id", studio.id)
    .order("created_at", { ascending: false });

  return (
    <div>
      <Topbar title="Projetos">
        <Link href="/projetos/novo" className="btn btn-primary">+ Novo projeto</Link>
      </Topbar>
      <div className="p-8">
        <div className="flex gap-2 mb-6">
          <Link href="/projetos?view=kanban" className={`btn ${view === "kanban" ? "btn-primary" : "btn-secondary"}`}>Kanban</Link>
          <Link href="/projetos?view=lista" className={`btn ${view === "lista" ? "btn-primary" : "btn-secondary"}`}>Lista</Link>
        </div>

        {(projetos || []).length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📁</div>
            <p className="empty-state-title">Nenhum projeto ainda</p>
            <p className="empty-state-desc">Crie seu primeiro projeto para começar.</p>
            <Link href="/projetos/novo" className="btn btn-primary mt-4">Criar projeto</Link>
          </div>
        ) : view === "kanban" ? (
          <ProjetoKanban projetos={projetos || []} />
        ) : (
          <div className="card overflow-hidden">
            <table className="table">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Cliente</th>
                  <th>Tipo</th>
                  <th>Status</th>
                  <th>Valor</th>
                  <th>Prazo</th>
                </tr>
              </thead>
              <tbody>
                {(projetos || []).map((p) => (
                  <tr key={p.id}>
                    <td><Link href={`/projetos/${p.id}`} className="font-semibold hover:underline">{p.nome}</Link></td>
                    <td style={{ color: "var(--text-muted)" }}>{(p.clientes as unknown as { nome: string } | null)?.nome || "—"}</td>
                    <td><span className="badge badge-gray">{p.tipo}</span></td>
                    <td><span className={`badge ${statusProjetoBadge(p.status)}`}>{statusProjetoLabel(p.status)}</span></td>
                    <td>{p.valor_total ? formatCurrency(p.valor_total, p.moeda) : "—"}</td>
                    <td style={{ color: "var(--text-muted)" }}>{formatDate(p.data_entrega_prevista)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
