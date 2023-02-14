import { BBox, default as RBush } from "rbush";
import {
  Response,
  Vector as SATVector,
  Polygon as SATPolygon,
  Circle as SATCircle,
} from "sat";

import { Box } from "./bodies/box";
import { Circle } from "./bodies/circle";
import { Ellipse } from "./bodies/ellipse";
import { Line } from "./bodies/line";
import { Point } from "./bodies/point";
import { Polygon } from "./bodies/polygon";
import { System } from "./system";

export { Polygon as DecompPolygon, Point as DecompPoint } from "poly-decomp";
export { RBush, BBox, Response, SATVector, SATPolygon, SATCircle };

/**
 * types
 */
export enum Types {
  Ellipse = "Ellipse",
  Line = "Line",
  Circle = "Circle",
  Box = "Box",
  Point = "Point",
  Polygon = "Polygon",
}

export type Leaf = Body & {
  children?: Leaf[];
};

export interface ChildrenData {
  children: Leaf[];
}

/**
 * for use of private function of sat.js
 */
export interface Data {
  data: ChildrenData;
}

export interface BodyOptions {
  isStatic?: boolean;
  isTrigger?: boolean;
  center?: boolean;
  angle?: number;
  padding?: number;
}

/**
 * system.raycast(from, to) result
 */
export type RaycastResult = { point: Vector; collider: Body } | null;

/**
 * potential vector
 */
export interface PotentialVector {
  x?: number;
  y?: number;
}

/**
 * x, y vector
 */
export interface Vector extends PotentialVector {
  x: number;
  y: number;
}

/**
 * for use of private function of sat.js
 */
export interface GetAABBAsBox {
  getAABBAsBox(): { pos: Vector; w: number; h: number };
}

/**
 * generic body union type
 */
export type Body = Point | Line | Ellipse | Circle | Box | Polygon;

/**
 * each body contains those regardless of type
 */
export interface Collider {
  /**
   * type of collider
   */
  readonly type: Types;

  /**
   * is the collider non moving
   */
  isStatic?: boolean;

  /**
   * is the collider a "trigger"
   */
  isTrigger?: boolean;

  /**
   * flag to show is it centered
   */
  isCentered?: boolean;

  /**
   * flag to show is it a convex body or non convex polygon
   */
  isConvex: boolean;

  /**
   * BHV padding (defaults to 0)
   */
  padding: number;

  /**
   * bounding box cache, without padding
   */
  bbox: BBox;

  /**
   * each body may have offset from center
   */
  offset: SATVector;

  /**
   * body angle
   */
  angle: number;

  /**
   * collisions system reference
   */
  system?: System;

  /**
   * scale getter (x)
   */
  get scaleX(): number;

  /**
   * scale getter (y = x for Circle)
   */
  get scaleY(): number;

  /**
   * update position
   */
  setPosition(x: number, y: number): void;

  /**
   * for setting scale
   */
  setScale(x: number, y?: number): void;

  /**
   * for setting angle
   */
  setAngle(angle: number): Circle | SATPolygon;

  /**
   * for setting offset from center
   */
  setOffset(offset: Vector): Circle | SATPolygon;

  /**
   * draw the collider
   */
  draw(context: CanvasRenderingContext2D): void;

  /**
   * center the body anchor
   */
  center(): void;

  /**
   * return bounding box without padding
   */
  getAABBAsBBox(): BBox;
}

export interface CollisionState {
  collides: boolean;
  aInB: boolean;
  bInA: boolean;
  overlapV: SATVector;
}

export type TestFunction<
  T extends {} = SATCircle | SATPolygon,
  Y extends {} = SATCircle | SATPolygon
> = (a: T, b: Y, r: Response) => boolean;
