import path from 'path';
import fs from 'fs';
import { SeasonConfig, CarConfig } from './modelsConfig';
import { FinalResults, Penalty } from './modelsInput';
import csvParse from 'csv-parse/lib/sync';

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

export function loadSeasonConfig(): SeasonConfig {
  const filepath = path.join(__dirname, '../', 'config', 'seasonConfig.json');
  return memoize(filepath, readJSON<SeasonConfig>(filepath));
}

export function loadCarsConfig(): CarConfig {
  const filepath = path.join(__dirname, '../', 'config', 'cars.json');
  return memoize(filepath, readJSON<CarConfig>(filepath));
}

export function loadResults(): FinalResults {
  const filepath = path.join(__dirname, '../', 'data', 'compiled', 'compiled-results.json');
  return memoize(filepath, readJSON<FinalResults>(filepath));
}

export function loadPenalties(): Penalty[] {
  const filepath = path.join(__dirname, '../', 'data', 'penalties.csv');
  const contents = fs.readFileSync(filepath, {encoding: 'utf8', flag:'r'});
  const parsedCsv = csvParse(contents, {
    columns: true,
    skip_empty_lines: true
  });
  return memoize(filepath, parsedCsv);
}

export function saveToFile(filename: string, data: any): void {
  const compiledPath = path.join(__dirname, '../', 'data', 'compiled');
  if(!fs.existsSync(compiledPath)){
    fs.mkdirSync(compiledPath);
  }
  const filepath = path.join(compiledPath, `${filename}.json`);
  const str = JSON.stringify(data, null, 2);
  fs.writeFileSync(filepath, str);
}