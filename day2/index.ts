import { inRange, reduce, first, tail, last, initial, map, sortBy, range } from "lodash";
import { input } from "./input";
import { example } from "./example";

const ranges = 100;

function part2_2(data: string[]) {
  let dial = 50;
  let count = 0;

  data.forEach((line) => {
    const dir = first(line);
    const value = parseInt(tail(line).join(""));

    if (dir === "L") {
      range(0, value).forEach((item) => {
        dial = (dial - 1) % 100;

        if (dial === 0) {
          count += 1;
        }
      });
    } else if (dir === "R") {
      range(0, value).forEach((item) => {
        dial = (dial + 1) % 100;
        if (dial === 0) {
          count += 1;
        }
      });
    }
  });

  return count;
}

function part2(data: string[]) {
  const result = reduce(
    data,
    ([acc, dial], line) => {
      const turnOver = calcWraps(line, dial);
      const totalt = acc + turnOver;

      const next = turnDial(line, dial);
      const wrapped = ((next % ranges) + ranges) % ranges;

      return [totalt, wrapped];
    },
    [0, 50]
  );
  return first(result);
}

function part1(data: string[]) {
  const result = reduce(
    data,
    ([acc, dial], line) => {
      const next = turnDial(line, dial);
      const wrapped = ((next % ranges) + ranges) % ranges;
      return [wrapped === 0 ? (acc += 1) : acc, wrapped];
    },
    [0, 50]
  );
  return first(result);
}

function turnDial(line: string, dial: number) {
  const value = parseInt(tail(line).join(""));
  switch (first(line)) {
    case "L":
      return dial - value;
    case "R":
      return dial + value;
    default:
      throw new Error("Unexpected value in line " + line);
  }
}

function calcWraps(line: string, dial: number) {
  const value = parseInt(tail(line).join(""));

  switch (first(line)) {
    case "R":
      if (value > ranges - dial) {
        return 1 + Math.floor((value - (ranges - dial)) / ranges);
      }
      return 0;
    case "L":
      if (value >= dial) {
        return 1 + Math.floor((value - dial) / ranges);
      }
      return 0;
    default:
      throw new Error("Unexpected value in line " + line);
  }
}

console.log("Day 1: Secret Entrance");
// console.log("---------");
// console.log("Part 1");
// console.log("Example: " + part1(example));
// console.log("Input: " + part1(input));
// console.log("---------");
console.log("Part 2");
console.log("Example: " + part2(example));
console.log("Input: " + part2(input));
console.log("Input: " + part2_2(input));

/**
 * Part 2: Responses
 * 2410 too low
 * 3150 wrong
 * 5521 wrong
 * 5598 wrong
 * 5866 wrong
 * 5876 too low
 * 5887 correct
 * 5970 wrong
 * 6236 too high
 */
