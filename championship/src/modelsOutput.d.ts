export type CarClass = 'GT3' | 'GT4';

export type Driver = {
  id: string;
  firstName: string;
  lastName: string;
  car: Car;
  wins: number;
  podiums: number;
  bestFinish: number;
  averageFinish: number;
  polePositions: number;
  totalPoints: number;
  races: (Race | null)[];
}

export type Car = {
  number: number;
  modelId: number;
  name: string;
  class: CarClass;
  teamName: string;
  nationality: number;
}

export type Race = {
  grid: number | null;
  finish: number;
  points: number;
  fastestLap: boolean;
}