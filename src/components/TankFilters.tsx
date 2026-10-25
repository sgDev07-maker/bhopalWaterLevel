import { RefreshCw } from 'lucide-react';
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
    <section className="mb-4 space-y-3 rounded-2xl border border-slate-200 bg-white p-3">
      <SearchInput value={search} onChange={onSearch} />
      <div className="grid grid-cols-2 gap-2">
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
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          disabled={refreshing}
          onClick={onRefresh}
          className="inline-flex h-12 min-w-0 flex-1 items-center justify-center gap-2 rounded-xl bg-sky-800 px-3 font-medium text-white disabled:opacity-60"
        >
          <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          {refreshing ? 'Refreshing...' : 'Refresh'}
        </button>
        <label className="flex h-12 items-center gap-2 rounded-xl border border-slate-300 px-3 text-sm">
          <input
            type="checkbox"
            className="h-5 w-5"
            checked={autoRefresh}
            onChange={(e) => onAutoRefresh(e.target.checked)}
          />
          Auto 60s
        </label>
      </div>
    </section>
  );
}
