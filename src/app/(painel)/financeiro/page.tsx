import { createClient } from "@/lib/supabase/server";
import Topbar from "@/components/Topbar";
import { formatCurrency } from "@/lib/format";
import { RevenueChart } from "@/components/charts/DashboardCharts";

export default async function FinanceiroPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: studio } = await supabase.from("studios").select("id, moeda_principal").eq("owner_user_id", user.id).single();
  if (!studio) return null;

  const now = new Date();
  const mesInicio = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split("T")[0];
  const mesFim = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split("T")[0];

  const [{ data: receitas }, { data: despesas }, { data: transacoes }, { data: etapasPendentes }] = await Promise.all([
    supabase.from("transacoes").select("valor").eq("studio_id", studio.id).eq("tipo", "receita").gte("data", mesInicio).lte("data", mesFim),
    supabase.from("transacoes").select("valor").eq("studio_id", studio.id).eq("tipo", "despesa").gte("data", mesInicio).lte("data", mesFim),
    supabase.from("transacoes").select("*, projetos(nome), clientes(nome)").eq("studio_id", studio.id).order("data", { ascending: false }).limit(20),
    supabase.from("etapas").select("*, projetos(nome)").eq("studio_id", studio.id).eq("pago", false).not("valor", "is", null),
  ]);

  const totalReceita = (receitas || []).reduce((s, t) => s + (t.valor || 0), 0);
  const totalDespesa = (despesas || []).reduce((s, t) => s + (t.valor || 0), 0);
  const lucro = totalReceita - totalDespesa;
  const moeda = studio.moeda_principal;

  const mesesData = Array.from({ length: 12 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - 11 + i, 1);
    const mes = d.toLocaleDateString("pt-BR", { month: "short" });
    return { mes, valor: 0 };
  });

  return (
    <div>
      <Topbar title="Financeiro" />
      <div className="p-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="stat-card"><p className="stat-label">Receita do mês</p><p className="stat-value" style={{ fontSize: "1.5rem" }}>{formatCurrency(totalReceita, moeda)}</p></div>
          <div className="stat-card"><p className="stat-label">Despesas do mês</p><p className="stat-value" style={{ fontSize: "1.5rem" }}>{formatCurrency(totalDespesa, moeda)}</p></div>
          <div className="stat-card"><p className="stat-label">Lucro líquido</p><p className="stat-value" style={{ fontSize: "1.5rem", color: lucro >= 0 ? "var(--success)" : "var(--danger)" }}>{formatCurrency(lucro, moeda)}</p></div>
          <div className="stat-card"><p className="stat-label">A receber</p><p className="stat-value" style={{ fontSize: "1.5rem" }}>{formatCurrency((etapasPendentes || []).reduce((s, e) => s + (e.valor || 0), 0), moeda)}</p></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="card p-6">
            <h3 className="mb-4">Receita — últimos 12 meses</h3>
            <RevenueChart data={mesesData} />
          </div>
          <div className="card p-6">
            <h3 className="mb-4">A receber</h3>
            {(etapasPendentes || []).length === 0 ? (
              <p style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>Nenhum valor pendente.</p>
            ) : (
              <div className="space-y-2">
                {(etapasPendentes || []).slice(0, 6).map((e) => (
                  <div key={e.id} className="flex justify-between p-2 rounded-lg" style={{ background: "var(--bg-subtle)" }}>
                    <div>
                      <p className="text-sm font-semibold">{e.nome}</p>
                      <p className="text-xs" style={{ color: "var(--text-muted)" }}>{(e.projetos as { nome: string } | null)?.nome}</p>
                    </div>
                    <p className="font-semibold text-sm">{formatCurrency(e.valor || 0, moeda)}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="card overflow-hidden">
          <div className="px-6 py-4 flex items-center justify-between" style={{ borderBottom: "1px solid var(--border)" }}>
            <h3>Transações recentes</h3>
          </div>
          <table className="table">
            <thead><tr><th>Data</th><th>Descrição</th><th>Tipo</th><th>Valor</th></tr></thead>
            <tbody>
              {(transacoes || []).map((t) => (
                <tr key={t.id}>
                  <td style={{ color: "var(--text-muted)" }}>{t.data}</td>
                  <td>{t.descricao || "—"}</td>
                  <td><span className={`badge ${t.tipo === "receita" ? "badge-green" : "badge-red"}`}>{t.tipo}</span></td>
                  <td style={{ color: t.tipo === "receita" ? "var(--success)" : "var(--danger)", fontWeight: 600 }}>{formatCurrency(t.valor, t.moeda)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
