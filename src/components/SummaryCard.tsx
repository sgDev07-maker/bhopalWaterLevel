export function SummaryCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-3">
      <strong className="block text-lg leading-tight font-semibold break-words text-sky-900 tabular-nums sm:text-2xl">
        {value}
      </strong>
      <span className="mt-1 block text-xs text-slate-500 sm:text-sm">{label}</span>
    </article>
  );
}
