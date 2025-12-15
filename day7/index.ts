import { map, reduce } from "lodash";
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

function shootBeamCountSplit(grid: string[][], start: Point): [string[][], number] {
  const [x, y] = beamDirectionNext(start);

  if (y > grid[0].length) {
    return [grid, 0];
  }

  if (grid[y][x] === ".") {
    const down = replaceInGrid(grid, [x, y], "|");
    return shootBeamCountSplit(down, [x, y]);
  } else if (grid[y][x] === "^") {
    const left = replaceInGrid(grid, [x - 1, y], "|");
    const [leftShot, leftCount] = shootBeamCountSplit(left, [x - 1, y]);
    const right = replaceInGrid(leftShot, [x + 1, y], "|");
    const [rightShot, rightCount] = shootBeamCountSplit(right, [x + 1, y]);
    return [rightShot, leftCount + rightCount + 1];
  }

  return [grid, 0];
}

const keyOf = ([x, y]: Point) => `${x},${y}`;

function beamTimelinesMemoized(grid: string[][], start: Point, memo: Map<string, number>): number {
  const key = keyOf(start);
  return memo.has(key) ? memo.get(key)! : beamTimelines(grid, start, memo, key);
}
function beamTimelines(grid: string[][], start: Point, memo: Map<string, number>, key: string) {
  const [x, y] = beamDirectionNext(start);
  if (y > grid[0].length) {
    memo.set(key, 1);
    return 1;
  }
  const result = shootBeam(grid, y, x, memo, key);
  memo.set(key, result);
  return result;
}

function shootBeam(grid: string[][], y: number, x: number, memo: Map<string, number>, key: string) {
  if (grid[y][x] === ".") {
    return beamTimelinesMemoized(grid, [x, y], memo);
  } else if (grid[y][x] === "^") {
    const leftCount = beamTimelinesMemoized(grid, [x - 1, y], memo);
    const rightCount = beamTimelinesMemoized(grid, [x + 1, y], memo);
    return leftCount + rightCount;
  } else if (grid[y][x] === "|") {
    return 0;
  } else {
    throw new Error("Unexpected grid value");
  }
}

function part1(data: string[]) {
  let grid = data.map((line) => line.split(""));
  const start = findStart(grid, "S");
  const [_manifold, splitCount] = shootBeamCountSplit(grid, start);
  return splitCount;
}

function part2(data: string[]) {
  let grid = data.map((line) => line.split(""));
  const memo = new Map<string, number>();
  const start = findStart(grid, "S");
  const timlines = beamTimelinesMemoized(grid, start, memo);
  return timlines;
}

console.log("Day 7: Laboratories");
console.log("---------");
console.log("Part 1");
console.log("Example: " + part1(example));
console.log("Input: " + part1(input));
console.log("Example: " + part2(example));
console.log("Example: " + part2(input));
