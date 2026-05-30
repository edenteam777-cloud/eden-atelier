import Link from "next/link";
import EdenAtelierLogo from "@/components/EdenAtelierLogo";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center" style={{ background: "var(--bg)" }}>
      <EdenAtelierLogo size={40} />
      <h1 className="font-display mt-6 mb-2" style={{ fontSize: "4rem", color: "var(--text-muted)" }}>404</h1>
      <p className="mb-6" style={{ color: "var(--text-muted)" }}>Esta página não existe.</p>
      <Link href="/" className="btn btn-primary">Voltar ao início</Link>
    </div>
  );
}
