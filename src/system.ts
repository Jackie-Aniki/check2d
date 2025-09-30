import {
  BBox,
  Body,
  BodyGroup,
  CollisionCallback,
  RaycastHit,
  Response,
  SATVector,
  Vector
} from './model'
import {
  canInteract,
  checkAInB,
  distance,
  getSATTest,
  notIntersectAABB,
  pointsEqual,
  returnTrue
} from './utils'
import {
  ensureConvex,
  intersectCircleCircle,
  intersectLineCircle,
  intersectLineLine,
  intersectLinePolygon
} from './intersect'
import { forEach, some } from './optimized'

import { BaseSystem } from './base-system'
import { Line } from './bodies/line'

/**
 * collision system
 */
export class System<TBody extends Body = Body> extends BaseSystem<TBody> {
  /**
   * the last collision result
   */
  response: Response = new Response()

  /**
   * for raycasting
   */
  protected ray!: Line

  /**
   * re-insert body into collision tree and update its bbox
   * every body can be part of only one system
   */
  insert(body: TBody): this {
    const insertResult = super.insert(body)
    // set system for later body.check2d.updateBody(body)
    body.system = this

    return insertResult
  }

  /**
   * separate (move away) bodies
   */
  separate(
    callback: CollisionCallback = returnTrue,
    response = this.response
  ): void {
    forEach(this.all(), (body: TBody) => {
      this.separateBody(body, callback, response)
    })
  }

  /**
   * separate (move away) 1 body, with optional callback before collision
   */
  separateBody(
    body: TBody,
    callback: CollisionCallback = returnTrue,
    response = this.response
  ): void {
    if (body.isStatic && !body.isTrigger) {
      return
    }

    const offsets = { x: 0, y: 0 }
    const addOffsets = (collision: Response) => {
      // when is not trigger and callback returns true it continues
      if (callback(collision) && !body.isTrigger && !collision.b.isTrigger) {
        offsets.x += collision.overlapV.x
        offsets.y += collision.overlapV.y
      }
    }

    this.checkOne(body, addOffsets, response)

    if (offsets.x || offsets.y) {
      body.setPosition(body.x - offsets.x, body.y - offsets.y)
    }
  }

  /**
   * check one body collisions with callback
   */
  checkOne(
    body: TBody,
    callback: CollisionCallback = returnTrue,
    response = this.response
  ): boolean {
    // no need to check static body collision
    if (body.isStatic && !body.isTrigger) {
      return false
    }

    const bodies = this.search(body)
    const checkCollision = (candidate: TBody) => {
      if (
        candidate !== body &&
        this.checkCollision(body, candidate, response)
      ) {
        return callback(response)
      }
    }

    return some(bodies, checkCollision)
  }

  /**
   * check all bodies collisions in area with callback
   */
  checkArea(
    area: BBox,
    callback: CollisionCallback = returnTrue,
    response = this.response
  ): boolean {
    const checkOne = (body: TBody) => {
      return this.checkOne(body, callback, response)
    }

    return some(this.search(area), checkOne)
  }

  /**
   * check all bodies collisions with callback
   */
  checkAll(
    callback: CollisionCallback = returnTrue,
    response = this.response
  ): boolean {
    const checkOne = (body: TBody) => {
      return this.checkOne(body, callback, response)
    }

    return some(this.all(), checkOne)
  }

