export default function EdenAtelierLogo({ size = 32, color = "var(--brand-700)" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <path
        d="M4 28 Q 14 8, 20 14 T 36 12"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="20" cy="14" r="2" fill={color} />
    </svg>
  );
}
