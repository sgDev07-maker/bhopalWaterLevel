import type { TankView } from '../types/tank';
import { formatCaptureDate, formatKl, formatPercent } from '../utils/water';
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
    <article className="rounded-2xl border border-slate-200 bg-white p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-xs font-medium tracking-wide text-sky-800 uppercase">
            Zone {tank.zone}
          </div>
          <h3 className="text-lg leading-snug font-semibold">{tank.name}</h3>
          <div className="text-sm text-slate-500">Tag ID {tank.tagId}</div>
        </div>
        <TankStatusBadge status={tank.status} />
      </div>

      {loading && tank.percentage === null ? (
        <p className="mt-4">
          <LoadingSkeleton />
        </p>
      ) : tank.unavailable ? (
        <div className="mt-4 flex items-center justify-between gap-3">
          <span className="text-sm text-slate-600">Data unavailable</span>
          <button
            type="button"
            className="h-11 rounded-xl border border-slate-300 px-4 text-sm font-medium"
            onClick={() => onRetry(tank.tagId)}
          >
            Retry
          </button>
        </div>
      ) : (
        <div className="mt-4">
          <div className="mb-1 flex items-end justify-between">
            <span className="text-sm text-slate-600">Current level</span>
            <strong className="text-2xl tabular-nums">{formatPercent(tank.percentage)}</strong>
          </div>
          <WaterLevelBar value={tank.percentage} label={`${tank.name} level`} />
        </div>
      )}

      <dl className="mt-4 grid grid-cols-2 gap-x-3 gap-y-2 text-sm">
        <div>
          <dt className="text-slate-500">Available</dt>
          <dd className="font-medium">
            {loading && tank.availableWater === null ? (
              <LoadingSkeleton />
            ) : (
              formatKl(tank.availableWater)
            )}
          </dd>
        </div>
        <div>
          <dt className="text-slate-500">Capacity</dt>
          <dd className="font-medium">{formatKl(tank.capacity)}</dd>
        </div>
        <div>
          <dt className="text-slate-500">Height</dt>
          <dd className="font-medium">{tank.height === null ? '—' : `${tank.height} m`}</dd>
        </div>
        <div>
          <dt className="text-slate-500">Updated</dt>
          <dd className="font-medium">{formatCaptureDate(tank.captureDateTime)}</dd>
        </div>
      </dl>
    </article>
  );
}
