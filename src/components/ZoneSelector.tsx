import { ZONES } from '../data/tanks';

export function ZoneSelector({
  value,
  onChange,
}: {
  value: 'all' | number;
  onChange: (value: 'all' | number) => void;
}) {
  return (
    <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <button
        type="button"
        onClick={() => onChange('all')}
        className={`h-11 shrink-0 rounded-full px-4 text-sm font-medium ${
          value === 'all'
            ? 'bg-sky-800 text-white'
            : 'border border-slate-300 bg-white text-slate-700'
        }`}
      >
        All
      </button>
      {ZONES.map((zone) => (
        <button
          type="button"
          key={zone}
          onClick={() => onChange(zone)}
          className={`h-11 shrink-0 rounded-full px-4 text-sm font-medium ${
            value === zone
              ? 'bg-sky-800 text-white'
              : 'border border-slate-300 bg-white text-slate-700'
          }`}
        >
          Zone {zone}
        </button>
      ))}
    </div>
  );
}
