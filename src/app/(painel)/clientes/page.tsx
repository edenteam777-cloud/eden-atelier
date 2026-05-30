import { createClient } from "@/lib/supabase/server";
import Topbar from "@/components/Topbar";
import Link from "next/link";
import { getInitials } from "@/lib/format";

export default async function ClientesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: studio } = await supabase.from("studios").select("id").eq("owner_user_id", user.id).single();
  if (!studio) return null;
  const { data: clientes } = await supabase.from("clientes").select("*").eq("studio_id", studio.id).order("nome");

  const statusBadge: Record<string, string> = {
    lead: "badge-gray", qualificado: "badge-blue", ativo: "badge-green",
    inativo: "badge-yellow", encerrado: "badge-red",
  };

  return (
    <div>
      <Topbar title="Clientes">
        <Link href="/clientes/novo" className="btn btn-primary">+ Novo cliente</Link>
      </Topbar>
      <div className="p-8">
        {(clientes || []).length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">👤</div>
            <p className="empty-state-title">Nenhum cliente ainda</p>
            <p className="empty-state-desc">Adicione clientes para organizar seus projetos.</p>
            <Link href="/clientes/novo" className="btn btn-primary mt-4">Adicionar cliente</Link>
          </div>
        ) : (
          <div className="card overflow-hidden">
            <table className="table">
              <thead>
                <tr>
                  <th>Cliente</th>
                  <th>Empresa</th>
                  <th>Telefone</th>
                  <th>Status</th>
                  <th>Projetos</th>
                </tr>
              </thead>
              <tbody>
                {(clientes || []).map((c) => (
                  <tr key={c.id}>
                    <td>
                      <Link href={`/clientes/${c.id}`} className="flex items-center gap-3 hover:opacity-70 transition-opacity">
                        <span className="avatar avatar-sm avatar-brand">{getInitials(c.nome)}</span>
                        <div>
                          <p className="font-semibold text-sm">{c.nome}</p>
                          {c.email && <p className="text-xs" style={{ color: "var(--text-muted)" }}>{c.email}</p>}
                        </div>
                      </Link>
                    </td>
                    <td style={{ color: "var(--text-muted)" }}>{c.empresa || "—"}</td>
                    <td style={{ color: "var(--text-muted)" }}>{c.telefone || "—"}</td>
                    <td><span className={`badge ${statusBadge[c.status] || "badge-gray"}`}>{c.status}</span></td>
                    <td>{c.total_projetos}</td>
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
