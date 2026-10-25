import { ErrorMessage } from '../components/ErrorMessage';
import { TankFilters } from '../components/TankFilters';
import { TankTable } from '../components/TankTable';
import { ZoneSelector } from '../components/ZoneSelector';
import { useTankReadings } from '../hooks/useTankReadings';

export function ZonesPage() {
  const tanks = useTankReadings();

  return (
    <div>
      <h1 className="mb-2 text-2xl font-semibold">Zones</h1>
      <p className="mb-3 text-sm text-slate-600">
        Swipe the zone chips, then read live levels in the list. Zone 18 is not in the source app.
      </p>
      <div className="mb-4">
        <ZoneSelector value={tanks.zone} onChange={tanks.setZone} />
      </div>
      <TankFilters
        search={tanks.search}
        onSearch={tanks.setSearch}
        zone={tanks.zone}
        onZone={tanks.setZone}
        status={tanks.statusFilter}
        onStatus={tanks.setStatusFilter}
        refreshing={tanks.refreshing}
        autoRefresh={tanks.autoRefresh}
        onAutoRefresh={tanks.setAutoRefresh}
        onRefresh={() => void tanks.loadReadings(true)}
      />
      <div className="mb-3">
        <ErrorMessage message={tanks.notice} />
      </div>
      <TankTable
        tanks={tanks.filtered}
        loading={tanks.loading}
        onRetry={(tagId) => void tanks.retryOne(tagId)}
      />
    </div>
  );
}
