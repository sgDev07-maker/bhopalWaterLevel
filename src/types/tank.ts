export interface WaterTank {
  zone: number;
  tagId: number;
  name: string;
  capacity: number;
  height: number | null;
}

export interface TankReading {
  tagID: number;
  value: number | null;
  captureDateTime: string | null;
}

export type TankStatus = 'Critical' | 'Low' | 'Normal' | 'High' | 'Unknown';

export interface TankView extends WaterTank {
  percentage: number | null;
  captureDateTime: string | null;
  availableWater: number | null;
  status: TankStatus;
  unavailable: boolean;
}
