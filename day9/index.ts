import { first, flatMap, reverse, sortBy, tail } from "lodash";
import { input } from "./input";
import { example } from "./example";
import { point, Polygon } from "@flatten-js/core";

type Point2D = [number, number];

type Rectangle = Point2D[];

type Pair = {
  area: number;
  rectangle: Rectangle;
};

function sortedPolygons(cornersInside: Pair[]) {
  const parts = cornersInside.map((item) => toPolygon(item));
  return sortBy(parts, "area");
}

function toPolygon(item: Pair): { poly: Polygon; area: number } {
  return { poly: new Polygon([...item.rectangle]), area: item.area };
}

function candidates(pairs: Pair[], shape: Polygon) {
  const pairsSet = toSet(pairs);
  const lookupMap = new Map<string, boolean>();
  pairsSet.forEach((item) => {
    const parts = item.split(",").map(Number);
    const inside = shape.contains(point(parts[0], parts[1]));
    lookupMap.set(item, inside);
  });
  return pairs.filter((pair) => lookupAllInside(pair, lookupMap));
}

function lookupAllInside(pair: Pair, lookupMap: Map<string, boolean>): unknown {
  return pair.rectangle.filter((points) => lookupMap.get(toKey(points))).length === pair.rectangle.length;
}

function toSet(pairs: Pair[]): Set<string> {
  const points = pairs.map((pair) => pair.rectangle).flatMap((rectangle) => rectangle.map((point) => point));
  const pointKeys = points.map((point) => toKey(point));
  return new Set(pointKeys);
}

function toKey(point: Point2D) {
  return `${point[0]},${point[1]}`;
}

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

/**
 * Also a bit slow, but actually works, takes < minute
 */
function part2(data: string[], offset: number) {
  const points = parsePoints(data);
  const ps = points.map((i) => point(i[0], i[1]));
  const shape = new Polygon(ps);
  const pairs = allPairs(points);
  const cornersInside = candidates(pairs, shape);
  const sorted = sortedPolygons(cornersInside);

  for (let i = sorted.length - offset; i--; i > 0) {
    if (sorted[i].poly.edges.size > 0 && shape.contains(sorted[i].poly)) {
      return sorted[i].area;
    }
  }
}

console.log("Day 9: Movie Theater");
console.log("---------");
console.log("Part 1");
console.log("Example: " + part1(example));
console.log("Input: " + part1(input));
console.log("Example: " + part2(example, 0));
console.log("Input: " + part2(input, 800));

// To high: 4650952673
// To high: 4598853740
