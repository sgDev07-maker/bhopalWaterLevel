import type { TankStatus } from '../types/tank';

const styles: Record<TankStatus, string> = {
  Critical: 'bg-red-100 text-red-800',
  Low: 'bg-amber-100 text-amber-800',
  Normal: 'bg-green-100 text-green-800',
  High: 'bg-sky-100 text-sky-800',
  Unknown: 'bg-slate-100 text-slate-700',
};

export function TankStatusBadge({ status }: { status: TankStatus }) {
  return (
    <span
      className={`inline-block rounded-full px-2 py-0.5 text-xs ${styles[status]}`}
    >
      {status}
    </span>
  );
}
