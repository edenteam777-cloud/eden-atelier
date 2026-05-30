import { formatCurrency, formatDate, formatDateLong } from "@/lib/format";

type Proposta = {
  id: string;
  numero: string | null;
  titulo: string;
  escopo: string | null;
  valor_total: number;
  moeda: string;
  forma_pagamento: string | null;
  prazo_estimado_dias: number | null;
  validade_dias: number | null;
  status: string;
  enviada_em: string | null;
  clientes?: { nome: string; email: string | null } | null;
  studios?: { nome_studio: string; logo_url: string | null } | null;
};

export default function PropostaPreview({ proposta }: { proposta: Proposta }) {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="card-feature p-10">
        <div className="flex items-start justify-between mb-8">
          <div>
            {proposta.studios?.nome_studio && (
              <p className="text-sm mb-1" style={{ color: "var(--text-muted)" }}>{proposta.studios.nome_studio}</p>
            )}
            <h1 className="font-display" style={{ fontSize: "2rem" }}>{proposta.titulo}</h1>
            {proposta.numero && <p style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>Proposta #{proposta.numero}</p>}
          </div>
          <div className="text-right">
            {proposta.enviada_em && (
              <p style={{ color: "var(--text-muted)", fontSize: "0.8125rem" }}>{formatDateLong(proposta.enviada_em.split("T")[0])}</p>
            )}
          </div>
        </div>

        {proposta.clientes?.nome && (
          <div className="mb-6 p-4 rounded-xl" style={{ background: "var(--bg-subtle)" }}>
            <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: "0.25rem" }}>PARA</p>
            <p className="font-semibold">{proposta.clientes.nome}</p>
            {proposta.clientes.email && <p style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>{proposta.clientes.email}</p>}
          </div>
        )}

        {proposta.escopo && (
          <div className="mb-8">
            <h3 className="mb-3">Escopo do projeto</h3>
            <div style={{ whiteSpace: "pre-wrap", fontSize: "0.875rem", color: "var(--text-secondary)", lineHeight: 1.7 }}>
              {proposta.escopo}
            </div>
          </div>
        )}

        <div className="divider-curve" />

        <div className="text-center my-8">
          <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.5rem" }}>Valor total</p>
          <p className="stat-value">{formatCurrency(proposta.valor_total, proposta.moeda)}</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {proposta.forma_pagamento && (
            <div className="p-4 rounded-xl" style={{ background: "var(--bg-subtle)" }}>
              <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: "0.25rem" }}>PAGAMENTO</p>
              <p className="text-sm">{proposta.forma_pagamento}</p>
            </div>
          )}
          {proposta.prazo_estimado_dias && (
            <div className="p-4 rounded-xl" style={{ background: "var(--bg-subtle)" }}>
              <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: "0.25rem" }}>PRAZO</p>
              <p className="text-sm">{proposta.prazo_estimado_dias} dias</p>
            </div>
          )}
          {proposta.validade_dias && (
            <div className="p-4 rounded-xl" style={{ background: "var(--bg-subtle)" }}>
              <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: "0.25rem" }}>VALIDADE</p>
              <p className="text-sm">{proposta.validade_dias} dias</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
