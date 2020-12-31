import { Lap, LeaderBoardLine, RawQualyResult, RawRaceOrQualifyResult, RawRaceResult, SeasonConfig } from "./models";
import { CarClasses, splitSeasonRacesIntoClasses, CarClass, CarClassResults } from './classes';

type Split = {
  splitNumber: number;
  rounds: Rounds;
}

type Rounds = {
  [trackName: string]: Round;
}

type Round = {
  qualifying: RawRaceResult[];
  race: RawQualyResult[];
}

type CombinedRace = {
  trackName: string;
  classes: {
    className: CarClass;
    finishingPositions: LeaderBoardLine[];
    laps: Lap[];
  }[];
}

type CombinedSplitRaceData = {
  split: number;
  races: CombinedRace[];
}

type RoundWithClasses = {
  sessions: RaceSession[];
}

type RaceSession = {
  session: number;
  qualifying: RawRaceResult[];
  race: RawQualyResult[];
}

const splitRegex = /Split (\d)$/;

/**
 * @description Creates and array of race results based on splits. The split number is the index
 * of the array
 */
export function divideRawDataIntoSplits(rawDataResults: RawRaceOrQualifyResult[]): Split[] {
  return rawDataResults.reduce(function(memo, result){
    const matches = result.serverName.match(splitRegex);
    if(!matches){
      throw new Error(`Split number not found in result.serverName "${result.serverName}"`);
    }
    const index = matches[1];
    let split: Split = memo[index];
    if(!memo[index]){
      memo[index] = {
        splitNumber: memo[index],
        rounds: {},
      } as Split;
      split = memo[index];
    }

    if(!split.rounds[result.trackName]){
      split.rounds[result.trackName] = {
        qualifying: [],
        race: [],
      };
    }
    const sessionType = result.sessionType.charAt(0) === 'Q' ? 'qualifying' : 'race';
    const sessionIndex = result.sessionType.charAt(1) === '' ? 0 : parseInt(result.sessionType.charAt(1));
    const collection = split.rounds[result.trackName][sessionType] as RawRaceOrQualifyResult[];
    collection.splice(sessionIndex, 0, result);

    return memo;
  }, [] as Split[]);
}

export function processSeason(rawDataResults: RawRaceOrQualifyResult[]) {
  const splits = divideRawDataIntoSplits(rawDataResults);
}

// export function combineSplitRaceData(splits: Split[], seasonConfig: SeasonConfig): CombinedSplitRaceData[] {
//   return splits.reduce(function(memo, split){
//     const splitNumber = split.splitNumber
//     const splitIndex = splitNumber - 1;
//     const data: CombinedSplitRaceData = {
//       split: splitNumber,
//       races: []
//     };
//     const carClassesByRace =  splitSeasonRacesIntoClasses(split.rounds);

//     // create a record for each race in the config
//     seasonConfig.races.forEach(function(race) {
//       const combinedRace: CombinedRace = {
//         trackName: race.trackName,
//         classes: [],
//       };
//       // classes will be empty if the race hasn't been run
//       if(carClassesByRace[race.trackName]){
//         Object.keys(carClassesByRace[race.trackName]).forEach(function(carClass){
//           const carClassResults: CarClassResults = (carClassesByRace[race.trackName] as CarClasses)[carClass];
//           combinedRace.classes.push({
//             className: carClass as CarClass,
//             finishingPositions: carClassResults.finishingPositions,
//             laps: carClassResults.laps,
//           })
//         })
//       }
//       data.races.push(combinedRace);
//     });
//     if(!memo[splitIndex]){
//       memo.splice(splitIndex, 0, data);
//     }
//     return memo;
//   }, [] as CombinedSplitRaceData[]);
// }