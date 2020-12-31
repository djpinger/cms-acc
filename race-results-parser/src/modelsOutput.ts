export type CarClass = 'GT3' | 'GT4';

export enum CarClassEnum {
  GT3 = 'GT3',
  GT4 = 'GT4',
}

export type Car = {
  number: number;
  modelId: number;
  name: string;
  class: CarClass;
  teamName: string;
  nationality: number;
  carGuid: number;
  teamGuid: number;
  raceIdFirstUsed: string;
}

export type Driver = {
  firstName: string;
  lastName: string;
  shortName: string;
  driverId: string;
  cars: Car[];
  currentCar: Car;
  splits: number[];
}

export type Lap = {
  lapNumber: number;
  lapTime: number;
  splits: number[];
}

export type FinishingOrderClass = {
  position: number;
  driverId: string;
  carModelId: number;
  laps: Lap[];
}

export type FinishingOrder = {
  GT3: FinishingOrderClass[];
  GT4: FinishingOrderClass[];
}

export type FastestLapClass = {
  driverId: string;
  lapTime: number;
  splits: number[];
}

export type QualifyingOrderClass = {
  position: number;
  driverId: string;
  bestLap: QualifyingOrderBestLap;
}

export type QualifyingOrderBestLap = {
  lapTime: number;
  splits: number[];
}

export type QualifyingOrder = {
  GT3: QualifyingOrderClass[];
  GT4: QualifyingOrderClass[];
}

export type Race = {
  id: string;
  raceNumber: number;
  finishingOrder: FinishingOrder;
  fastestLap: {
    GT3: FastestLapClass;
    GT4: FastestLapClass;
  };
  qualifyingOrder: QualifyingOrder;
}

export type Drivers = {
  [driverId: string]: Driver;
}

export type Split = {
  split: number;
  races: Race[];
}

export type FinalResults = {
  drivers: Drivers;
  splits: Split[];
}