import { formatDate, formatCurrency } from "@/lib/format";

type Etapa = {
  id: string;
  ordem: number;
  nome: string;
  descricao: string | null;
  status: string;
  percentual_pagamento: number | null;
  valor: number | null;
  pago: boolean;
  prazo: string | null;
  enviado_em: string | null;
  aprovado_em: string | null;
};

const statusLabel: Record<string, string> = {
  pendente: "Pendente",
  em_andamento: "Em andamento",
  aguardando_aprovacao: "Aguardando aprovação",
  aprovado: "Aprovado",
  rejeitado: "Rejeitado",
};

const statusBadge: Record<string, string> = {
  pendente: "badge-gray",
  em_andamento: "badge-accent",
  aguardando_aprovacao: "badge-blue",
  aprovado: "badge-green",
  rejeitado: "badge-red",
};

export default function EtapaCard({ etapa }: { etapa: Etapa }) {
  const cssStatus = etapa.status === "aguardando_aprovacao" ? "status-aguardando"
    : etapa.status === "aprovado" ? "status-aprovado"
    : etapa.status === "rejeitado" ? "status-rejeitado"
    : etapa.status === "em_andamento" ? "status-em-andamento"
    : "";

  return (
    <div className={`etapa-card ${cssStatus}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 500 }}>#{etapa.ordem}</span>
            <p className="font-display" style={{ fontSize: "0.9375rem" }}>{etapa.nome}</p>
          </div>
          {etapa.descricao && (
            <p style={{ fontSize: "0.8125rem", color: "var(--text-muted)", marginBottom: "0.5rem" }}>{etapa.descricao}</p>
          )}
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`badge ${statusBadge[etapa.status] || "badge-gray"}`}>{statusLabel[etapa.status] || etapa.status}</span>
            {etapa.prazo && (
              <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Prazo: {formatDate(etapa.prazo)}</span>
            )}
          </div>
        </div>
        <div className="text-right flex-shrink-0">
          {etapa.valor != null && (
            <p className="font-semibold" style={{ fontSize: "0.875rem" }}>{formatCurrency(etapa.valor)}</p>
          )}
          {etapa.percentual_pagamento != null && etapa.percentual_pagamento > 0 && (
            <p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{etapa.percentual_pagamento}%</p>
          )}
          <span
            className="text-xs"
            style={{ color: etapa.pago ? "var(--success)" : "var(--warning)" }}
          >
            {etapa.pago ? "Pago" : "Pendente"}
          </span>
        </div>
      </div>
    </div>
  );
}
