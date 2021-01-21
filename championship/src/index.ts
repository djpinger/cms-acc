import { loadResults, saveToFile } from "./fileSystem";
import { compileSplit } from "./races";

const results = loadResults();
results.splits.forEach(function(split){
  const compiled = compileSplit(split, Object.values(results.drivers));
  saveToFile(`split${split.split}-championship`, compiled);
})
