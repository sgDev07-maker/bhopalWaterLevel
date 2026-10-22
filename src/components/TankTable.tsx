import type { TankView } from '../types/tank';
import { formatCaptureDate, formatKl, formatPercent } from '../utils/water';
import { LoadingSkeleton } from './LoadingSkeleton';
import { TankCard } from './TankCard';
import { TankStatusBadge } from './TankStatusBadge';
import { WaterLevelBar } from './WaterLevelBar';

export function TankTable({
  tanks,
  loading,
  onRetry,
}: {
  tanks: TankView[];
  loading: boolean;
  onRetry: (tagId: number) => void;
}) {
  const grouped = new Map<number, TankView[]>();
  for (const tank of tanks) {
    const list = grouped.get(tank.zone) ?? [];
    list.push(tank);
    grouped.set(tank.zone, list);
  }
  const zones = [...grouped.entries()].sort((a, b) => a[0] - b[0]);

  if (tanks.length === 0) {
    return <p className="text-slate-500">No tanks match the current filters.</p>;
  }

  return (
    <div className="space-y-8">
      {zones.map(([zoneNumber, zoneTanks]) => (
        <section key={zoneNumber}>
          <h2 className="mb-3 text-xl font-semibold text-sky-900">
            Zone {zoneNumber}
          </h2>
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full border-collapse bg-white text-sm">
              <thead>
                <tr className="bg-slate-50 text-left">
                  <th className="border border-slate-200 p-2">Tank</th>
                  <th className="border border-slate-200 p-2">Tag ID</th>
                  <th className="border border-slate-200 p-2">Level</th>
                  <th className="border border-slate-200 p-2">Available</th>
                  <th className="border border-slate-200 p-2">Capacity</th>
                  <th className="border border-slate-200 p-2">Height</th>
                  <th className="border border-slate-200 p-2">Last Updated</th>
                  <th className="border border-slate-200 p-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {zoneTanks.map((tank) => (
                  <tr key={`${tank.zone}-${tank.tagId}-${tank.name}`}>
                    <td className="border border-slate-200 p-2">{tank.name}</td>
                    <td className="border border-slate-200 p-2">{tank.tagId}</td>
                    <td className="border border-slate-200 p-2">
                      {loading && tank.percentage === null ? (
                        <LoadingSkeleton />
                      ) : tank.unavailable ? (
                        <span>
                          Data unavailable{' '}
                          <button
                            type="button"
                            className="underline"
                            onClick={() => onRetry(tank.tagId)}
                          >
                            Retry
                          </button>
                        </span>
                      ) : (
                        <>
                          <div>{formatPercent(tank.percentage)}</div>
                          <WaterLevelBar
                            value={tank.percentage}
                            label={`${tank.name} level`}
                          />
                        </>
                      )}
                    </td>
                    <td className="border border-slate-200 p-2">
                      {loading && tank.availableWater === null ? (
                        <LoadingSkeleton />
                      ) : (
                        formatKl(tank.availableWater)
                      )}
                    </td>
                    <td className="border border-slate-200 p-2">
                      {formatKl(tank.capacity)}
                    </td>
                    <td className="border border-slate-200 p-2">
                      {tank.height === null ? '—' : `${tank.height} m`}
                    </td>
                    <td className="border border-slate-200 p-2">
                      {formatCaptureDate(tank.captureDateTime)}
                    </td>
                    <td className="border border-slate-200 p-2">
                      <TankStatusBadge status={tank.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="grid gap-3 md:hidden">
            {zoneTanks.map((tank) => (
              <TankCard
                key={`m-${tank.zone}-${tank.tagId}-${tank.name}`}
                tank={tank}
                loading={loading}
                onRetry={onRetry}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
