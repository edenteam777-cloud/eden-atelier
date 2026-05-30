import EtapaCard from "./EtapaCard";

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

export default function ProjetoTimeline({ etapas }: { etapas: Etapa[] }) {
  const sorted = [...etapas].sort((a, b) => a.ordem - b.ordem);
  if (sorted.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">📋</div>
        <p className="empty-state-title">Nenhuma etapa ainda</p>
        <p className="empty-state-desc">Adicione etapas para organizar o progresso do projeto.</p>
      </div>
    );
  }
  return (
    <div>
      {sorted.map((etapa) => (
        <EtapaCard key={etapa.id} etapa={etapa} />
      ))}
    </div>
  );
}
