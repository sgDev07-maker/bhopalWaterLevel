import type { TankReading } from '../types/tank';
import { requestJson } from './http';

interface UpstreamTag {
  tagID?: number | string;
  tagId?: number | string;
  value?: number | string | null;
  captureDateTime?: string | null;
}

function toNumber(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string' && value.trim() !== '') {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

function normalize(item: UpstreamTag): TankReading {
  return {
    tagID: toNumber(item.tagID ?? item.tagId) ?? 0,
    value: toNumber(item.value),
    captureDateTime: item.captureDateTime ?? null,
  };
}

async function fetchByTagIds(tagIds: number[]): Promise<TankReading[]> {
  const unique = [...new Set(tagIds)];
  const tagids = unique.join('-');
  const data = await requestJson<unknown>(
    `/api/analog/tagapi/gettagsbyid/?tagids=${encodeURIComponent(tagids)}`,
  );
  if (!Array.isArray(data)) {
    return unique.map((tagID) => ({
      tagID,
      value: null,
      captureDateTime: null,
    }));
  }
  const byId = new Map(
    data.map((item) => {
      const reading = normalize(item as UpstreamTag);
      return [reading.tagID, reading] as const;
    }),
  );
  return unique.map(
    (tagID) =>
      byId.get(tagID) ?? {
        tagID,
        value: null,
        captureDateTime: null,
      },
  );
}

export async function getTankReading(tagId: number): Promise<TankReading> {
  const [reading] = await fetchByTagIds([tagId]);
  return reading ?? { tagID: tagId, value: null, captureDateTime: null };
}

export async function getTankReadings(
  tagIds: number[],
): Promise<TankReading[]> {
  if (tagIds.length === 0) return [];
  try {
    const batch = await fetchByTagIds(tagIds);
    const found = batch.filter((item) => item.value !== null).length;
    if (found > 0 || tagIds.length <= 20) {
      return batch;
    }
  } catch {
    // Fall through to smaller chunks.
  }

  const chunkSize = 20;
  const results: TankReading[] = [];
  for (let i = 0; i < tagIds.length; i += chunkSize) {
    const chunk = tagIds.slice(i, i + chunkSize);
    try {
      results.push(...(await fetchByTagIds(chunk)));
    } catch {
      results.push(
        ...chunk.map((tagID) => ({
          tagID,
          value: null,
          captureDateTime: null,
        })),
      );
    }
  }
  return results;
}

export function getTankHistory(
  tagId: number,
  fromDate: string,
  toDate: string,
): Promise<unknown> {
  const params = new URLSearchParams({
    tagid: String(tagId),
    fromdate: fromDate,
    todate: toDate,
  });
  return requestJson(
    `/api/analog/tagapi/gettagdatabydate/?${params.toString()}`,
  );
}
