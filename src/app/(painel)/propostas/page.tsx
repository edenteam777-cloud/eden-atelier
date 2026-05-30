import { createClient } from "@/lib/supabase/server";
import Topbar from "@/components/Topbar";
import Link from "next/link";
import { formatCurrency } from "@/lib/format";

export default async function PropostasPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: studio } = await supabase.from("studios").select("id").eq("owner_user_id", user.id).single();
  if (!studio) return null;
  const { data: propostas } = await supabase.from("propostas").select("*, clientes(nome)").eq("studio_id", studio.id).order("created_at", { ascending: false });

  const statusBadge: Record<string, string> = { rascunho: "badge-gray", enviada: "badge-blue", aprovada: "badge-green", rejeitada: "badge-red", expirada: "badge-yellow" };

  return (
    <div>
      <Topbar title="Propostas">
        <Link href="/propostas/nova" className="btn btn-primary">+ Nova proposta</Link>
      </Topbar>
      <div className="p-8">
        {(propostas || []).length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📄</div>
            <p className="empty-state-title">Nenhuma proposta ainda</p>
            <Link href="/propostas/nova" className="btn btn-primary mt-4">Criar proposta</Link>
          </div>
        ) : (
          <div className="card overflow-hidden">
            <table className="table">
              <thead>
                <tr><th>Título</th><th>Cliente</th><th>Valor</th><th>Status</th><th>Ação</th></tr>
              </thead>
              <tbody>
                {(propostas || []).map((p) => (
                  <tr key={p.id}>
                    <td><Link href={`/propostas/${p.id}`} className="font-semibold hover:underline">{p.titulo}</Link></td>
                    <td style={{ color: "var(--text-muted)" }}>{(p.clientes as { nome: string } | null)?.nome || "—"}</td>
                    <td>{formatCurrency(p.valor_total, p.moeda)}</td>
                    <td><span className={`badge ${statusBadge[p.status] || "badge-gray"}`}>{p.status}</span></td>
                    <td><Link href={`/propostas/${p.id}`} className="btn btn-ghost text-xs">Ver</Link></td>
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
