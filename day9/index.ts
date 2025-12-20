import { first, flatMap, forEach, range, reduce, reverse, slice, sortBy, tail, take } from "lodash";
import { input } from "./input";
import { example } from "./example";
import { point, Polygon } from "@flatten-js/core";

type Point2D = [number, number];

type Rectangle = Point2D[];

type Pair = {
  area: number;
  rectangle: Rectangle;
};

function toSet(pairs: Pair[]): Set<string> {
  const rs = pairs.map((p) => {
    return p.rectangle;
  });

  const dd = rs.flatMap((r) => r.map((d) => d));
  const ask = dd.map((aa) => toKey(aa));
  return new Set(ask);
}

function toKey(aa: Point2D): any {
  return `${aa[0]},${aa[1]}`;
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
function part2(data: string[]) {
  const points = parsePoints(data);

  const ps = points.map((i) => point(i[0], i[1]));
  const shape = new Polygon(ps);

  const pairs = allPairs(points);

  const asSet = toSet(pairs);

  const s = new Map<string, boolean>();

  asSet.forEach((i) => {
    const parts = i.split(",").map(Number);

    const dd = point(parts[0], parts[1]);

    const inside = shape.contains(dd);

    s.set(i, inside);
  });

  const isin = pairs.filter((p) => {
    const cords = p.rectangle;

    const ins = cords.filter((c) => {
      const k = toKey(c);
      return s.get(k) === true;
    });

    return ins.length === 4;
  });

  const parts = isin.map((item) => {
    return { poly: new Polygon([...item.rectangle]), area: item.area };
  });

  const sorted = sortBy(parts, "area");

  for (let i = sorted.length; i--; i > 0) {
    if (i % 50 == 0) {
      console.log(i);
    }

    if (sorted[i].poly.edges.size > 0 && shape.contains(sorted[i].poly)) {
      return sorted[i].area;
    }
  }
}

console.log("Day 9: Movie Theater");
console.log("---------");
console.log("Part 1");
// console.log("Example: " + part1(example));
// console.log("Input: " + part1(input));
console.log("Example: " + part2(example));
console.log("Input: " + part2(input));

// To high: 4650952673
// To high: 4598853740
