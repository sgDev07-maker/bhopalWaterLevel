import { ZONES } from '../data/tanks';
import type { TankStatus } from '../types/tank';
import { FilterDropdown } from './FilterDropdown';
import { SearchInput } from './SearchInput';

export function TankFilters({
  search,
  onSearch,
  zone,
  onZone,
  status,
  onStatus,
  refreshing,
  autoRefresh,
  onAutoRefresh,
  onRefresh,
}: {
  search: string;
  onSearch: (value: string) => void;
  zone: 'all' | number;
  onZone: (value: 'all' | number) => void;
  status: 'all' | TankStatus;
  onStatus: (value: 'all' | TankStatus) => void;
  refreshing: boolean;
  autoRefresh: boolean;
  onAutoRefresh: (value: boolean) => void;
  onRefresh: () => void;
}) {
  return (
    <section className="mb-4 flex flex-wrap items-center gap-2">
      <SearchInput value={search} onChange={onSearch} />
      <FilterDropdown
        id="zone"
        label="Zone"
        value={zone === 'all' ? 'all' : String(zone)}
        onChange={(value) => onZone(value === 'all' ? 'all' : Number(value))}
        options={[
          { value: 'all', label: 'All Zones' },
          ...ZONES.map((z) => ({ value: String(z), label: `Zone ${z}` })),
        ]}
      />
      <FilterDropdown
        id="status"
        label="Status"
        value={status}
        onChange={(value) => onStatus(value as 'all' | TankStatus)}
        options={[
          { value: 'all', label: 'All Status' },
          { value: 'Critical', label: 'Critical' },
          { value: 'Low', label: 'Low' },
          { value: 'Normal', label: 'Normal' },
          { value: 'High', label: 'High' },
        ]}
      />
      <button
        type="button"
        disabled={refreshing}
        onClick={onRefresh}
        className="rounded border border-slate-300 bg-white px-3 py-2"
      >
        {refreshing ? 'Refreshing...' : '↻ Refresh'}
      </button>
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={autoRefresh}
          onChange={(e) => onAutoRefresh(e.target.checked)}
        />
        Auto 60s
      </label>
    </section>
  );
}
