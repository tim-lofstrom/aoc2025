import { first, flatMap, forEach, range, reduce, reverse, slice, sortBy, tail, take } from "lodash";
import { input } from "./input";
import { example } from "./example";

type Point2D = [number, number];

type Rectangle = Point2D[];

type Pair = {
  area: number;
  rectangle: Rectangle;
};

function parsePoints(data: string[]): Point2D[] {
  return data.map((line) => line.split(",").map(Number) as Point2D);
}

function rectangleArea([x1, y1]: Point2D, [x2, y2]: Point2D): number {
  const width = Math.abs(x2 - x1) + 1;
  const height = Math.abs(y2 - y1) + 1;
  return width * height;
}

function rectangleFromBounds(minX: number, minY: number, maxX: number, maxY: number): Rectangle {
  return [
    [minX, minY],
    [maxX, minY],
    [maxX, maxY],
    [minX, maxY],
  ];
}

function rectangleFromPoints([x1, y1]: Point2D, [x2, y2]: Point2D): Rectangle {
  const [minX, maxX] = [x1, x2].sort((a, b) => a - b);
  const [minY, maxY] = [y1, y2].sort((a, b) => a - b);
  return rectangleFromBounds(minX, minY, maxX, maxY);
}

function toPair(p1: Point2D, p2: Point2D): Pair {
  const rectangle = rectangleFromPoints(p1, p2);
  return {
    area: rectangleArea(p1, p2),
    rectangle,
  };
}

function allPairs(points: Point2D[]): Pair[] {
  return flatMap(points, (p1) => tail(points).map((p2) => toPair(p1, p2)));
}

function part1(data: string[]) {
  const points = parsePoints(data);
  const sorted = sortBy(allPairs(points), "area");
  const pairs = reverse(sorted);
  return first(pairs)?.area;
}

function part2(data: string[]) {
  const points = parsePoints(data);
  return 1;
}

console.log("Day 9: Movie Theater");
console.log("---------");
console.log("Part 1");
console.log("Example: " + part1(example));
console.log("Input: " + part1(input));

// To high: 4650952673
// To high: 4598853740
