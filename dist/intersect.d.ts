import { Body, CircleLike, LineLike, PolygonLike, SATPolygon, Vector } from './model';
import { type Circle } from './bodies/circle';
import { type Point } from './bodies/point';
import { type Polygon } from './bodies/polygon';
/**
 * replace body with array of related convex polygons
 */
export declare function ensureConvex<TBody extends Body = Circle | Point | Polygon>(body: TBody): (TBody | SATPolygon)[];
/**
 * @param polygon
 * @param circle
 */
export declare function polygonInCircle(polygon: Polygon, circle: CircleLike): boolean;
export declare function pointInPolygon(point: Vector, polygon: Polygon): boolean;
export declare function polygonInPolygon(polygonA: Polygon, polygonB: Polygon): boolean;
/**
 * https://stackoverflow.com/a/68197894/1749528
 *
 * @param point
 * @param circle
 */
export declare function pointOnCircle(point: Vector, circle: CircleLike): boolean;
/**
 * https://stackoverflow.com/a/68197894/1749528
 *
 * @param circle1
 * @param circle2
 */
export declare function circleInCircle(circle1: CircleLike, circle2: CircleLike): boolean;
/**
 * https://stackoverflow.com/a/68197894/1749528
 *
 * @param circle
 * @param polygon
 */
export declare function circleInPolygon(circle: CircleLike, polygon: Polygon): boolean;
/**
 * https://stackoverflow.com/a/68197894/1749528
 *
 * @param circle
 * @param polygon
 */
export declare function circleOutsidePolygon(circle: CircleLike, polygon: Polygon): boolean;
/**
 * https://stackoverflow.com/a/37225895/1749528
 *
 * @param line
 * @param circle
 */
export declare function intersectLineCircle(line: LineLike, { pos, r }: CircleLike): Vector[];
/**
 * faster implementation of intersectLineLine
 * https://stackoverflow.com/a/16725715/1749528
 *
 * @param line1
 * @param line2
 */
export declare function intersectLineLineFast(line1: LineLike, line2: LineLike): boolean;
/**
 * returns the point of intersection
 * https://stackoverflow.com/a/24392281/1749528
 *
 * @param line1
 * @param line2
 */
export declare function intersectLineLine(line1: LineLike, line2: LineLike): Vector | undefined;
/**
 * Computes all intersection points between two polygons.
 *
 * Iterates over each edge of `polygonA` and checks against `polygonB`
 * using {@link intersectLinePolygon}.
 * Removes duplicates.
 * Also detects corner–corner touches.
 *
 * @param {PolygonLike} polygonA - First polygon
 * @param {PolygonLike} polygonB - Second polygon
 * @returns {Vector[]} Array of intersection points (empty if none found)
 */
export declare function intersectPolygonPolygon(polygonA: PolygonLike, polygonB: PolygonLike): Vector[];
/**
 * Computes all intersection points between a line segment and a polygon.
 *
 * @param {LineLike} line - The line segment
 * @param {PolygonLike} polygon - A polygon object or array of global points
 * @returns {Vector[]} Array of intersection points (empty if none)
 */
export declare function intersectLinePolygon(line: LineLike, polygon: PolygonLike): Vector[];
/**
 * @param circle1
 * @param circle2
 */
export declare function intersectCircleCircle(circle1: Circle, circle2: Circle): Vector[];
