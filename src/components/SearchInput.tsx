export function SearchInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block w-full">
      <span className="mb-1 block text-sm font-medium text-slate-600">Search</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Tank, location, tag ID, zone"
        enterKeyHint="search"
        className="h-12 w-full rounded-xl border border-slate-300 bg-white px-3 text-base"
      />
    </label>
  );
}
