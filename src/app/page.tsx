import Link from "next/link";
import EdenAtelierLogo from "@/components/EdenAtelierLogo";
import CurvaDecorativa from "@/components/CurvaDecorativa";

export default function HomePage() {
  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center px-6 text-center relative"
      style={{ background: "var(--bg)" }}
    >
      <div className="max-w-xl w-full">
        <div className="flex justify-center mb-6">
          <EdenAtelierLogo size={56} />
        </div>
        <h1 className="font-display mb-4" style={{ fontSize: "3rem", lineHeight: 1.1 }}>
          Onde projetos viram experiência
        </h1>
        <p className="mb-8" style={{ fontSize: "1.0625rem", color: "var(--text-muted)", lineHeight: 1.7 }}>
          Gestão completa para designers de interiores e gráficos. Briefings inteligentes,
          moodboards integrados, portfólio público — tudo em um lugar.
        </p>
        <div className="flex items-center justify-center gap-4 mb-8">
          <Link href="/login" className="btn btn-secondary btn-lg">Entrar</Link>
          <Link href="/cadastro" className="btn btn-primary btn-lg">Começar agora</Link>
        </div>
        <div className="flex justify-center">
          <CurvaDecorativa width={240} />
        </div>
      </div>
      <footer className="absolute bottom-6 text-xs" style={{ color: "var(--text-muted)" }}>
        Eden Technology — 2026
      </footer>
    </main>
  );
}
