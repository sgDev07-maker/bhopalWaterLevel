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
    return (
      <p className="rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-center text-slate-500">
        No tanks match the current filters.
      </p>
    );
  }

  return (
    <div className="space-y-6">
      {zones.map(([zoneNumber, zoneTanks]) => (
        <section key={zoneNumber}>
          <h2 className="mb-3 text-lg font-semibold text-sky-900">Zone {zoneNumber}</h2>
          <div className="hidden overflow-x-auto rounded-2xl border border-slate-200 lg:block">
            <table className="w-full min-w-[720px] border-collapse bg-white text-sm">
              <thead>
                <tr className="bg-slate-50 text-left">
                  <th className="p-3">Tank</th>
                  <th className="p-3">Tag ID</th>
                  <th className="p-3">Level</th>
                  <th className="p-3">Available</th>
                  <th className="p-3">Capacity</th>
                  <th className="p-3">Height</th>
                  <th className="p-3">Last Updated</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {zoneTanks.map((tank) => (
                  <tr
                    key={`${tank.zone}-${tank.tagId}-${tank.name}`}
                    className="border-t border-slate-200"
                  >
                    <td className="p-3 font-medium">{tank.name}</td>
                    <td className="p-3 tabular-nums">{tank.tagId}</td>
                    <td className="p-3">
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
                          <div className="tabular-nums">{formatPercent(tank.percentage)}</div>
                          <WaterLevelBar
                            value={tank.percentage}
                            label={`${tank.name} level`}
                          />
                        </>
                      )}
                    </td>
                    <td className="p-3">
                      {loading && tank.availableWater === null ? (
                        <LoadingSkeleton />
                      ) : (
                        formatKl(tank.availableWater)
                      )}
                    </td>
                    <td className="p-3">{formatKl(tank.capacity)}</td>
                    <td className="p-3">{tank.height === null ? '—' : `${tank.height} m`}</td>
                    <td className="p-3">{formatCaptureDate(tank.captureDateTime)}</td>
                    <td className="p-3">
                      <TankStatusBadge status={tank.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="grid gap-3 lg:hidden">
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
