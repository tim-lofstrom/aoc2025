import { clone, constant, every, find, first, flatMap, forEach, initial, isEqual, last, map, reduce, reverse, sortBy, tail, times } from "lodash";
import { input } from "./input";
import { example } from "./example";
import { init } from "z3-solver";

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

function processPartWorksForExampleButNotInput(buttons: number[][], joltageStart: number[], targetJoltage: number[]) {
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

export async function processZsolver(buttons: number[][], target: number[]): Promise<number> {
  const { Context } = await init();
  const context = new (Context as any)("joltage");
  const buttonLength = buttons.length;
  const targetLength = target.length;

  const x = Array.from({ length: buttonLength }, (_, i) => context.Int.const(`x_${i}`));
  const opt = new context.Optimize();

  for (const xi of x) {
    opt.add(xi.ge(0));
  }

  for (let j = 0; j < targetLength; j++) {
    const contributors = [];
    for (let i = 0; i < buttonLength; i++) {
      if (buttons[i].includes(j)) {
        contributors.push(x[i]);
      }
    }
    opt.add(context.Sum(...contributors).eq(target[j]));
  }

  const total = context.Sum(...x);
  opt.minimize(total);
  const result = await opt.check();

  if (result !== "sat") {
    throw new Error("No solution");
  }

  const model = opt.model();
  return Number(model.eval(total).toString());
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
      const i = processPartWorksForExampleButNotInput(item.buttons, createInitialJoltage(item.joltage.length), item.joltage);
      return acc + i;
    },
    0
  );
}

async function part2Zsolver(data: string[]) {
  const parsed = parseData(data);
  let acc = 0;
  for (let i = 0; i < parsed.length; i++) {
    const state = parsed[i];
    const result = await processZsolver(state.buttons, state.joltage);
    const progress = Math.ceil((i / parsed.length) * 100);
    if (progress % 5 === 0) {
      console.log("Progress: " + progress + "%");
    }
    acc += result;
  }
  return acc;
}

async function main() {
  console.log("Day 10: Factory");
  console.log("---------");
  console.log("Part 1");
  console.log("Example: " + part1(example));
  console.log("Input: " + part1(input));

  console.log("Part 2");
  console.log("Input: " + part2(example));
  console.log("Example: " + (await part2Zsolver(input)));
}

main();
