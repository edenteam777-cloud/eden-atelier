"use client";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts";
import { formatCurrency } from "@/lib/format";

const BRAND_COLORS = ["#A36A3A", "#C9A227", "#6B7E54", "#3D5466", "#BC8B5F", "#E0C168"];

type RevenueData = { mes: string; valor: number };
type StatusData = { status: string; count: number };
type ClienteData = { nome: string; valor: number };

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number; name?: string }>; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="card p-3 text-sm" style={{ boxShadow: "var(--shadow-lg)" }}>
      <p style={{ color: "var(--text-muted)", marginBottom: "0.25rem" }}>{label}</p>
      <p className="font-semibold">{formatCurrency(payload[0].value)}</p>
    </div>
  );
}

export function RevenueChart({ data }: { data: RevenueData[] }) {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
        <XAxis dataKey="mes" tick={{ fontSize: 11, fill: "var(--text-muted)" }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 11, fill: "var(--text-muted)" }} axisLine={false} tickLine={false} tickFormatter={(v) => `R$${(v/1000).toFixed(0)}k`} />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey="valor" fill="var(--brand-500)" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function ProjetosStatusChart({ data }: { data: StatusData[] }) {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <PieChart>
        <Pie data={data} dataKey="count" nameKey="status" cx="50%" cy="50%" outerRadius={70} innerRadius={40}>
          {data.map((_, i) => (
            <Cell key={i} fill={BRAND_COLORS[i % BRAND_COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => [value, "Projetos"]} />
        <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: "12px" }} />
      </PieChart>
    </ResponsiveContainer>
  );
}

export function TopClientesChart({ data }: { data: ClienteData[] }) {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data} layout="vertical" margin={{ top: 0, right: 16, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
        <XAxis type="number" tick={{ fontSize: 11, fill: "var(--text-muted)" }} axisLine={false} tickLine={false} tickFormatter={(v) => `R$${(v/1000).toFixed(0)}k`} />
        <YAxis type="category" dataKey="nome" tick={{ fontSize: 11, fill: "var(--text-muted)" }} axisLine={false} tickLine={false} width={90} />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey="valor" fill="var(--leaf-500)" radius={[0, 4, 4, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
