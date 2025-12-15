import { map, range, reduce, sortBy, split, sum, union } from "lodash";
import { input } from "./input";
import { Database, example } from "./example";

function part1(data: Database) {
  const ranges = getRanges(data);
  const ingredients = map(data.ingredients, (ingredient) => parseInt(ingredient));
  return ingredients.filter((item) => inAnyRange(ranges, item)).length;
}

function inAnyRange(ranges: { low: number; high: number }[], item: number): unknown {
  return ranges.filter((range) => inRange(item, range)).length > 0;
}

function inRange(item: number, range: { low: number; high: number }): unknown {
  return item >= range.low && item <= range.high;
}

function getRanges(data: Database): Range[] {
  return data.fresh.map((item) => {
    const parts = split(item, "-");
    return {
      low: parseInt(parts[0]),
      high: parseInt(parts[1]),
    } as Range;
  });
}

type Range = { low: number; high: number };

type State = {
  count: number;
  currentLow: number;
  currentHigh: number;
};

const overlaps = (state: State, low: number) => low <= state.currentHigh + 1;

const extend = (state: State, high: number): State => ({
  ...state,
  currentHigh: Math.max(state.currentHigh, high),
});

const closeAndStart = (state: State, low: number, high: number): State => ({
  count: state.count + (state.currentHigh - state.currentLow + 1),
  currentLow: low,
  currentHigh: high,
});

function countUnionRanges(ranges: Range[]): number {
  const sorted = sortBy(ranges, "low");
  const finalState = reduce(sorted.slice(1), (state, { low, high }) => (overlaps(state, low) ? extend(state, high) : closeAndStart(state, low, high)), {
    count: 0,
    currentLow: sorted[0].low,
    currentHigh: sorted[0].high,
  });

  return finalState.count + (finalState.currentHigh - finalState.currentLow + 1);
}

function part2(data: Database) {
  const ranges = getRanges(data);
  return countUnionRanges(ranges);
}

console.log("Day 5: Cafeteria");
console.log("---------");
console.log("Part 1");
console.log("Example: " + part1(example));
console.log("Input: " + part1(input));
console.log("Example: " + part2(example));
console.log("Input: " + part2(input));
