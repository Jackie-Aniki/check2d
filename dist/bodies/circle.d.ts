import { BBox } from "rbush";
import { Circle as SATCircle } from "sat";
import { BodyOptions, Collider, PotentialVector, SATVector, Types, Vector } from "../model";
import { System } from "../system";
/**
 * collider - circle
 */
export declare class Circle extends SATCircle implements BBox, Collider {
    /**
     * bbox parameters
     */
    minX: number;
    maxX: number;
    minY: number;
    maxY: number;
    /**
     * bounding box cache, without padding
     */
    bbox: BBox;
    /**
     * offset
     */
    offset: SATVector;
    /**
     * offset copy without angle applied
     */
    offsetCopy: Vector;
    /**
     * bodies are not reinserted during update if their bbox didnt move outside bbox + padding
     */
    padding: number;
    /**
     * for compatibility reasons circle has angle
     */
    angle: number;
    isConvex: boolean;
    /**
     * circles are centered
     */
    isCentered: boolean;
    /**
     * static bodies don't move but they collide
     */
    isStatic?: boolean;
    /**
     * trigger bodies move but are like ghosts
     */
    isTrigger?: boolean;
    /**
     * reference to collision system
     */
    system?: System;
    /**
     * circle type
     */
    readonly type: Types.Circle;
    /**
     * saved initial radius - internal
     */
    protected readonly radiusBackup: number;
    /**
     * collider - circle
     */
    constructor(position: PotentialVector, radius: number, options?: BodyOptions);
    /**
     * get this.pos.x
     */
    get x(): number;
    /**
     * updating this.pos.x by this.x = x updates AABB
     */
    set x(x: number);
    /**
     * get this.pos.y
     */
    get y(): number;
    /**
     * updating this.pos.y by this.y = y updates AABB
     */
    set y(y: number);
    /**
     * allow get scale
     */
    get scale(): number;
    /**
     * shorthand for setScale()
     */
    set scale(scale: number);
    /**
     * scaleX = scale in case of Circles
     */
    get scaleX(): number;
    /**
     * scaleY = scale in case of Circles
     */
    get scaleY(): number;
    /**
     * update position
     */
    setPosition(x: number, y: number): void;
    /**
     * update scale
     */
    setScale(scale: number, _ignoredParameter?: number): void;
    /**
     * get body bounding box, without padding
     */
    getAABBAsBBox(): BBox;
    /**
     * Draws collider on a CanvasRenderingContext2D's current path
     */
    draw(context: CanvasRenderingContext2D): void;
    /**
     * set rotation
     */
    setAngle(angle: number): Circle;
    /**
     * set offset from center
     */
    setOffset(offset: Vector): Circle;
    /**
     * for compatility reasons, does nothing
     */
    center(): void;
    /**
     * internal for getting offset with applied angle
     */
    protected getOffsetWithAngle(): Vector;
}
//# sourceMappingURL=circle.d.ts.map