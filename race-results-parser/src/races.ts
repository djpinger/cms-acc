import { loadCarsConfig } from "./fileSystem";
import { finishingOrder } from "./finishingOrder";
import { CarClassEnum, FastestLapClass, Race } from "./modelsOutput";
import { LeaderBoardLine, RawQualyResult, RawRaceOrQualifyResult, RawRaceResult } from "./modelsRaw";
import { qualifyingOrder } from "./qualifying";
import { isRaceResult, maxLapTime } from "./utilities";

const carConfig = loadCarsConfig();

function fastestLap(raceResult: RawRaceOrQualifyResult){
  const gt3Cars = raceResult.sessionResult.leaderBoardLines.filter(line => carConfig.GT3.includes(line.car.carModel));
  const gt3CarIds = gt3Cars.map(line => line.car.carId);

  return raceResult.laps.reduce(function(memo, lap){
    const carClass = gt3CarIds.includes(lap.carId) ? CarClassEnum.GT3 : CarClassEnum.GT4;
    if(memo[carClass].lapTime > lap.laptime){
      memo[carClass] = {
        driverId: (raceResult.sessionResult.leaderBoardLines.find(line => line.car.carId === lap.carId) as LeaderBoardLine).currentDriver.playerId,
        lapTime: lap.laptime,
        splits: lap.splits,
      }
    }

    return memo;
  },{
    GT3: {
      lapTime: maxLapTime
    } as FastestLapClass,
    GT4: {
      lapTime: maxLapTime
    } as FastestLapClass
  });
}

type RaceAndQually = {
  trackName: string;
  raceNumber: number;
  race?: RawRaceOrQualifyResult;
  qually?: RawRaceOrQualifyResult;
}

type RaceAndQuallyList = {
  [trackName: string]: RaceAndQually[];
}

function compileRaceAndQually(seasonResults: RawRaceOrQualifyResult[]): RaceAndQuallyList{
  return seasonResults.reduce(function(memo, result){
    const raceNumber = result.sessionType.charAt(1) === '' ? 1 : parseInt(result.sessionType.charAt(1));
    
    if(!memo[result.trackName]) {
      memo[result.trackName] = [{
        trackName: result.trackName,
        raceNumber
      }];
    }
    let raceAndQually = memo[result.trackName].find(resultSet => resultSet.raceNumber === raceNumber);
    if(!raceAndQually) {
      raceAndQually = {
        trackName: result.trackName,
        raceNumber
      };
      memo[result.trackName].push(raceAndQually);
    }

    const property = isRaceResult(result) ? 'race' : 'qually';
    raceAndQually[property] = result;

    return memo;
  }, {} as RaceAndQuallyList);
}

export function complileRaces(seasonResults: RawRaceOrQualifyResult[]): Race[] {
  const raceAndQually = compileRaceAndQually(seasonResults);
  return Object.entries(raceAndQually).reduce(function(memo, [trackName, raceAndQually]){
    raceAndQually.forEach(function(rq){
      // console.log(rq.qually?.sessionResult.leaderBoardLines)
      const race = {
        id: trackName,
        raceNumber: rq.raceNumber,
        finishingOrder: finishingOrder(rq.race as RawRaceResult),
        fastestLap: fastestLap(rq.race as RawRaceResult), 
        qualifyingOrder: qualifyingOrder(rq.qually as RawQualyResult)
      };
      memo.push(race);
    });
    return memo;
  }, [] as Race[]);
}