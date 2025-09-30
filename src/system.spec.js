const expectToBeNear = (value, check, tolerance = 1) => {
  expect(value).toBeGreaterThan(check - tolerance)
  expect(value).toBeLessThan(check + tolerance)
}

describe('GIVEN System', () => {
  it('THEN separateBody works with 2 colliders at the same time', () => {
    const { System } = require('.')
    const check2d = new System()
    const testBox = check2d.createBox({ x: -5, y: -5 }, 25, 25, {
      isCentered: true
    })
    const lineBottom = check2d.createLine(
      { x: 0, y: 0 },
      { x: 100, y: 0 },
      { isStatic: true }
    )
    const lineDiagonal = check2d.createLine(
      { x: 0, y: 0 },
      { x: 50, y: 50 },
      { isStatic: true }
    )

    lineBottom.isWall = true
    lineDiagonal.isWall = true
    testBox.isPlayer = true

    // <-- the test
    check2d.separate()

    // <-- works
    check2d.checkAll(({ a, b }) => {
      // <-- doesn't collide or run this code
      expect(true).toBe(false)
    })
  })

  it('THEN you can change position within tree', () => {
    const { System } = require('.')

    const check2d = new System()
    const circle = check2d.createCircle({ x: 0, y: 0 }, 10)

    expect(circle.x).toBe(0)
    expect(circle.y).toBe(0)

    expect(circle.system).toBe(check2d)

    circle.setPosition(1, -1)

    expect(circle.pos.x).toBe(1)
    expect(circle.pos.y).toBe(-1)
  })

  it('THEN update() un-dirties the bodies', () => {
    const { System } = require('../src')

    const check2d = new System()
    const poly = check2d.createPolygon({ x: -100, y: -100 }, [
      { x: 0, y: 0 },
      { x: 10, y: 0 },
      { x: 10, y: 10 },
      { x: 0, y: 10 }
    ])

    poly.setPosition(poly.x + 100, poly.y + 100, false)
    expect(poly.dirty).toBe(true)
    check2d.update()
    expect(poly.dirty).toBe(false)
  })

  it('THEN checkArea() works', () => {
    const { System } = require('../src')

    const check2d = new System()

    const a = check2d.createBox({ x: 10, y: 10 }, 100, 100)
    const b = check2d.createBox({ x: 300, y: 300 }, 100, 100)

    let collisions = 0

    check2d.checkArea({ minX: 0, minY: 0, maxX: 100, maxY: 100 }, () => {
      collisions++
    })

    expect(collisions).toBe(0)

    b.setPosition(50, 50)

    check2d.checkArea({ minX: 0, minY: 0, maxX: 100, maxY: 100 }, () => {
      collisions++
    })

    expect(collisions).toBe(2)
  })

  it("THEN bodies with non-intersecting bbox don't check collisions", () => {
    const { System } = require('../src')

    const check2d = new System()

    const a = check2d.createBox({ x: 10, y: 10 }, 100, 100)
    const b = check2d.createBox({ x: 300, y: 300 }, 100, 100)

    const didCollide = check2d.checkCollision(a, b)

    expect(didCollide).toBe(false)
  })

  describe('WHEN raycast is called', () => {
    it('THEN works correctly on Ellipse', () => {
      const { System } = require('.')
      const check2d = new System()

      check2d.createEllipse({ x: 100, y: 100 }, 30)

      const hit = check2d.raycast({ x: 0, y: 0 }, { x: 100, y: 100 })

      expectToBeNear(hit.point.x, 70, 10)
      expectToBeNear(hit.point.y, 70, 10)
    })

    it('THEN works correctly on Box', () => {
      const { System } = require('.')
      const check2d = new System()

      const box = check2d.createBox({ x: 50, y: 50 }, 100, 100)
      const hit = check2d.raycast({ x: 0, y: 0 }, { x: 100, y: 100 })

      expect(hit.point.x).toBe(50)
      expect(hit.point.y).toBe(50)
    })

    it('THEN works correctly on Polygon', () => {
      const { System } = require('.')
      const check2d = new System()

      check2d.createPolygon({ x: 50, y: 50 }, [
        { x: 50, y: 50 },
        { x: 150, y: 50 },
        { x: 150, y: 150 },
        { x: 50, y: 150 }
      ])

      const hit = check2d.raycast({ x: 0, y: 0 }, { x: 100, y: 100 })

      expect(hit.point.x).toBe(100)
      expect(hit.point.y).toBe(100)
    })

    it('THEN works correctly on Line', () => {
      const { System } = require('.')
      const check2d = new System()

      check2d.createLine({ x: 100, y: 0 }, { x: 0, y: 100 })

      const hit = check2d.raycast({ x: 0, y: 0 }, { x: 100, y: 100 })

      expect(hit.point.x).toBe(50)
      expect(hit.point.y).toBe(50)
    })

    it('THEN works correctly on Point', () => {
      const { System } = require('.')
      const check2d = new System()

      check2d.createPoint({ x: 50, y: 50 })

      const hit = check2d.raycast({ x: 0, y: 0 }, { x: 100, y: 100 })

      expect(hit.point.x).toBe(50)
      expect(hit.point.y).toBe(50)
    })

    it('THEN works correctly on Circle', () => {
      const { System } = require('.')
      const check2d = new System()

      check2d.createCircle({ x: 100, y: 100 }, 30)

      const hit = check2d.raycast({ x: 0, y: 0 }, { x: 100, y: 100 })

      expectToBeNear(hit.point.x, 70, 10)
      expectToBeNear(hit.point.y, 70, 10)
    })
  })

  it('THEN I can provide custom class to body create functions', () => {
    const { System, Polygon } = require('.')
    const check2d = new System()

    class MyPolygon extends Polygon {
      constructor(position, points, options) {
        super(position, points, options)
        this.foo = 'bar'
      }
    }

    // create minimal MyPolygon and insert to system
    const myPolygon = check2d.createPolygon({}, [{}], {}, MyPolygon)

    expect(myPolygon.foo).toBe('bar')
  })

  it('THEN getCollisionPoints(Circle, Circle) works', () => {
    const { System } = require('.')
    const check2d = new System()

    const a = check2d.createCircle({ x: 10, y: 10 }, 10)
    const b = check2d.createCircle({ x: 30, y: 10 }, 10)

    expect(check2d.getCollisionPoints(a, b)).toStrictEqual([{ x: 20, y: 10 }])
  })

  it('THEN getCollisionPoints(Circle, Box) works', () => {
    const { System } = require('.')
    const check2d = new System()

    const a = check2d.createCircle({ x: 10, y: 10 }, 10)
    const b = check2d.createBox({ x: 20, y: 0 }, 20, 20)

    expect(check2d.getCollisionPoints(a, b)).toStrictEqual([{ x: 20, y: 10 }])
  })

  it('THEN getCollisionPoints(Box, Circle) works', () => {
    const { System } = require('.')
    const check2d = new System()

    const a = check2d.createBox({ x: 20, y: 0 }, 20, 20)
    const b = check2d.createCircle({ x: 10, y: 10 }, 10)

    expect(check2d.getCollisionPoints(a, b)).toStrictEqual([{ x: 20, y: 10 }])
  })
})
