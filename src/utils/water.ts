import type { TankStatus } from '../types/tank';

export function calculateAvailableWater(
  capacity: number,
  percentage: number,
): number {
  return capacity * (percentage / 100);
}

export function tankStatus(percentage: number | null): TankStatus {
  if (percentage === null || Number.isNaN(percentage)) {
    return 'Unknown';
  }
  if (percentage <= 20) return 'Critical';
  if (percentage <= 40) return 'Low';
  if (percentage <= 80) return 'Normal';
  return 'High';
}

export function formatKl(value: number | null): string {
  if (value === null || Number.isNaN(value)) return '—';
  return `${value.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} KL`;
}

export function formatPercent(value: number | null): string {
  if (value === null || Number.isNaN(value)) return '—';
  return `${value.toLocaleString(undefined, { maximumFractionDigits: 1 })}%`;
}

export function formatCaptureDate(value: string | null): string {
  if (!value) return '—';
  const iso = new Date(value);
  if (!Number.isNaN(iso.getTime())) {
    return formatDate(iso);
  }

  const match = value.match(
    /^(\d{1,2})\/(\d{1,2})\/(\d{4})\s+(\d{1,2}):(\d{2}):(\d{2})\s*(AM|PM)?/i,
  );
  if (!match) return value;
  const [, day, month, year, hourRaw, minute, second, ampm] = match;
  let hour = Number(hourRaw);
  if (ampm) {
    const upper = ampm.toUpperCase();
    if (upper === 'PM' && hour < 12) hour += 12;
    if (upper === 'AM' && hour === 12) hour = 0;
  }
  const parsed = new Date(
    Number(year),
    Number(month) - 1,
    Number(day),
    hour,
    Number(minute),
    Number(second),
  );
  if (Number.isNaN(parsed.getTime())) return value;
  return formatDate(parsed);
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat(undefined, {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).format(date);
}
