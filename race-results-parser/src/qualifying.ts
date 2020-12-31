import { loadCarsConfig } from "./fileSystem";
import { QualifyingOrder, QualifyingOrderBestLap } from "./modelsOutput";
import { Lap, LeaderBoardLine, RawQualyResult } from "./modelsRaw";
import { maxLapTime } from "./utilities";

const carConfig = loadCarsConfig();

function bestLap(leaderBoardLine: LeaderBoardLine, laps: Lap[]): QualifyingOrderBestLap {
  const carId = leaderBoardLine.car.carId;
  return laps.reduce(function(memo, lap){
    if(lap.carId !== carId){
      return memo;
    }
    if(lap.laptime < memo.lapTime){
      memo.lapTime = lap.laptime;
      memo.splits = lap.splits;
    }
    return memo;
  }, {
    lapTime: maxLapTime,
    splits: []
  } as QualifyingOrderBestLap)
}

function mapLeaderboardLineToBestLap(leaderBoardLine: LeaderBoardLine, index: number, quallyResult: RawQualyResult){
  return {
    position: index + 1,
    driverId: leaderBoardLine.currentDriver.playerId,
    bestLap: bestLap(leaderBoardLine, quallyResult.laps),
  }
}

export function qualifyingOrder(quallyResult: RawQualyResult): QualifyingOrder {
  const gt3Cars: LeaderBoardLine[] = [];
  const gt4Cars: LeaderBoardLine[] = [];
  quallyResult.sessionResult.leaderBoardLines.forEach(function(line){
    if(carConfig.GT3.includes(line.car.carModel)){
      return gt3Cars.push(line);
    }
    if(carConfig.GT4.includes(line.car.carModel)){
      return gt4Cars.push(line);
    }
    console.error(`Car class for model ${line.car.carModel} not found`)
  });

  return {
    GT3: gt3Cars.map((leaderBoardLine, index) => mapLeaderboardLineToBestLap(leaderBoardLine, index, quallyResult)),
    GT4: gt4Cars.map((leaderBoardLine, index) => mapLeaderboardLineToBestLap(leaderBoardLine, index, quallyResult)),
  }
}