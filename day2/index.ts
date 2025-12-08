import { inRange, reduce, first, tail, last, initial, map, sortBy, range, split, flatMap, chain } from "lodash";
import { input } from "./input";
import { example } from "./example";

function part2(data: string[]) {
  const ids = flatMap(data, (item) => parseIds(item));
  return reduce(
    ids,
    (acc, id) => {
      return isInvalidIdRange(id) ? acc + id : acc;
    },
    0
  );
}

function part1(data: string[]) {
  const ids = flatMap(data, (item) => parseIds(item));
  return reduce(
    ids,
    (acc, id) => {
      return isInvalidId(id) ? acc + id : acc;
    },
    0
  );
}

export function isInvalidId(id: number): boolean {
  const s = String(id);
  if (s.length % 2 !== 0) return false;
  const half = s.length / 2;
  const part = s.slice(0, half);
  if (part.startsWith("0")) return false;
  return part + part === s;
}

export function isInvalidIdRange(id: number): boolean {
  const s = String(id);
  const n = s.length;
  if (s.startsWith("0")) return false;
  const unitLens = range(1, Math.floor(n / 2) + 1);
  return chain(unitLens)
    .some((unitLen) => n % unitLen === 0 && n / unitLen >= 2 && s.slice(0, unitLen).repeat(n / unitLen) === s)
    .value();
}

function parseIds(line: string) {
  const parts = split(line, "-").map((item) => parseInt(item));
  return range(parts[0], parts[1] + 1);
}

console.log("Day 2: Gift Shop");
console.log("---------");
console.log("Part 1");
console.log("Example: " + part1(example));
console.log("Input: " + part1(input));
console.log("---------");
console.log("Part 2");
console.log("Example: " + part2(example));
console.log("Input: " + part2(input));
