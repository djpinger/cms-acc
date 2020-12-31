import { loadRawData, loadSeasonConfig, saveResults } from "./fileSystem";
import { divideRawDataIntoSplits, processSeason } from './season';

const seasonConfig = loadSeasonConfig();
const rawSeasonData = loadRawData();
// const splits = divideRawDataIntoSplits(rawSeasonData);
// splits.forEach(function(split){

// });
// const data = combineSplitRaceData(splits, seasonConfig);

// console.log("---qualifying")
// console.log(splits["1"].qualifying);
// console.log("---race")
// console.log(splits["1"].race);
// saveResults(data);
processSeason(rawSeasonData);