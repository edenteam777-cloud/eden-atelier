export default function SkeletonPage() {
  return (
    <div className="p-8 animate-pulse">
      <div className="h-8 rounded mb-6" style={{ background: "var(--bg-subtle)", width: "40%" }} />
      <div className="grid grid-cols-4 gap-4 mb-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-28 rounded-2xl" style={{ background: "var(--bg-subtle)" }} />
        ))}
      </div>
      <div className="h-64 rounded-2xl" style={{ background: "var(--bg-subtle)" }} />
    </div>
  );
}
