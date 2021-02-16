import { loadPenalties, loadSeasonConfig } from "./fileSystem";
import { RaceFormat } from "./modelsConfig";
import { Driver as SeasonDriver, FinishingOrderClass, Split, Race as SplitRace } from "./modelsInput";
import { Car, Driver, Race } from "./modelsOutput";
import _ from "lodash";

type seasonRace = {
  name: string;
  trackName: string;
  format: RaceFormat;
  raceNumber: number;
}

const seasonConfig = loadSeasonConfig();
const penalties = loadPenalties();

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
  let drivers: Driver[] = seasonDrivers.map(function(driver) {
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
      previousCars: driver.cars.reduce(function(memo, car){
        if(car.modelId !== driver.currentCar.modelId){
          memo.push({
            modelId: car.modelId,
            number: car.number,
            name: car.name,
            class: car.class,
            teamName: car.teamName,
            nationality: car.nationality,
          });
        }
        return memo;
      }, [] as Car[]),
      wins: 0,
      podiums: 0,
      bestFinish: 0,
      averageFinish: 0,
      polePositions: 0,
      totalPoints: 0,
      penaltyRounds: [],
      dropRounds: [],
      races: seasonRaces.reduce<(Race | null)[]>(function(memo, seasonRace) {
        return mapDriverRaces(split.races, seasonRace, memo, driver);
      }, []),
    }
  });

  drivers = drivers.filter(driver => _.compact(driver.races).length);

  drivers.forEach(function(driver){
    const positions = driver.races.reduce<number[]>(function(memo, race){
      if(race){
        memo.push(race.finish);
      }
      return memo;
    }, []);
    const {
      dropRounds,
      penaltyRounds,
    } = dropRoundsAndPenaltyServed(driver);

    driver.races.forEach(function(race){
      if(race){
        race.dropRound = dropRounds.includes(race.id);
      }
    });

    driver.wins = positions.filter(pos => pos === 1).length;
    driver.podiums = positions.filter(pos => pos <= 3).length;
    driver.bestFinish = _.min(positions) as number;
    driver.averageFinish = _.sum(positions) / positions.length;
    driver.polePositions = driver.races.filter(race => race?.grid === 1).length;
    driver.dropRounds = dropRounds;
    driver.totalPoints = totalPoints(driver, dropRounds);
    driver.penaltyRounds = penaltyRounds;
  });

  return {
    GT3: _.sortBy(drivers.filter(driver => [..._.map(driver.previousCars, 'class'), driver.car.class].some(k => k === 'GT3')), ['totalPoints', 'lastName', 'firstName']).reverse(),
    GT4: _.sortBy(drivers.filter(driver => [..._.map(driver.previousCars, 'class'), driver.car.class].some(k => k === 'GT4')), ['totalPoints', 'lastName', 'firstName']).reverse(),
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
  // const {racePoints, } = ;
  memo.push({
    id: race.id,
    raceNumber: race.raceNumber,
    grid,
    finish: finish.position,
    fastestLap,
    ...compilePoints({seasonRace, finish, driver, fastestLap, grid}),
    dropRound: false,
    carClass: driverCar.class,
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

function compilePoints({seasonRace, finish, driver, fastestLap, grid}: CompilePointsParams): {racePoints: number, qualifingPoints: number, fastestLapPoints: number, totalPoints: number} {
  // different car so don't add points since we only
  // account for last car used
  if(driver.currentCar.modelId !== finish.carModelId){
    return {racePoints: 0, qualifingPoints: 0, fastestLapPoints: 0, totalPoints: 0};
  }

  let racePoints = seasonConfig.points[seasonRace.format].race[finish.position - 1];
  if(!racePoints){
    racePoints = seasonConfig.points[seasonRace.format].pointsAfterLast;
  }

  const qualifingPoints = grid === 1 ? seasonConfig.points[seasonRace.format].pole : 0;
  const fastestLapPoints = fastestLap ? seasonConfig.points[seasonRace.format].fastestLap : 0;
  const totalPoints = racePoints + qualifingPoints +  fastestLapPoints;

  return {racePoints, qualifingPoints, fastestLapPoints, totalPoints};
}

function driversCarForRace(race: SplitRace, driver: SeasonDriver) {
  return driver.cars.find(function(car){
    return race.finishingOrder[car.class].find(function(finishingOrder){
      return finishingOrder.driverId === driver.driverId;
    });
  });
}

function dropRoundsAndPenaltyServed(driver: Driver): {dropRounds: string[], penaltyRounds: string[]} {
  // filter to only races that have finishes
  // const races = _.compact(driver.races);

  // Get race ids for each round where penalty was served
  const driverPenaltyServedRaceIds = penalties.filter(p => `S${p.SID}` === driver.id).map(function(penalty){
    const index = parsePenaltyRound(penalty["Round ID"]) - 1;
    const race = seasonConfig.races[index];
    return race.trackName;
  });

  // combine race points for rounds that have more than 1 race
  const combinedRoundRacePoints = seasonConfig.races.reduce(function(memo, seasonRace){
    Array.from(new Array(seasonRace.numberOfRaces)).forEach(function(_, index){
      const race = driver.races.find(r => r?.id === seasonRace.trackName && r.raceNumber === index + 1);

      if(!race){
        const previousRace = memo.find(pRace => pRace.id === seasonRace.trackName);
        if(!previousRace){
          memo.push({id: seasonRace.trackName, racePoints: 0});
        }
        return memo;
      }
      
      const previousRace = memo.find(pRace => pRace.id === race.id);

      if(previousRace){
        previousRace.racePoints = previousRace.racePoints + race.racePoints;
      }
      else {
        memo.push({id: race.id, racePoints: race.racePoints});
      }
    });

    return memo;
  }, [] as {id: string; racePoints: number}[]);

  // get the 2 minimum scoring rounds, minus those which a penalty was served
  const racesWithNegatedRacePoints = combinedRoundRacePoints.reduce(function(memo, race){
    const penaltyWasServedRound = driverPenaltyServedRaceIds.find(id => id === race.id);

    // 2 min rounds can't include round where penalty was served
    if(!penaltyWasServedRound){
      if(memo[0].racePoints > race.racePoints) {
        memo[0] = {id: race.id, racePoints: race.racePoints};
      }
      else if(memo[1].racePoints > race.racePoints) {
        memo[1] = {id: race.id, racePoints: race.racePoints};
      }
    }
    return memo;
  }, [{id: "", racePoints: 10000}, {id: "", racePoints: 10000}] as [{id: string; racePoints: number}, {id: string; racePoints: number}]);

  return {
    dropRounds: racesWithNegatedRacePoints.map(race => race.id),
    penaltyRounds: driverPenaltyServedRaceIds,
  }
}

// parses round from format "5GT3R2S1"
// this returns "2" from the string above
function parsePenaltyRound(penaltyRoundId: string): number {
  const matches = (penaltyRoundId.match(/^\dGT\dR(\d)/) as RegExpMatchArray);
  return parseInt(matches[1], 10);
}

function totalPoints(driver: Driver, dropRoundsRaceIds: string[]): number {
  const races = _.compact(driver.races);
  
  return races.reduce(function(memo, race) {
    if(dropRoundsRaceIds.includes(race.id)){
      // omit race points because penalty was served during race
      return memo + race.fastestLapPoints + race.qualifingPoints;
    }
    return memo + race.racePoints + race.fastestLapPoints + race.qualifingPoints;
  }, 0);
}