"use client";
import { ReactNode } from "react";

export default function FormCard({ title, description, children, className = "" }: {
  title?: string;
  description?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`card-feature p-7 ${className}`}>
      {title && <h2 className="mb-1">{title}</h2>}
      {description && <p className="text-sm mb-5" style={{ color: "var(--text-muted)" }}>{description}</p>}
      {children}
    </div>
  );
}
