import path from  'path';
import { loadRawData, loadSeasonConfig } from "./dataLoader";

const seasonConfig = loadSeasonConfig();
const rawSeasonData = loadRawData();
console.log(rawSeasonData)