  /**
   * check do 2 objects collide
   */
  checkCollision(
    bodyA: TBody,
    bodyB: TBody,
    response = this.response
  ): boolean {
    const { bbox: bboxA, padding: paddingA } = bodyA
    const { bbox: bboxB, padding: paddingB } = bodyB
    // assess the bodies real aabb without padding
    /* tslint:disable-next-line:cyclomatic-complexity */
    if (
      !bboxA ||
      !bboxB ||
      !canInteract(bodyA, bodyB) ||
      ((paddingA || paddingB) && notIntersectAABB(bboxA, bboxB))
    ) {
      return false
    }

    const sat = getSATTest(bodyA, bodyB)

    // 99% of cases
    if (bodyA.isConvex && bodyB.isConvex) {
      // always first clear response
      response.clear()

      return sat(bodyA, bodyB, response)
    }

    // more complex (non convex) cases
    const convexBodiesA = ensureConvex(bodyA)
    const convexBodiesB = ensureConvex(bodyB)

    let overlapX = 0
    let overlapY = 0
    let collided = false

    forEach(convexBodiesA, (convexBodyA) => {
      forEach(convexBodiesB, (convexBodyB) => {
        // always first clear response
        response.clear()

        if (sat(convexBodyA, convexBodyB, response)) {
          collided = true
          overlapX += response.overlapV.x
          overlapY += response.overlapV.y
        }
      })
    })

    if (collided) {
      const vector = new SATVector(overlapX, overlapY)

      response.a = bodyA
      response.b = bodyB
      response.overlapV.x = overlapX
      response.overlapV.y = overlapY
      response.overlapN = vector.normalize()
      response.overlap = vector.len()
      response.aInB = checkAInB(bodyA, bodyB)
      response.bInA = checkAInB(bodyB, bodyA)
    }

    return collided
  }

  /**
   * raycast to get collider of ray from start to end
   */
  raycast(
    start: Vector,
    end: Vector,
    allow: (body: TBody, ray: TBody) => boolean = returnTrue
  ): RaycastHit<TBody> | undefined {
    let minDistance = Infinity
    let result: RaycastHit<TBody> | undefined

    if (!this.ray) {
      this.ray = new Line(start, end, { isTrigger: true })
    } else {
      this.ray.start = start
      this.ray.end = end
    }

    this.insert(this.ray as TBody)

    this.checkOne(this.ray as TBody, ({ b: body }) => {
      if (!allow(body, this.ray as TBody)) {
        return false
      }

      const points: Vector[] =
        body.typeGroup === BodyGroup.Circle
          ? intersectLineCircle(this.ray, body)
          : intersectLinePolygon(this.ray, body)

      forEach(points, (point: Vector) => {
        const pointDistance: number = distance(start, point)

        if (pointDistance < minDistance) {
          minDistance = pointDistance
          result = { point, body }
        }
      })
    })

    this.remove(this.ray as TBody)

    return result
  }

  /**
   * find collisions points between 2 bodies
   */
  getCollisionPoints(a: Body, b: Body): Vector[] {
    const collisionPoints: Vector[] = []

    if (a.typeGroup === BodyGroup.Circle && b.typeGroup === BodyGroup.Circle) {
      collisionPoints.push(...intersectCircleCircle(a, b))
    }

    if (a.typeGroup === BodyGroup.Circle && b.typeGroup !== BodyGroup.Circle) {
      for (let indexB = 0; indexB < b.calcPoints.length; indexB++) {
        const lineB = b.getEdge(indexB)

        collisionPoints.push(...intersectLineCircle(lineB, a))
      }
    }

    if (a.typeGroup !== BodyGroup.Circle) {
      for (let indexA = 0; indexA < a.calcPoints.length; indexA++) {
        const lineA = a.getEdge(indexA)

        if (b.typeGroup === BodyGroup.Circle) {
          collisionPoints.push(...intersectLineCircle(lineA, b))
        } else {
          for (let indexB = 0; indexB < b.calcPoints.length; indexB++) {
            const lineB = b.getEdge(indexB)
            const hit = intersectLineLine(lineA, lineB)

            if (hit) {
              collisionPoints.push(hit)
            }
          }
        }
      }
    }

    // unique
    return collisionPoints.filter(
      ({ x, y }, index) =>
        index ===
        collisionPoints.findIndex((collisionPoint) =>
          pointsEqual(collisionPoint, { x, y })
        )
    )
  }
}
