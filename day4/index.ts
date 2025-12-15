import { map } from "lodash";
import { input } from "./input";
import { example } from "./example";

function isRollOrRemoved(point: string) {
  return point === "@" || point === "x";
}

type Point = [number, number];

const deltas = [
  [-1, -1],
  [0, -1],
  [1, -1],
  [-1, 0],
  [1, 0],
  [-1, 1],
  [0, 1],
  [1, 1],
];

function inBounds(x: number, y: number, height: number, width: number) {
  return x >= 0 && y >= 0 && y < height && x < width;
}

const surroundingPoints = ([x, y]: Point): Point[] => deltas.map(([dx, dy]) => [x + dx, y + dy]);

function countRolls(grid: string[][], surrounding: Point[]): number {
  const height = grid.length;
  const width = grid[0].length;
  return surrounding.filter(([x, y]) => {
    return inBounds(x, y, height, width) && isRollOrRemoved(grid[x][y]);
  }).length;
}

function calculate(grid: string[][]) {
  let total = 0;
  for (let x = 0; x < grid.length; x++) {
    for (let y = 0; y < grid[x].length; y++) {
      const point = grid[x][y];
      if (isRollOrRemoved(point)) {
        const surrounding = surroundingPoints([x, y]);
        const counts = countRolls(grid, surrounding);
        if (counts < 4) {
          grid[x][y] = "x";
          total += 1;
        }
      }
    }
  }
  return { total, grid };
}

function replaceInGrid(grid: string[][], search: string, replace: string): string[][] {
  return map(grid, (x) => map(x, (y) => (y === search ? replace : y)));
}

function part1(data: string[]) {
  let grid = data.map((line) => line.split(""));
  return calculate(grid).total;
}

function part2(data: string[]) {
  let totalt = 0;
  let current = 0;
  let grid = data.map((line) => line.split(""));

  do {
    const result = calculate(grid);
    current = result.total;
    totalt += result.total;
    grid = replaceInGrid(result.grid, "x", ".");
  } while (current > 0);

  return totalt;
}

console.log("Day 4: Printing Department");
console.log("---------");
console.log("Part 1");
console.log("Example: " + part1(example));
console.log("Input: " + part1(input));
console.log("Example: " + part2(example));
console.log("Input: " + part2(input));
