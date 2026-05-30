"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function Toaster() {
  const searchParams = useSearchParams();
  const [visible, setVisible] = useState(false);
  const [msg, setMsg] = useState("");
  const [type, setType] = useState("success");

  useEffect(() => {
    const toast = searchParams.get("toast");
    const t = searchParams.get("type") || "success";
    if (toast) {
      setMsg(decodeURIComponent(toast));
      setType(t);
      setVisible(true);
      const timer = setTimeout(() => setVisible(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [searchParams]);

  if (!visible) return null;

  return (
    <div
      className="fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xl shadow-lg text-sm font-medium"
      style={{
        background: type === "error" ? "var(--danger-bg)" : "var(--success-bg)",
        color: type === "error" ? "var(--danger)" : "var(--success)",
        border: `1px solid ${type === "error" ? "#E5BFB0" : "#C8D2B5"}`,
        boxShadow: "var(--shadow-lg)",
      }}
    >
      {msg}
    </div>
  );
}
