import { Extension, loadResults, saveToFile } from "./fileSystem";
import { compileSplit } from "./races";
import { compileCSVForCarClass } from './csv';

const results = loadResults();
results.splits.forEach(function(split){
  const compiled = compileSplit(split, Object.values(results.drivers));
  saveToFile(`split${split.split}-championship`, compiled);
  saveToFile(`split${split.split}-gt3-championship`, compileCSVForCarClass(compiled.GT3, 'GT3'), Extension.CSV);
  saveToFile(`split${split.split}-gt4-championship`, compileCSVForCarClass(compiled.GT4, 'GT4'), Extension.CSV);
})
