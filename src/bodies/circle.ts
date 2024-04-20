import { BBox } from "rbush";
import { Circle as SATCircle } from "sat";

import { BaseSystem } from "../base-system";
import {
  BodyOptions,
  BodyProps,
  BodyType,
  PotentialVector,
  SATVector,
  Vector,
} from "../model";
import { System } from "../system";
import { dashLineTo, drawBVH, ensureVectorPoint, extendBody } from "../utils";

/**
 * collider - circle
 */
export class Circle extends SATCircle implements BBox, BodyProps {
  /**
   * minimum x bound of body
   */
  minX!: number;

  /**
   * maximum x bound of body
   */
  maxX!: number;

  /**
   * minimum y bound of body
   */
  minY!: number;

  /**
   * maximum y bound of body
   */
  maxY!: number;

  /**
   * bounding box cache, without padding
   */
  bbox!: BBox;

  /**
   * offset
   */
  offset!: SATVector;

  /**
   * offset copy without angle applied
   */
  offsetCopy: Vector = { x: 0, y: 0 };

  /**
   * bodies are not reinserted during update if their bbox didnt move outside bbox + padding
   */
  padding!: number;

  /**
   * for compatibility reasons circle has angle
   */
  angle!: number;

  /**
   * static bodies don't move but they collide
   */
  isStatic!: boolean;

  /**
   * trigger bodies move but are like ghosts
   */
  isTrigger!: boolean;

  /**
   * reference to collision system
   */
  system?: BaseSystem;

  /**
   * was the polygon modified and needs update in the next checkCollision
   */
  dirty = false;

  /*
   * circles are convex
   */
  readonly isConvex = true;

  /**
   * circle type
   */
  readonly type: BodyType.Circle = BodyType.Circle;

  /**
   * always centered
   */
  readonly isCentered = true;

  /**
   * group for collision filtering
   */
  protected _group!: number;

  /**
   * saved initial radius - internal
   */
  protected readonly unscaledRadius: number;

  /**
   * collider - circle
   */
  constructor(
    position: PotentialVector,
    radius: number,
    options?: BodyOptions,
  ) {
    super(ensureVectorPoint(position), radius);

    extendBody(this, options);

    this.unscaledRadius = radius;
  }

  /**
   * get this.pos.x
   */
  get x(): number {
    return this.pos.x;
  }

  /**
   * updating this.pos.x by this.x = x updates AABB
   */
  set x(x: number) {
    this.pos.x = x;
    this.markAsDirty();
  }

  /**
   * get this.pos.y
   */
  get y(): number {
    return this.pos.y;
  }

  /**
   * updating this.pos.y by this.y = y updates AABB
   */
  set y(y: number) {
    this.pos.y = y;
    this.markAsDirty();
  }

  /**
   * allow get scale
   */
  get scale(): number {
    return this.r / this.unscaledRadius;
  }

  /**
   * shorthand for setScale()
   */
  set scale(scale: number) {
    this.setScale(scale);
  }

  /**
   * scaleX = scale in case of Circles
   */
  get scaleX(): number {
    return this.scale;
  }

  /**
   * scaleY = scale in case of Circles
   */
  get scaleY(): number {
    return this.scale;
  }

  /**
   * group for collision filtering
   */
  get group(): number {
    return this._group;
  }

  set group(group: number) {
    this._group = Math.max(0, Math.min(group, 0x7fffffff));
  }

  /**
   * update position
   */
  setPosition(x: number, y: number, update = true): Circle {
    this.pos.x = x;
    this.pos.y = y;
    this.markAsDirty(update);

    return this;
  }

  /**
   * update scale
   */
  setScale(scaleX: number, _scaleY = scaleX, update = true): Circle {
    this.r = this.unscaledRadius * Math.abs(scaleX);
    this.markAsDirty(update);

    return this;
  }

  /**
   * set rotation
   */
  setAngle(angle: number, update = true): Circle {
    this.angle = angle;

    const { x, y } = this.getOffsetWithAngle();
    this.offset.x = x;
    this.offset.y = y;
    this.markAsDirty(update);

    return this;
  }

  /**
   * set offset from center
   */
  setOffset(offset: Vector, update = true): Circle {
    this.offsetCopy.x = offset.x;
    this.offsetCopy.y = offset.y;

    const { x, y } = this.getOffsetWithAngle();
    this.offset.x = x;
    this.offset.y = y;
    this.markAsDirty(update);

    return this;
  }

  /**
   * get body bounding box, without padding
   */
  getAABBAsBBox(): BBox {
    const x = this.pos.x + this.offset.x;
    const y = this.pos.y + this.offset.y;

    return {
      minX: x - this.r,
      maxX: x + this.r,
      minY: y - this.r,
      maxY: y + this.r,
    };
  }

  /**
   * Draws collider on a CanvasRenderingContext2D's current path
   */
  draw(context: CanvasRenderingContext2D) {
    const x = this.pos.x + this.offset.x;
    const y = this.pos.y + this.offset.y;
    const r = Math.abs(this.r);

    if (this.isTrigger) {
      const max = Math.max(8, this.r);

      for (let i = 0; i < max; i++) {
        const arc = (i / max) * 2 * Math.PI;
        const arcPrev = ((i - 1) / max) * 2 * Math.PI;
        const fromX = x + Math.cos(arcPrev) * this.r;
        const fromY = y + Math.sin(arcPrev) * this.r;
        const toX = x + Math.cos(arc) * this.r;
        const toY = y + Math.sin(arc) * this.r;

        dashLineTo(context, fromX, fromY, toX, toY);
      }
    } else {
      context.moveTo(x + r, y);
      context.arc(x, y, r, 0, Math.PI * 2);
    }
  }

  /**
   * Draws Bounding Box on canvas context
   */
  drawBVH(context: CanvasRenderingContext2D) {
    drawBVH(context, this);
  }

  /**
   * inner function for after position change update aabb in system
   */
  updateBody(update = this.dirty): void {
    if (update) {
      this.system?.insert(this);
      this.dirty = false;
    }
  }

  /**
   * update instantly or mark as dirty
   */
  protected markAsDirty(update = false): void {
    if (update) {
      this.updateBody(true);
    } else {
      this.dirty = true;
    }
  }

  /**
   * internal for getting offset with applied angle
   */
  protected getOffsetWithAngle(): Vector {
    if ((!this.offsetCopy.x && !this.offsetCopy.y) || !this.angle) {
      return this.offsetCopy;
    }

    const sin = Math.sin(this.angle);
    const cos = Math.cos(this.angle);
    const x = this.offsetCopy.x * cos - this.offsetCopy.y * sin;
    const y = this.offsetCopy.x * sin + this.offsetCopy.y * cos;

    return { x, y };
  }
}
