import { clone, constant, every, find, first, flatMap, forEach, initial, isEqual, map, reduce, reverse, sortBy, tail, times } from "lodash";
import { input } from "./input";
import { example } from "./example";

function parseLights(part: string | undefined): string[] {
  return part?.replace("[", "").replace("]", "").split("") ?? [];
}

function parseButtons(buttons: string[]): number[][] {
  return buttons.map((button) => {
    return button.replace("(", "").replace(")", "").split(",").map(Number);
  });
}

function parseData(data: string[]) {
  return data.map((item) => {
    const parts = item.split(" ");
    return { lights: parseLights(first(parts)), buttons: parseButtons(initial(tail(parts))) };
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

function checkDone(state: string[], target: string[]) {
  return isEqual(state, target);
}

function process(startState: string[], targetState: string[], buttons: number[][]): number {
  const queue: Array<{ state: string[]; depth: number }> = [{ state: startState, depth: 0 }];

  const visited = new Set<string>();
  const serialize = (s: string[]) => s.join(",");

  while (true) {
    const { state, depth } = queue.shift()!;
    const key = serialize(state);

    if (visited.has(key)) continue;
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

function createInitialState(length: number) {
  return times(length, constant("."));
}

function part1(data: string[]) {
  const pp = parseData(data);

  const result = reduce(
    pp,
    (acc, item) => {
      const i = process(createInitialState(item.lights.length), item.lights, item.buttons);
      return acc + i;
    },
    0
  );

  return result;
}

console.log("Day 10: Factory");
console.log("---------");
console.log("Part 1");
console.log("Example: " + part1(example));
console.log("Example: " + part1(input));
