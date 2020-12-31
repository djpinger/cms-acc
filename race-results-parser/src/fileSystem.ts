import path from 'path';
import fs from 'fs';
import { RawRaceOrQualifyResult, SeasonConfig, CarConfig } from './modelsRaw';

const memo = {};

function memoize<T>(filepath: string, contents: T){
  if(!memo[filepath]) {
    memo[filepath] = contents;
  }
  return memo[filepath];
}

function readJSON<T>(filepath: string): T {
  if(process.env.NODE_ENV !== 'test'){
    console.log(`Loading ${filepath}`);
  }
  if(!fs.existsSync(filepath)){
    throw `"${filepath}" not found`;
  }

  try {
    // Kunos server files are in this format
    const contents = fs.readFileSync(filepath, {encoding: 'utf16le', flag:'r'});
    return JSON.parse(contents);
  } catch (error) {
    try {
      const contents = fs.readFileSync(filepath, {encoding: 'utf8', flag:'r'});
      return JSON.parse(contents);
    } catch (error) {
      throw new Error(`JSON parsing failed for utf16 and utf8:\n ${error}`)
    }
  }
}

export function loadRawData(): RawRaceOrQualifyResult[] {
  const dataDir = path.join(__dirname, '../', 'data');
  const files = fs.readdirSync(dataDir);

  return files.reduce((memo, file) => {
    const filepath = path.join(dataDir, file);
    if (path.extname(file) == ".json"){
      memo.push(readJSON(filepath));
    }
    return memo;
  }, [] as RawRaceOrQualifyResult[]);
}

export function loadSeasonConfig(): SeasonConfig {
  const filepath = path.join(__dirname, '../', 'config', 'seasonConfig.json');
  return memoize(filepath, readJSON<SeasonConfig>(filepath));
}

export function loadCarsConfig(): CarConfig {
  const filepath = path.join(__dirname, '../', 'config', 'cars.json');
  return memoize(filepath, readJSON<CarConfig>(filepath));
}

export function saveToFile(filename: string, data: any): void {
  const filepath = path.join(__dirname, '../', 'results', `${filename}.json`);
  const str = JSON.stringify(data, null, 2);
  fs.writeFileSync(filepath, str);
}