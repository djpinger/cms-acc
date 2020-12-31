import { loadCarsConfig } from "./fileSystem";
import { FinishingOrder, FinishingOrderClass, Lap as LapOutput } from "./modelsOutput";
import { Lap, LeaderBoardLine, RawRaceOrQualifyResult } from "./modelsRaw";

const carConfig = loadCarsConfig();

function mapCar(car: LeaderBoardLine, index: number, laps: Lap[]): FinishingOrderClass {
  return {
    position: index + 1,
    driverId: car.currentDriver.playerId,
    carModelId: car.car.carModel,
    laps: filterAndMapLaps(laps, car.car.carId)
  }
}

function filterAndMapLaps(laps: Lap[], carId: number): LapOutput[] {
  const carLaps = laps.filter(lap => lap.carId === carId);
  return carLaps.map((lap, index) => ({
    lapNumber: index + 1,
    lapTime: lap.laptime,
    splits: lap.splits
  }));
}

export function finishingOrder(raceResult: RawRaceOrQualifyResult): FinishingOrder {
  const gt3Cars = raceResult.sessionResult.leaderBoardLines.filter(line => carConfig.GT3.includes(line.car.carModel));
  const gt4Cars = raceResult.sessionResult.leaderBoardLines.filter(line => carConfig.GT4.includes(line.car.carModel));

  return {
    GT3: gt3Cars.map((car, index) => mapCar(car, index, raceResult.laps)),
    GT4: gt4Cars.map((car, index) => mapCar(car, index, raceResult.laps)),
  }
}