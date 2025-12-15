import { first, last, map, max, maxBy, range, reduce, replace, rest, reverse, sortBy, split, sum, tail, union } from "lodash";
import { input } from "./input";
import { example } from "./example";

type Point = [number, number];

const beamDirectionDelta: Point = [0, 1];
const beamDirectionNext = ([x, y]: Point): Point => {
  const [dx, dy] = beamDirectionDelta;
  return [x + dx, y + dy];
};

function findStart(grid: string[][], search: string): Point {
  const start = reduce<string[], Point | null>(
    grid,
    (acc, row, y) => {
      if (acc) return acc;
      const x = row.indexOf(search);
      return x !== -1 ? [x, y] : null;
    },
    null
  );

  if (start === null) {
    throw new Error("Hittade inte start");
  }

  return start;
}

function replaceInGrid(grid: string[][], [x, y]: Point, value: string): string[][] {
  return map(grid, (row, rowIndex) => (rowIndex !== y ? row : map(row, (cell, colIndex) => (colIndex === x ? value : cell))));
}

function shootBeam(grid: string[][], start: Point): [string[][], number] {
  const [x, y] = beamDirectionNext(start);

  if (y > grid[0].length) {
    return [grid, 0];
  }

  if (grid[y][x] === ".") {
    const down = replaceInGrid(grid, [x, y], "|");
    return shootBeam(down, [x, y]);
  } else if (grid[y][x] === "^") {
    const left = replaceInGrid(grid, [x - 1, y], "|");
    const [leftShot, leftCount] = shootBeam(left, [x - 1, y]);
    const right = replaceInGrid(leftShot, [x + 1, y], "|");
    const [rightShot, rightCount] = shootBeam(right, [x + 1, y]);
    return [rightShot, leftCount + rightCount + 1];
  }

  return [grid, 0];
}

function part1(data: string[]) {
  let grid = data.map((line) => line.split(""));
  const start = findStart(grid, "S");
  const [manifold, splitCount] = shootBeam(grid, start);
  return splitCount;
}

console.log("Day 7: Laboratories");
console.log("---------");
console.log("Part 1");
console.log("Example: " + part1(example));
console.log("Input: " + part1(input));
