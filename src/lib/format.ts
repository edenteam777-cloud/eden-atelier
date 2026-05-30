export function formatPhone(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 2) return digits.length ? `(${digits}` : "";
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

export function formatCurrency(value: number | null | undefined, moeda: string = "BRL"): string {
  const locale = moeda === "USD" ? "en-US" : moeda === "EUR" ? "de-DE" : "pt-BR";
  return new Intl.NumberFormat(locale, { style: "currency", currency: moeda }).format(value ?? 0);
}

export function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return "—";
  const [y, m, d] = dateStr.split("-");
  return `${d}/${m}/${y}`;
}

export function formatDateLong(dateStr: string | null | undefined): string {
  if (!dateStr) return "—";
  const date = new Date(dateStr + "T00:00:00");
  return date.toLocaleDateString("pt-BR", { day: "numeric", month: "long", year: "numeric" });
}

export function getInitials(name: string | null | undefined): string {
  if (!name) return "?";
  return name.split(" ").filter(Boolean).slice(0, 2).map(n => n[0]).join("").toUpperCase();
}

export function diasDesde(dateStr: string | null | undefined): number | null {
  if (!dateStr) return null;
  const data = new Date(dateStr + "T00:00:00");
  const hoje = new Date();
  return Math.floor((hoje.getTime() - data.getTime()) / 86400000);
}

export function diasAte(dateStr: string | null | undefined): number | null {
  if (!dateStr) return null;
  const data = new Date(dateStr + "T00:00:00");
  const hoje = new Date();
  return Math.ceil((data.getTime() - hoje.getTime()) / 86400000);
}

export function statusProjetoLabel(status: string): string {
  const map: Record<string, string> = {
    aguardando_briefing: "Aguardando briefing",
    briefing_recebido: "Briefing recebido",
    em_desenvolvimento: "Em desenvolvimento",
    em_revisao: "Em revisão",
    aprovado: "Aprovado",
    em_entrega: "Em entrega",
    concluido: "Concluído",
    cancelado: "Cancelado",
    pausado: "Pausado",
  };
  return map[status] || status;
}

export function statusProjetoBadge(status: string): string {
  const map: Record<string, string> = {
    aguardando_briefing: "badge-gray",
    briefing_recebido: "badge-blue",
    em_desenvolvimento: "badge-accent",
    em_revisao: "badge-yellow",
    aprovado: "badge-leaf",
    em_entrega: "badge-brand",
    concluido: "badge-green",
    cancelado: "badge-red",
    pausado: "badge-gray",
  };
  return map[status] || "badge-gray";
}

export function generateSlug(nome: string): string {
  return nome
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 50);
}
