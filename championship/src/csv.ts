import { CarClass, Driver } from "./modelsOutput";
import stringify from 'csv-stringify/lib/sync';
import { loadSeasonConfig } from "./fileSystem";
import _ from  'lodash';

const seasonConfig = loadSeasonConfig();
const columns = ['#', 'Driver', 'Points', 'Diff', ...raceNames(), 'Wins', 'Poles', 'Podiums', 'Best Finish', 'Average Finish', 'Fastest Lap', 'Drop Rounds', 'Penalty Rounds'];

export function compileCSVForCarClass(drivers: Driver[], carClass: CarClass){
  console.log(carClass, drivers[0]);
  const topPoints = drivers[0].totalPoints;
  const driversToAppend: Driver[] = [];
  const data = drivers.reduce(function(memo, driver, idx){
    if(driverNoLongerInClass(driver, carClass)){
      driversToAppend.push(driver);
      return memo;
    }
    memo.push(mapDriverRow(driver, idx + 1,  topPoints, carClass));
    return memo;
  }, [] as (string|number)[][]);

  data.push(columns.map(c => '-'));

  driversToAppend.forEach(function(driver){
    data.push([
      '',
      `${driver.firstName} ${driver.lastName}`,
      '0',
      '',
      ...driverRaces(driver, carClass),
      wins(driver),
      poles(driver),
      podium(driver),
      bestFinish(driver),
      averageFinish(driver),
      fastestLap(driver),
      '',
      penaltyServed(driver).join(', '),

    ]);
  });

  return stringify(
    data, 
    {
      columns,
      header: true,
    }
  );
}

function mapDriverRow(driver: Driver, position: number|string, topPoints: number, carClass: CarClass) {
  return [
    position,
    `${driver.firstName} ${driver.lastName}`,
    driver.totalPoints,
    driver.totalPoints -  topPoints,
    ...driverRaces(driver, carClass),
    wins(driver),
    poles(driver),
    podium(driver),
    bestFinish(driver),
    averageFinish(driver),
    fastestLap(driver),
    dropRounds(driver).join(', '),
    penaltyServed(driver).join(', '),
  ];
}

function raceNames(): string[] {
  return seasonConfig.races.reduce(function(memo, race){
    const counter = Array.from(new Array(race.numberOfRaces));
    counter.forEach(function(_,index){
      if(race.numberOfRaces > 1){
        memo.push(`${race.name} ${index + 1}`)
      }
      else {
        memo.push(race.name);
      }
    })


    return memo;
  }, [] as string[])
}

function driverRaces(driver: Driver, carClass: CarClass){
  return seasonConfig.races.reduce(function(memo, race){
    const counter = Array.from(new Array(race.numberOfRaces));
    counter.forEach(function(_,index){
      const record = driver.races.find(r => r  && r.id === race.trackName && index + 1 === r.raceNumber);
    
      // don't add finishing position if car class used for race doesn't
      // match the one being compiled. This happens when a driver changes
      // classes
      if(!record || record.carClass !== carClass){
        memo.push('');
      }
      else {
        memo.push(record.finish);
      }
    })


    return memo;
  }, [] as (string|number)[])
}

function wins(driver: Driver): number {
  return driver.races.reduce(function(memo, race){
    return race?.finish === 1 ? memo + 1 : memo;
  }, 0);
}

function podium(driver: Driver): number {
  return driver.races.reduce(function(memo, race){
    return race && race.finish <= 3 ? memo + 1 : memo;
  }, 0);
}

function poles(driver: Driver): number {
  return driver.races.reduce(function(memo, race){
    return race && race.grid === 1 ? memo + 1 : memo;
  }, 0);
}

function bestFinish(driver: Driver): number {
  const races = _.compact(driver.races);
  const finishes = races.map(r => r.finish);
  return Math.min(...finishes);
}

function averageFinish(driver: Driver): number {
  const races = _.compact(driver.races);
  return Math.round(_.sumBy(races, 'finish') / races.length);
}

function fastestLap(driver: Driver): number {
  return driver.races.reduce(function(memo, race){
    return race?.fastestLap ? memo + 1 : memo;
  }, 0);
}

function dropRounds(driver: Driver): string[] {
  return driver.dropRounds.map(dropRound =>  seasonConfig.races.find(race => race.trackName === dropRound)?.name as string);
}

function penaltyServed(driver: Driver): string[] {
  return driver.penaltyRounds.map(penaltyRound =>  seasonConfig.races.find(race => race.trackName === penaltyRound)?.name as string);
}

function driverNoLongerInClass(driver: Driver, carClass: CarClass): boolean {
  return driver.car.class !== carClass;
}