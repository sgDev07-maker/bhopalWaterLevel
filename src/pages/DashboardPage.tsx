import { ErrorMessage } from '../components/ErrorMessage';
import { SummaryCard } from '../components/SummaryCard';
import { TankFilters } from '../components/TankFilters';
import { TankTable } from '../components/TankTable';
import { useTankReadings } from '../hooks/useTankReadings';
import { formatKl, formatPercent } from '../utils/water';

export function DashboardPage() {
  const tanks = useTankReadings();

  return (
    <div>
      <h1 className="mb-4 text-2xl font-semibold">Dashboard</h1>
      <section className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-4">
        <SummaryCard label="Total Tanks" value={String(tanks.summary.tanks)} />
        <SummaryCard
          label="Average Level"
          value={formatPercent(tanks.summary.avg)}
        />
        <SummaryCard
          label="Total Capacity"
          value={formatKl(tanks.summary.totalCapacity)}
        />
        <SummaryCard
          label="Available Water"
          value={formatKl(tanks.summary.totalAvailable)}
        />
      </section>
      <h2 className="mb-3 text-xl font-semibold">Water Tanks</h2>
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
      <ErrorMessage message={tanks.notice} />
      <TankTable
        tanks={tanks.filtered}
        loading={tanks.loading}
        onRetry={(tagId) => void tanks.retryOne(tagId)}
      />
    </div>
  );
}
