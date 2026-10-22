import type { TankView } from '../types/tank';
import { formatKl, formatPercent } from '../utils/water';
import { LoadingSkeleton } from './LoadingSkeleton';
import { TankStatusBadge } from './TankStatusBadge';
import { WaterLevelBar } from './WaterLevelBar';

export function TankCard({
  tank,
  loading,
  onRetry,
}: {
  tank: TankView;
  loading: boolean;
  onRetry: (tagId: number) => void;
}) {
  return (
    <article className="rounded-lg border border-slate-200 bg-white p-4">
      <div className="text-sm text-slate-500">Zone {tank.zone}</div>
      <h3 className="text-lg font-semibold">{tank.name}</h3>
      <div className="text-sm text-slate-500">Tag ID: {tank.tagId}</div>
      {loading && tank.percentage === null ? (
        <p className="mt-2">
          <LoadingSkeleton />
        </p>
      ) : tank.unavailable ? (
        <p className="mt-2">
          Data unavailable{' '}
          <button type="button" className="underline" onClick={() => onRetry(tank.tagId)}>
            Retry
          </button>
        </p>
      ) : (
        <>
          <div className="mt-3 flex justify-between">
            <span>Current Level</span>
            <strong>{formatPercent(tank.percentage)}</strong>
          </div>
          <WaterLevelBar value={tank.percentage} label={`${tank.name} level`} />
        </>
      )}
      <div className="mt-2 flex justify-between text-sm">
        <span>Available</span>
        <span>
          {loading && tank.availableWater === null ? (
            <LoadingSkeleton />
          ) : (
            formatKl(tank.availableWater)
          )}
        </span>
      </div>
      <div className="mt-1 flex justify-between text-sm">
        <span>Capacity</span>
        <span>{formatKl(tank.capacity)}</span>
      </div>
      <div className="mt-1 flex justify-between text-sm">
        <span>Height</span>
        <span>{tank.height === null ? '—' : `${tank.height} m`}</span>
      </div>
      <div className="mt-1 flex justify-between text-sm">
        <span>Status</span>
        <TankStatusBadge status={tank.status} />
      </div>
    </article>
  );
}
