import { inRange, reduce, first, tail, last, initial, map, sortBy, range } from "lodash";
import { input } from "./input";
import { example } from "./example";

function part1(data: string[]) {
  const result = reduce(
    data,
    (acc, line) => {
      return acc;
    },
    0
  );
  return result;
}

console.log("Day 2: Gift Shop");
console.log("---------");
console.log("Part 1");
console.log("Example: " + part1(example));
console.log("Input: " + part1(input));
