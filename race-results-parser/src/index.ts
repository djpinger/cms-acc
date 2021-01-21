import { compileDrivers } from "./drivers";
import { loadRawData, saveToFile } from "./fileSystem";
import { FinalResults } from "./modelsOutput";
import { complileRaces } from "./races";
import { createSplits } from "./splits";

const rawSeasonData = loadRawData();
const drivers = compileDrivers(rawSeasonData);
const resultSplits = createSplits(rawSeasonData);
const splits = resultSplits.map((splitResults, index) => ({split: index + 1, races: complileRaces(splitResults)}));
saveToFile('drivers', drivers);
saveToFile('compiled-results', {drivers, splits} as FinalResults);