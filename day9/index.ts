import { first, flatMap, forEach, range, reduce, reverse, slice, sortBy, take } from "lodash";
import { input } from "./input";
import { example } from "./example";

type Point2D = [number, number];

type Rectangle = Point2D[];

type Pair = {
  area: number;
  polygon: Rectangle;
};

function parseData(data: string[]): Point2D[] {
  return data.filter(Boolean).map((l) => l.split(",").map(Number) as Point2D);
}

function pointOnSegment(p: Point2D, a: Point2D, b: Point2D): boolean {
  const [px, py] = p;
  const [ax, ay] = a;
  const [bx, by] = b;

  // cross product must be zero (collinear)
  const cross = (px - ax) * (by - ay) - (py - ay) * (bx - ax);

  if (cross !== 0) return false;

  // dot product must be within segment bounds
  const dot = (px - ax) * (bx - ax) + (py - ay) * (by - ay);

  if (dot < 0) return false;

  const lenSq = (bx - ax) * (bx - ax) + (by - ay) * (by - ay);

  if (dot > lenSq) return false;

  return true;
}

function pointInPolygonInclusive(point: Point2D, polygon: Point2D[]): boolean {
  const [x, y] = point;
  let inside = false;

  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const pi = polygon[i];
    const pj = polygon[j];

    if (pointOnSegment(point, pi, pj)) {
      return true;
    }

    const [xi, yi] = pi;
    const [xj, yj] = pj;

    const intersect = yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;

    if (intersect) inside = !inside;
  }

  return inside;
}

function polygonCompletelyInside(outer: Point2D[], inner: Point2D[]): boolean {
  return inner.every((p) => pointInPolygonInclusive(p, outer));
}

function rectangleArea(p1: Point2D, p2: Point2D): number {
  const width = Math.abs(p2[0] - p1[0]) + 1;
  const height = Math.abs(p2[1] - p1[1]) + 1;
  return width * height;
}

function rectangleFromPoints(p1: Point2D, p2: Point2D): Rectangle {
  const minX = Math.min(p1[0], p2[0]);
  const maxX = Math.max(p1[0], p2[0]);
  const minY = Math.min(p1[1], p2[1]);
  const maxY = Math.max(p1[1], p2[1]);
  return [
    [minX, minY],
    [maxX, minY],
    [maxX, maxY],
    [minX, maxY],
  ];
}

function allPairs(points: Point2D[]): Pair[] {
  return flatMap(points, (box1, index) =>
    slice(points, index + 1).map((box2, j) => {
      const polygon = rectangleFromPoints(box1, box2);
      return {
        area: rectangleArea(box1, box2),
        polygon,
      };
    })
  );
}

function expandBoundary(points: Point2D[]): Point2D[] {
  const boundary: Point2D[] = [];

  for (let i = 0; i < points.length; i++) {
    const [x1, y1] = points[i];
    const [x2, y2] = points[(i + 1) % points.length];

    const dx = Math.sign(x2 - x1);
    const dy = Math.sign(y2 - y1);

    let x = x1;
    let y = y1;

    boundary.push([x, y]);

    while (x !== x2 || y !== y2) {
      x += dx;
      y += dy;
      boundary.push([x, y]);
    }
  }

  return boundary;
}

function part1(data: string[]) {
  const points = parseData(data);
  const sorted = sortBy(allPairs(points), "area");
  const pairs = reverse(sorted);
  return first(pairs)?.area;
}

function rectTestPoints(rect: Rectangle): Point2D[] {
  const [a, b, c, d] = rect; // [minX,minY], [maxX,minY], [maxX,maxY], [minX,maxY]
  const minX = a[0],
    minY = a[1];
  const maxX = c[0],
    maxY = c[1];

  const midX = (minX + maxX) / 2;
  const midY = (minY + maxY) / 2;

  return [
    // corners
    a,
    b,
    c,
    d,
    // edge midpoints
    [midX, minY],
    [maxX, midY],
    [midX, maxY],
    [minX, midY],
    // center
    [midX, midY],
  ];
}

function rectangleCompletelyInsideInclusive(outer: Point2D[], rect: Rectangle): boolean {
  return rectTestPoints(rect).every((p) => pointInPolygonInclusive(p, outer));
}

function part2(data: string[]) {
  const points = parseData(data);

  const boundary = expandBoundary(points);

  const pairs = allPairs(points);

  const inside = pairs.filter((pair) => {
    return rectangleCompletelyInsideInclusive(points, pair.polygon);
  });

  return first(reverse(sortBy(inside, "area")))?.area;
}

console.log("Day 9: Movie Theater");
console.log("---------");
console.log("Part 1");
console.log("Example: " + part1(example));
console.log("Input: " + part1(input));
console.log("Example: " + part2(example));
console.log("Input: " + part2(input));

// To high: 4650952673
// To high: 4598853740
