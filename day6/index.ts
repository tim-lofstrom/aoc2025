import { first, last, map, max, maxBy, range, reduce, replace, rest, reverse, sortBy, split, sum, tail, union } from "lodash";
import { input } from "./input";
import { example } from "./example";

import { readFileSync } from "fs";

function readFile(file: string) {
  return readFileSync(file, "utf8")
    .split("\n")
    .map((line) => line.replace(/\r$/, ""));
}

function transpose<T>(grid: T[][]): T[][] {
  return grid.reduce<T[][]>((acc, row) => row.map((value, i) => [...(acc[i] ?? []), value]), []);
}

const product = (xs: number[]) => xs.reduce((a, b) => a * b, 1);

function part1(data: string[]) {
  const grid = data.map((a) => split(a, " ").filter((item) => item !== ""));
  const transposed = transpose(grid);
  return reduce(
    transposed,
    (acc, row) => {
      const items = reverse(row);
      const operation = getOperation(items);
      const nums = map(tail(items), (item) => parseInt(item));
      return acc + performOperation(operation, nums);
    },
    0
  );
}

function getSeparatorColumns(lines: string[]): number[] {
  const maxLen = Math.max(...lines.map((l) => l.length));
  return [...Array(maxLen).keys()].filter((col) =>
    lines.every((line) => {
      const ch = line[col] ?? " ";
      return !/\d/.test(ch);
    })
  );
}

function replaceSeparators(lines: string[], cols: number[], sep = "x"): string[] {
  const maxLen = Math.max(...lines.map((l) => l.length));
  return lines.map((line) => {
    const chars = line.padEnd(maxLen, " ").split("");
    cols.forEach((col) => {
      chars[col] = sep;
    });
    return chars.join("");
  });
}

function getTransposedGrid(data: string[]) {
  const cols = getSeparatorColumns(data);
  const newData = replaceSeparators(data, cols);
  const grid = newData.map((a) => split(a, "x"));
  const gridPadded = grid.map((a) => a.map((dd) => dd.replace(/ /g, "-")));
  const transposed = transpose(gridPadded);
  return transposed;
}

function getOperation(items: string[]) {
  return split(first(items), "")
    .filter((item) => item !== "-")
    .join();
}

function transposeAndArrangeNumbers(items: string[]) {
  const transposed = transposedNumbers(items);
  const numbersInColumn = map(transposed, (number) =>
    number
      .filter((item) => item !== "-")
      .reverse()
      .join("")
  );
  return map(numbersInColumn, (item) => parseInt(item));
}

function transposedNumbers(items: string[]) {
  const numbers = tail(items);
  const splitted = map(numbers, (number) => split(number, ""));
  return transpose(splitted);
}

function performOperation(operation: string, numbers: number[]) {
  if (operation === "*") {
    return product(numbers);
  } else if (operation === "+") {
    return sum(numbers);
  }

  throw new Error("Fel");
}

function part2(data: string[]) {
  const grid = getTransposedGrid(data);
  return reduce(
    grid,
    (acc, row) => {
      const items = reverse(row);
      const operation = getOperation(items);
      const numbers = transposeAndArrangeNumbers(items);
      return acc + performOperation(operation, numbers);
    },
    0
  );
}

const exampleFile = readFile("./day6/example.txt");
const inputFile = readFile("./day6/input.txt");

console.log("Day 6: Trash Compactor");
console.log("---------");
console.log("Part 1");
console.log("Example: " + part1(example));
console.log("Input: " + part1(input));
console.log("Example: " + part2(exampleFile));
console.log("Input: " + part2(inputFile));
