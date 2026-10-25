export function WaterLevelBar({
  value,
  label,
}: {
  value: number | null;
  label: string;
}) {
  const width = Math.max(0, Math.min(100, value ?? 0));
  return (
    <div
      className="h-3 w-full overflow-hidden rounded-full bg-slate-200"
      aria-label={label}
    >
      <div className="h-full rounded-full bg-sky-600" style={{ width: `${width}%` }} />
    </div>
  );
}
