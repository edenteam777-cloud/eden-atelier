"use client";
import { useState, useRef, useEffect } from "react";

type Option = { value: string; label: string; color?: string };

export default function StatusMenu({
  current,
  options,
  onChange,
}: {
  current: string;
  options: Option[];
  onChange: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const currentOpt = options.find((o) => o.value === current);

  useEffect(() => {
    function handle(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  return (
    <div ref={ref} className="relative inline-block">
      <button
        onClick={() => setOpen(!open)}
        className="badge badge-gray cursor-pointer"
        style={{ color: currentOpt?.color }}
        aria-label="Alterar status"
      >
        {currentOpt?.label || current}
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>
      {open && (
        <div
          className="absolute top-full left-0 mt-1 rounded-xl border shadow-lg z-50 py-1 min-w-44"
          style={{ background: "var(--surface)", borderColor: "var(--border)", boxShadow: "var(--shadow-lg)" }}
        >
          {options.map((opt) => (
            <button
              key={opt.value}
              onClick={() => { onChange(opt.value); setOpen(false); }}
              className="w-full text-left px-4 py-2 text-sm hover:opacity-80 transition-opacity"
              style={{ color: opt.color || "var(--text-primary)" }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
