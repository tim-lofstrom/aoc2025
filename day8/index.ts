import { flatMap, forEach, range, reduce, slice, sortBy, take } from "lodash";
import { input } from "./input";
import { example } from "./example";

type Pair = {
  a: number;
  b: number;
  dist: number;
};

type Point3D = [number, number, number];

function parseData(data: string[]): Point3D[] {
  return data.filter(Boolean).map((l) => l.split(",").map(Number) as Point3D);
}

function distance(a: Point3D, b: Point3D): number {
  const dx = a[0] - b[0];
  const dy = a[1] - b[1];
  const dz = a[2] - b[2];
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

function allPairs(points: Point3D[]): Pair[] {
  return flatMap(points, (box1, index) =>
    slice(points, index + 1).map((box2, j) => ({
      a: index,
      b: index + 1 + j,
      dist: distance(box1, box2),
    }))
  );
}

function closestPairs(points: Point3D[], n: number): Pair[] {
  return take(sortBy(allPairs(points), "dist"), n);
}

function buildGraph(n: number, pairs: Pair[]): number[][] {
  return reduce(
    pairs,
    (graph, { a, b }) => {
      graph[a].push(b);
      graph[b].push(a);
      return graph;
    },
    range(n).map(() => [] as number[])
  );
}

function traverseCircuit(graph: number[][], visited: boolean[], start: number): number {
  if (visited[start]) return 0;
  const stack = [start];
  visited[start] = true;
  let size = 0;
  while (stack.length > 0) {
    const v = stack.pop()!;
    size++;
    forEach(graph[v], (n) => {
      if (!visited[n]) {
        visited[n] = true;
        stack.push(n);
      }
    });
  }
  return size;
}

function circuitSizes(graph: number[][]): number[] {
  const visited = Array(graph.length).fill(false);
  const sizes: number[] = [];

  forEach(range(graph.length), (start) => {
    const size = traverseCircuit(graph, visited, start);
    if (size > 0) {
      sizes.push(size);
    }
  });

  return sizes;
}

function part1(data: string[], n: number): number {
  const points = parseData(data);
  const pairs = closestPairs(points, n);
  const graph = buildGraph(points.length, pairs);
  const sizes = circuitSizes(graph).sort((a, b) => b - a);
  return sizes[0] * sizes[1] * sizes[2];
}

/**
 * Slow but worked
 */
function part2(data: string[]): number {
  const points = parseData(data);

  let ans = 0;

  for (let i = 6550; (i += 1); i < 10000) {
    const pairs = closestPairs(points, i);
    const graph = buildGraph(points.length, pairs);
    const sizes = circuitSizes(graph).sort((a, b) => b - a);

    console.log("I: " + i + " SIZE: " + sizes.length);

    if (sizes.length === 1) {
      const x = pairs[pairs.length - 1].a;
      const y = pairs[pairs.length - 1].b;

      ans = points[x][0] * points[y][0];
      break;
    }
  }

  return ans;
}

console.log("Day 8: Playground");
console.log("---------");
console.log("Part 1");
// console.log("Example: " + part1(example, 10));
// console.log("Input: " + part1(input, 1000));

// console.log("Example: " + part2(example));
console.log("Input: " + part2(input));

// 176904 to low

// Candidate: 1738811328

//ANS: 1474050600
