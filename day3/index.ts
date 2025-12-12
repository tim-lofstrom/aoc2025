import { reduce, indexOf, slice, maxBy, dropRight } from "lodash";
import { input } from "./input";
import { example } from "./example";

function findHighestJoltage(parts: number[], slots: number): string {
  if (slots === 1) {
    return String(maxBy(parts));
  }
  const candidates = dropRight(parts, slots - 1);
  const max = maxBy(candidates);
  const index = indexOf(candidates, max);
  const rest = slice(parts, index + 1, parts.length);
  return String(max) + findHighestJoltage(rest, slots - 1);
}

function calculateJoltageData(data: string[], batteries: number) {
  return reduce(
    data,
    (acc, line) => {
      const parts = parseLineToNumbers(line);
      const joltage = findHighestJoltage(parts, batteries);
      return (acc += parseInt(joltage));
    },
    0
  );
}

function parseLineToNumbers(line: string) {
  return line.split("").map((item) => parseInt(item));
}

function part1(data: string[]) {
  return calculateJoltageData(data, 2);
}

function part2(data: string[]) {
  return calculateJoltageData(data, 12);
}

console.log("Day 3: Lobby");
console.log("---------");
console.log("Part 1");
console.log("Example: " + part1(example));
console.log("Input: " + part1(input));
console.log("Input: " + part2(example));
console.log("Input: " + part2(input));
