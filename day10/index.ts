import { clone, constant, every, find, first, flatMap, forEach, initial, isEqual, last, map, reduce, reverse, sortBy, tail, times } from "lodash";
import { input } from "./input";
import { example } from "./example";

function parseLights(lights: string | undefined): string[] {
  return lights?.replace("[", "").replace("]", "").split("") ?? [];
}

function parseButtons(buttons: string[]): number[][] {
  return buttons.map((button) => {
    return button.replace("(", "").replace(")", "").split(",").map(Number);
  });
}

function parseJoltage(joltage: string | undefined): any {
  return joltage?.replace("{", "").replace("}", "").split(",").map(Number) ?? [];
}

function parseData(data: string[]) {
  return data.map((item) => {
    const parts = item.split(" ");
    return { lights: parseLights(first(parts)), buttons: parseButtons(initial(tail(parts))), joltage: parseJoltage(last(parts)) };
  });
}

function toggleButton(state: string[], index: number) {
  if (state[index] === "#") {
    state[index] = ".";
  } else if (state[index] === ".") {
    state[index] = "#";
  }
}

function pressButton(state: string[], button: number[]) {
  const nextState = clone(state);
  forEach(button, (index) => {
    toggleButton(nextState, index);
  });
  return nextState;
}

function appendJoltage(joltage: number[], button: number[]): number[] {
  const nextState = clone(joltage);
  forEach(button, (index) => {
    nextState[index] += 1;
  });
  return nextState;
}

function checkJoltageDone(joltage: number[], targetJoltage: number[]) {
  return isEqual(joltage, targetJoltage);
}

function checkDone(state: string[], target: string[]) {
  return isEqual(state, target);
}

const toKey = (state: string[]) => state.join(",");

function process(startState: string[], targetState: string[], buttons: number[][]): number {
  const queue = [{ state: startState, depth: 0 }];
  const visited = new Set<string>();

  while (true) {
    const { state, depth } = queue.shift()!;
    const key = toKey(state);

    if (visited.has(key)) {
      continue;
    }

    visited.add(key);

    if (checkDone(state, targetState)) {
      return depth;
    }

    for (const button of buttons) {
      queue.push({
        state: pressButton(state, button),
        depth: depth + 1,
      });
    }
  }
}

function createInitialJoltage(length: number) {
  return times(length, constant(0));
}

function createInitialState(length: number) {
  return times(length, constant("."));
}

function processPart2(buttons: number[][], joltageStart: number[], targetJoltage: number[]) {
  const queue = [{ joltage: joltageStart, depth: 0 }];
  const visited = new Set<string>();

  while (true) {
    const shifted = queue.shift();
    const { joltage, depth } = shifted!;
    const key = toKey(map(joltage, (j) => j.toString()));

    if (visited.has(key)) {
      continue;
    }

    visited.add(key);

    if (checkJoltageDone(joltage, targetJoltage)) {
      return depth;
    }

    for (const button of buttons) {
      queue.push({
        joltage: appendJoltage(joltage, button),
        depth: depth + 1,
      });
    }
  }
}

function part1(data: string[]) {
  const parsed = parseData(data);
  return reduce(
    parsed,
    (acc, item) => {
      const i = process(createInitialState(item.lights.length), item.lights, item.buttons);
      return acc + i;
    },
    0
  );
}

function part2(data: string[]) {
  const parsed = parseData(data);
  return reduce(
    parsed,
    (acc, item) => {
      const i = processPart2(item.buttons, createInitialJoltage(item.joltage.length), item.joltage);
      return acc + i;
    },
    0
  );
}

console.log("Day 10: Factory");
console.log("---------");
console.log("Part 1");
console.log("Example: " + part1(example));
console.log("Input: " + part1(input));

console.log("Part 2");
console.log("Example: " + part2(example));
// console.log("Input: " + part2(input));
