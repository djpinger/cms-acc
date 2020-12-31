export type CarClass = 'GT3' | 'GT4';

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

export type FastestLapClass = {
  driverId: string;
  lapNumber: number;
  lapTime: number;
  splits: number[];
}

export type QualifyingOrderClass = {
  position: number;
  driverId: string;
  bestLap: {
    lapNumber: number;
    lapTime: number;
    splits: number[];
  }
}

export type Race = {
  id: string;
  raceNumber: number;
  finishingOrder: {
    GT3: FinishingOrderClass[];
    GT4: FinishingOrderClass[];
  },
  fastestLap: {
    GT3: FastestLapClass;
    GT4: FastestLapClass;
  },
  qualifyingOrder: {
    GT3: QualifyingOrderClass[];
    GT4: QualifyingOrderClass[];
  }
}

export type FinalResults = {
  drivers: {
    [driverId: string]: Driver;
  };
  races: Race[];
}