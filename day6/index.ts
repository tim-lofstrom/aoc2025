import { first, last, map, max, maxBy, range, reduce, replace, rest, reverse, sortBy, split, sum, tail, union } from "lodash";
import { input } from "./input";
import { example } from "./example";

import { readFileSync } from "fs";

function transpose<T>(grid: T[][]): T[][] {
  return grid.reduce<T[][]>((acc, row) => row.map((value, i) => [...(acc[i] ?? []), value]), []);
}

const product = (xs: number[]) => xs.reduce((a, b) => a * b, 1);

function part1(data: string[]) {
  const grid = data.map((a) => split(a, " ").filter((item) => item !== ""));
  const transposed = transpose(grid);

  const result = reduce(
    transposed,
    (acc, row) => {
      const items = reverse(row);
      const operation = first(items);
      const nums = map(tail(items), (item) => parseInt(item));

      if (operation === "*") {
        return acc + product(nums);
      } else if (operation === "+") {
        return acc + sum(nums);
      }
      return acc;
    },
    0
  );

  return result;
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

function part22(data: string[]) {
  const grid = getTransposedGrid(data);

  const result = reduce(
    grid,
    (acc, row) => {
      const items = reverse(row);
      const operation = split(first(items), "")
        .filter((item) => item !== "-")
        .join();

      const numbers = tail(items);

      const dsad = map(numbers, (d) => split(d, ""));

      const transposed = transpose(dsad);

      const dg = map(transposed, (iii) =>
        iii
          .filter((dsa) => dsa !== "-")
          .reverse()
          .join("")
      );

      const ddd = map(dg, (asasd) => parseInt(asasd));

      if (operation === "*") {
        return acc + product(ddd);
      } else if (operation === "+") {
        return acc + sum(ddd);
      }
      return acc;
    },
    0
  );

  return result;
}

function part2(data: string[]) {
  const f = first(reverse(data));

  const asd = split(f, " ");

  const grid = data.map((a) => split(a, " "));
  const transposed = transpose(grid);

  const result = reduce(
    transposed,
    (acc, row) => {
      const items = reverse(row);
      const operation = first(items);

      const numbers = tail(items);
      const maxNumberLength = maxBy(numbers, (i) => i.length)?.length ?? 0;

      const asd =
        map(numbers, (num) => {
          return num.padStart(maxNumberLength, "x");
        }) ?? [];

      const dsad = map(asd, (d) => split(d, ""));

      const transposed = transpose(dsad);

      const dg = map(transposed, (iii) =>
        iii
          .filter((dsa) => dsa !== "x")
          .reverse()
          .join("")
      );

      const ddd = map(dg, (asasd) => parseInt(asasd));

      if (operation === "*") {
        return acc + product(ddd);
      } else if (operation === "+") {
        return acc + sum(ddd);
      }
      return acc;
    },
    0
  );

  return result;
}

const raw = readFileSync("./day6/input.txt", "utf8")
  .split("\n")
  .map((line) => line.replace(/\r$/, ""));

console.log("Day 6: Trash Compactor");
console.log("---------");
console.log("Part 1");
// console.log("Example: " + part1(example));
// console.log("Input: " + part1(input));
console.log("Example: " + part22(raw));
// console.log("Example: " + part22(input));
