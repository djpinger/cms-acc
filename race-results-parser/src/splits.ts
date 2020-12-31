import { RawRaceOrQualifyResult } from "./modelsRaw";
import { getSplitNumber } from "./utilities";

export function createSplits(seasonResults: RawRaceOrQualifyResult[]): RawRaceOrQualifyResult[][] {
  const results = seasonResults.reduce(function(memo, result){
    const index = getSplitNumber(result.serverName);
    if(!memo[index]){
      memo[index] = [];
    }
    memo[index].push(result);
    return memo;
  }, [] as RawRaceOrQualifyResult[][]);
  // index 0 will always be undefined
  results.shift();
  return results;
}