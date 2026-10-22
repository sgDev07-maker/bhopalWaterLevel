export function SearchInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="min-w-48 flex-1">
      <span className="sr-only">Search tanks</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search tanks..."
        className="w-full rounded border border-slate-300 bg-white px-3 py-2"
      />
    </label>
  );
}
