export default function CurvaDecorativa({ width = 200, color = "var(--brand-300)" }: { width?: number; color?: string }) {
  return (
    <svg width={width} height="24" viewBox="0 0 200 24" fill="none">
      <path d="M0 12 Q 50 -2, 100 12 T 200 12" stroke={color} strokeWidth="1.5" fill="none" strokeLinecap="round" />
    </svg>
  );
}
