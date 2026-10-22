export function SummaryCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <article className="rounded-lg border border-slate-200 bg-white p-4">
      <strong className="block text-2xl text-sky-900">{value}</strong>
      <span className="text-sm text-slate-500">{label}</span>
    </article>
  );
}
