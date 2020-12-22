import path from 'path';
import fs from 'fs';
import { RawRaceOrQualifyResult, SeasonConfig } from './models';

function readJSON<T>(filepath: string): T {
  console.log(`Loading ${filepath}`);
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
  return readJSON(path.join(__dirname, '../', 'config', 'seasonConfig.json'));
}