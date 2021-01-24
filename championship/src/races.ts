import { loadSeasonConfig } from "./fileSystem";
import { RaceFormat } from "./modelsConfig";
import { Driver as SeasonDriver, FinishingOrderClass, QualifyingOrderClass, Split, Race as SplitRace, Car } from "./modelsInput";
import { Driver, Race } from "./modelsOutput";
import _ from "lodash";

type seasonRace = {
  name: string;
  trackName: string;
  format: RaceFormat;
  raceNumber: number;
}

const seasonConfig = loadSeasonConfig();
const seasonRaces = seasonConfig.races.reduce(function(memo, race) {
  Array.from(Array(race.numberOfRaces)).forEach(function(_, index){
    memo.push({
      name: race.name,
      trackName: race.trackName,
      format: race.format,
      raceNumber: index + 1,
    });
  });
  return memo;
}, [] as seasonRace[])

const DID_NOT_PARTICIPATE_POSITION = 99;

export function compileSplit(split: Split, seasonDrivers: SeasonDriver[]): {GT3: Driver[], GT4: Driver[]} {
  const drivers: Driver[] = seasonDrivers.map(function(driver) {
    return {
      id: driver.driverId,
      firstName: driver.firstName,
      lastName: driver.lastName,
      car: {
        modelId: driver.currentCar.modelId,
        number: driver.currentCar.number,
        name: driver.currentCar.name,
        class: driver.currentCar.class,
        teamName: driver.currentCar.teamName,
        nationality: driver.currentCar.nationality,
      },
      wins: 0,
      podiums: 0,
      bestFinish: 0,
      averageFinish: 0,
      polePositions: 0,
      totalPoints: 0,
      races: seasonRaces.reduce<(Race | null)[]>(function(memo, seasonRace) {
        return mapDriverRaces(split.races, seasonRace, memo, driver);
      }, [])
    }
  });

  drivers.forEach(function(driver){
    const positions = driver.races.reduce<number[]>(function(memo, race){
      if(race){
        memo.push(race.finish);
      }
      return memo;
    }, []);
    driver.wins = positions.filter(pos => pos === 1).length;
    driver.podiums = positions.filter(pos => pos <= 3).length;
    driver.bestFinish = _.min(positions) as number;
    driver.averageFinish = _.sum(positions) / positions.length;
    driver.polePositions = driver.races.filter(race => race?.grid === 1).length;
    driver.totalPoints = _.sumBy(driver.races.filter(race => race !== null) as Race[], 'points');
  });

  return {
    GT3: _.sortBy(drivers.filter(driver => driver.car.class === 'GT3'), ['totalPoints', 'lastName', 'firstName']).reverse(),
    GT4: _.sortBy(drivers.filter(driver => driver.car.class === 'GT4'), ['totalPoints', 'lastName', 'firstName']).reverse(),
  }
}

function mapDriverRaces(races: SplitRace[], seasonRace: seasonRace, memo: (Race | null)[], driver: SeasonDriver){
  const race = races.find(function(race){
    return race.id === seasonRace.trackName && race.raceNumber === seasonRace.raceNumber;
  });

  if(!race){
    memo.push(null);
    return memo;
  }
  const driverCar = driversCarForRace(race, driver);
  // driver found in race
  if(!driverCar){
    memo.push(null);
    return memo;
  }

  const qualifyingOrder = race.qualifyingOrder[driverCar.class].find(function(qualifyingOrder){
    return qualifyingOrder.driverId === driver.driverId;
  });

  const finish = race.finishingOrder[driverCar.class].find(function(finishingOrder){
    return finishingOrder.driverId === driver.driverId;
  }) as FinishingOrderClass;

  const fastestLap = race.fastestLap[driverCar.class].driverId === driver.driverId;

  // not sure why, but the results have a driver that finished a race, but 
  // isn't listed in the qualifing
  const grid = qualifyingOrder?.position || null;
  memo.push({
    grid,
    finish: finish.position,
    points: compilePoints({seasonRace, finish, driver, fastestLap, grid}),
    fastestLap,
  });

  return memo;
}

type CompilePointsParams = {
  seasonRace: seasonRace;
  finish: FinishingOrderClass;
  driver: SeasonDriver;
  grid: number | null;
  fastestLap: boolean;
}

function compilePoints({seasonRace, finish, driver, fastestLap, grid}: CompilePointsParams): number {
  // different car so don't add points since we only
  // account for last car used
  if(driver.currentCar.modelId !== finish.carModelId){
    return 0;
  }

  let racePoints = seasonConfig.points[seasonRace.format].race[finish.position - 1];
  if(!racePoints){
    racePoints = seasonConfig.points[seasonRace.format].pointsAfterLast;
  }

  const qualifingPoints = grid === 1 ? seasonConfig.points[seasonRace.format].pole : 0;
  const fastestLapPoints = fastestLap ? seasonConfig.points[seasonRace.format].fastestLap : 0;

  return racePoints + qualifingPoints + fastestLapPoints;
}

function driversCarForRace(race: SplitRace, driver: SeasonDriver) {
  return driver.cars.find(function(car){
    return race.finishingOrder[car.class].find(function(finishingOrder){
      return finishingOrder.driverId === driver.driverId;
    });
  });
}
