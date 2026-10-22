import { ZONES } from '../data/tanks';

export function ZoneSelector({
  value,
  onChange,
}: {
  value: 'all' | number;
  onChange: (value: 'all' | number) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        onClick={() => onChange('all')}
        className={`rounded border px-3 py-1 ${
          value === 'all'
            ? 'border-sky-700 bg-sky-700 text-white'
            : 'border-slate-300 bg-white'
        }`}
      >
        All Zones
      </button>
      {ZONES.map((zone) => (
        <button
          type="button"
          key={zone}
          onClick={() => onChange(zone)}
          className={`rounded border px-3 py-1 ${
            value === zone
              ? 'border-sky-700 bg-sky-700 text-white'
              : 'border-slate-300 bg-white'
          }`}
        >
          Zone {zone}
        </button>
      ))}
    </div>
  );
}
