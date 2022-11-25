import fs from 'fs';

function readJsonFile(path: string): Record<string, Array<Record<string, any>>> {
  const data: Record<string, Array<Record<string, any>>> = JSON.parse(fs.readFileSync(path).toString());
  return data
}

export { readJsonFile }