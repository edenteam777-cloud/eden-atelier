import { createClient } from "@/lib/supabase/server";
import Topbar from "@/components/Topbar";
import { formatCurrency } from "@/lib/format";
import { RevenueChart, ProjetosStatusChart, TopClientesChart } from "@/components/charts/DashboardCharts";

export default async function RelatoriosPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: studio } = await supabase.from("studios").select("id, moeda_principal").eq("owner_user_id", user.id).single();
  if (!studio) return null;

  const now = new Date();
  const [{ data: projetos }, { data: propostas }] = await Promise.all([
    supabase.from("projetos").select("status, tipo, data_inicio, data_entrega_real, revisoes_usadas").eq("studio_id", studio.id),
    supabase.from("propostas").select("status").eq("studio_id", studio.id),
  ]);

  const statusCount = (projetos || []).reduce<Record<string, number>>((acc, p) => {
    acc[p.status] = (acc[p.status] || 0) + 1;
    return acc;
  }, {});
  const statusData = Object.entries(statusCount).map(([status, count]) => ({ status, count }));
  const mesesData = Array.from({ length: 6 }, (_, i) => ({ mes: new Date(now.getFullYear(), now.getMonth() - 5 + i, 1).toLocaleDateString("pt-BR", { month: "short" }), valor: 0 }));
  const enviadas = (propostas || []).filter((p) => p.status !== "rascunho").length;
  const aprovadas = (propostas || []).filter((p) => p.status === "aprovada").length;
  const conversao = enviadas > 0 ? Math.round((aprovadas / enviadas) * 100) : 0;

  return (
    <div>
      <Topbar title="Relatórios" />
      <div className="p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="card p-6">
            <h3 className="mb-4">Receita — últimos 6 meses</h3>
            <RevenueChart data={mesesData} />
          </div>
          <div className="card p-6">
            <h3 className="mb-4">Distribuição por status</h3>
            {statusData.length > 0 ? <ProjetosStatusChart data={statusData} /> : <p style={{ color: "var(--text-muted)" }}>Sem dados.</p>}
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="stat-card">
            <p className="stat-label">Taxa de conversão</p>
            <p className="stat-value">{conversao}%</p>
            <p className="stat-delta" style={{ color: "var(--text-muted)" }}>{aprovadas}/{enviadas} propostas aprovadas</p>
          </div>
          <div className="stat-card">
            <p className="stat-label">Total de projetos</p>
            <p className="stat-value">{(projetos || []).length}</p>
          </div>
          <div className="stat-card">
            <p className="stat-label">Projetos concluídos</p>
            <p className="stat-value">{statusCount["concluido"] || 0}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
