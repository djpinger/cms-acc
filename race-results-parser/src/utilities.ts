import { RawRaceOrQualifyResult } from "./modelsRaw";

export function isRaceResult(seasonResult: RawRaceOrQualifyResult): boolean {
  return seasonResult.sessionType.charAt(0).toLocaleLowerCase() === 'r';
}

export function isQualifyingResult(seasonResult: RawRaceOrQualifyResult): boolean {
  return seasonResult.sessionType.charAt(0).toLocaleLowerCase() === 'q';
}

export function getSplitNumber(serverName: string): number{
  const splitRegex = /Split (\d)$/;
  const matches = serverName.match(splitRegex);
  if(!matches){
    throw new Error(`Split number not found in result.serverName "${serverName}"`);
  }
  return parseInt(matches[1] as string);
}

export const maxLapTime = 9999999999;