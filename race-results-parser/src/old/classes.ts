import { Lap, LeaderBoardLine, RawRaceOrQualifyResult } from "./models";
import { loadCarsConfig } from './fileSystem';

type CarClassLaps = {
  GT3: Lap[];
  GT4: Lap[];
}

type CarClassLeaderboardLines = {
  GT3: LeaderBoardLine[];
  GT4: LeaderBoardLine[];
}

export type CarClassesByRace = {
  [trackName: string]: CarClasses;
}

export type CarClasses = {
  GT3: CarClassResults;
  GT4: CarClassResults;
}

export type CarClassResults = {
  finishingPositions: LeaderBoardLine[];
  laps: Lap[];
}

export type CarClass = 'GT3' | 'GT4' | 'PCC' | 'ST';

type CarModelIdClasses = {
  [carModelId: number]: CarClass;
}

const carModelIdToClass: CarModelIdClasses = {};

const carsConfig = loadCarsConfig();
// create an object of carModelIds keys and car class values
carsConfig.cars.forEach(function(car, index){
  if(carsConfig.GT3.indexOf(index) >= 0){
    return carModelIdToClass[index] = 'GT3';
  }
  if(carsConfig.GT4.indexOf(index) >= 0){
    return carModelIdToClass[index] = 'GT4';
  }
  if(carsConfig.PCC.indexOf(index) >= 0){
    return carModelIdToClass[index] = 'PCC';
  }
  if(carsConfig.ST.indexOf(index) >= 0){
    return carModelIdToClass[index] = 'ST';
  }
});

function splitRaceIntoClasses(memo: CarClassesByRace, raceData: RawRaceOrQualifyResult): CarClassesByRace {
  const carIds = {
    GT3: {} as {[carId: number]: boolean},
    GT4: {} as {[carId: number]: boolean}
  };

  const raceGroups = raceData.sessionResult.leaderBoardLines.reduce(function(memo, leaderboardLine){
    const carClass = carModelIdToClass[leaderboardLine.car.carModel];
    carIds[carClass][leaderboardLine.car.carId] = true;
    memo[carClass].push(leaderboardLine);
    return memo;
  }, {GT3: [], GT4: []} as CarClassLeaderboardLines);

  const lapGroups = raceData.laps.reduce(function(memo, lap){
    if(carIds.GT3[lap.carId]){
      memo.GT3.push(lap);
    }
    else {
      memo.GT4.push(lap);
    }
    return memo;
  }, {GT3: [], GT4: []} as CarClassLaps);

  memo[raceData.trackName] = {
    GT3: {
      finishingPositions: raceGroups.GT3,
      laps: lapGroups.GT3,
    },
    GT4: {
      finishingPositions: raceGroups.GT4,
      laps: lapGroups.GT4,
    }
  };

  return memo;
}

export function splitSeasonRacesIntoClasses(splitRaceData: RawRaceOrQualifyResult[]): CarClassesByRace {
  return splitRaceData.reduce(splitRaceIntoClasses, {});
}