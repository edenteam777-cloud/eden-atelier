"use client";
import { useRouter } from "next/navigation";
import { statusProjetoLabel, statusProjetoBadge, diasAte, formatDate, getInitials } from "@/lib/format";

type Projeto = {
  id: string;
  nome: string;
  tipo: string | null;
  status: string;
  data_entrega_prevista: string | null;
  moeda: string;
  clientes?: { nome: string } | { nome: string }[] | null;
};

const STATUS_ORDER = [
  "aguardando_briefing",
  "briefing_recebido",
  "em_desenvolvimento",
  "em_revisao",
  "aprovado",
  "em_entrega",
  "concluido",
];

export default function ProjetoKanban({ projetos }: { projetos: Projeto[] }) {
  const router = useRouter();

  return (
    <div className="flex gap-4 overflow-x-auto pb-4" style={{ minHeight: "500px" }}>
      {STATUS_ORDER.map((status) => {
        const cols = projetos.filter((p) => p.status === status);
        return (
          <div key={status} className="kanban-column flex-shrink-0" style={{ width: "260px" }}>
            <div className="kanban-column-header">
              <span>{statusProjetoLabel(status)}</span>
              <span className="kanban-count">{cols.length}</span>
            </div>
            {cols.length === 0 && (
              <p style={{ color: "var(--text-disabled)", fontSize: "0.8125rem", textAlign: "center", marginTop: "2rem" }}>Vazio</p>
            )}
            {cols.map((proj) => {
              const prazo = diasAte(proj.data_entrega_prevista);
              const prazoColor = prazo !== null && prazo < 0 ? "var(--danger)" : prazo !== null && prazo <= 3 ? "var(--warning)" : "var(--text-muted)";
              const clienteNome = Array.isArray(proj.clientes) ? proj.clientes[0]?.nome : proj.clientes?.nome;
              return (
                <div
                  key={proj.id}
                  className="kanban-card"
                  onClick={() => router.push(`/projetos/${proj.id}`)}
                >
                  <p className="font-display mb-1" style={{ fontSize: "0.9375rem", color: "var(--text-primary)" }}>{proj.nome}</p>
                  {clienteNome && (
                    <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: "0.5rem" }}>{clienteNome}</p>
                  )}
                  <div className="flex items-center justify-between">
                    <span className={`badge ${statusProjetoBadge(proj.tipo || "interiores")}`}>{proj.tipo || "interiores"}</span>
                    {clienteNome && (
                      <span className="avatar avatar-sm avatar-gray">{getInitials(clienteNome)}</span>
                    )}
                  </div>
                  {proj.data_entrega_prevista && (
                    <p style={{ fontSize: "0.75rem", color: prazoColor, marginTop: "0.5rem" }}>
                      {prazo !== null && prazo < 0 ? `Atrasado ${Math.abs(prazo)}d` : `Entrega: ${formatDate(proj.data_entrega_prevista)}`}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
