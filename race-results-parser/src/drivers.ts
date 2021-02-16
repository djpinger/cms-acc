import { loadCarsConfig, loadSeasonConfig } from './fileSystem';
import { Car, CarClass, Drivers } from './modelsOutput';
import { LeaderBoardLine, RawRaceOrQualifyResult } from './modelsRaw';
import { getSplitNumber, isRaceResult } from './utilities';
import _ from 'lodash';

const carConfig = loadCarsConfig();

function getCarClass(carModelId: number): CarClass {
  const availableCarClasses: CarClass[] = ['GT3', 'GT4'];

  return availableCarClasses.find(function(carClass){
    return carConfig[carClass].includes(carModelId);
  }) as CarClass;
}

function createCar(leaderBoardLine: LeaderBoardLine, trackName: string): Car {
  return {
    number: leaderBoardLine.car.raceNumber,
    modelId: leaderBoardLine.car.carModel,
    name: carConfig.cars[leaderBoardLine.car.carModel] as string,
    class: getCarClass(leaderBoardLine.car.carModel),
    teamName: leaderBoardLine.car.teamName,
    nationality: leaderBoardLine.car.nationality,
    carGuid: leaderBoardLine.car.carGuid,
    teamGuid: leaderBoardLine.car.teamGuid,
    raceIdFirstUsed: trackName,
  }
}

export function compileDrivers(seasonResults: RawRaceOrQualifyResult[]): Drivers {
  const seasonConfig = loadSeasonConfig();
  const drivers: Drivers = {};
  seasonResults.forEach(function(result){
    if(!isRaceResult(result) || !seasonConfig.races.find(r => r.trackName === result.trackName)){
      return;
    }
    
    result.sessionResult.leaderBoardLines.forEach(function(leaderBoardLine){
      // only add the car if it has run race laps
      if(!result.laps.some(lap => lap.carId === leaderBoardLine.car.carId)){
        return;
      }

      const splitNumber = getSplitNumber(result.serverName);

      // add driver if not in list
      let currentDriver = drivers[leaderBoardLine.currentDriver.playerId];
      if( !currentDriver ){
        const car: Car = createCar(leaderBoardLine, result.trackName);
        drivers[leaderBoardLine.currentDriver.playerId] = {
          firstName: leaderBoardLine.currentDriver.firstName,
          lastName: leaderBoardLine.currentDriver.lastName,
          shortName: leaderBoardLine.currentDriver.shortName,
          driverId: leaderBoardLine.currentDriver.playerId,
          cars: [car],
          currentCar: car,
          splits: [splitNumber]
        };
        currentDriver = drivers[leaderBoardLine.currentDriver.playerId];
      }

      // current car doesn't match the latest car
      if( currentDriver.currentCar.modelId !== leaderBoardLine.car.carModel ) {
        const car: Car = createCar(leaderBoardLine, result.trackName);
        // only add the car if it isn't in the cars list
        if(!currentDriver.cars.some(_car => _car.modelId === car.modelId)){
          currentDriver.cars.push(car);  
        }
        currentDriver.currentCar = car;
      }

      // only add the split number if not already included
      if( !currentDriver.splits.includes(splitNumber) ) {
        currentDriver.splits.push(splitNumber);
      }
    });
  });

  // set the driver's currentCar based the order of the seasonConfig
  Object.values(drivers).forEach(function(driver){
    // car didn't change during the season
    if(driver.cars.length === 1){
      return;
    }
    const currentCar = driver.cars.reduce(function(memo, car){
      const currentCarRaceIndex = _.findIndex(seasonConfig.races, function(race){
        return race.trackName === memo.raceIdFirstUsed;
      });
      const carRaceIndex = _.findIndex(seasonConfig.races, function(race){
        return race.trackName === car.raceIdFirstUsed;
      });
      if(carRaceIndex > currentCarRaceIndex){
        memo = car;
      }
      return memo;
    }, _.cloneDeep(driver.currentCar));

    driver.currentCar = currentCar;
  })

  return drivers;
}