describe('GIVEN Box', () => {
  it('THEN changing width works correctly', () => {
    const { System } = require('../../src')

    const check2d = new System()
    const box = check2d.createBox({}, 90, 100)

    check2d.createBox({ x: 100 }, 90, 100)

    let results = 0

    check2d.checkAll(() => {
      results++
    })

    expect(results).toBe(0)

    box.width = 110

    check2d.insert(box)
    check2d.checkAll(() => {
      results++
    })

    expect(results).toBeGreaterThan(0)
  })

  it('THEN changing height works correctly', () => {
    const { System } = require('../../src')

    const check2d = new System()
    const box = check2d.createBox({}, 100, 90)

    check2d.createBox({ y: 100 }, 100, 90)

    let results = 0

    check2d.checkAll(() => {
      results++
    })

    expect(results).toBe(0)

    box.height = 110

    check2d.insert(box)
    check2d.checkAll(() => {
      results++
    })

    expect(results).toBeGreaterThan(0)
  })

  it('THEN getPotentials works with Box with angle', () => {
    const { System, Circle, Box } = require('../../src')

    const check2d = new System()
    const circle = new Circle({ x: 100, y: 100 }, 100)
    check2d.insert(circle)

    const pos = { x: 400, y: 100 }
    const circle2 = new Circle(pos, 50)
    check2d.insert(circle2)

    const box = new Box({ x: 400, y: 300 }, 200, 100)
    box.setOffset({ x: 0, y: -50 })
    box.setAngle(5)
    check2d.insert(box)

    let case1works = false
    let case2works = false

    if (check2d.checkCollision(circle2, box)) {
      case1works = true
    }

    expect(case1works).toBeTruthy()

    check2d.getPotentials(circle2).forEach((collider) => {
      if (check2d.checkCollision(circle2, collider)) {
        case2works = true
      }
    })

    expect(case2works).toBeTruthy()
  })

  it('THEN center() works correctly', () => {
    const { Box } = require('../../src')

    const x = Math.PI
    const y = Math.PI
    const box = new Box({ x, y }, 100, 100)

    box.isCentered = true

    expect(box.points[0].x).toBe(-box.width / 2)
    expect(box.points[0].y).toBe(-box.height / 2)
    expect(box.x).toBe(x)
    expect(box.y).toBe(y)
  })

  it('THEN without inserting to system, gives 0 collision results', () => {
    const { Box, System } = require('../../src')

    // initialize a collision detection system
    const check2d = new System()

    // bounds
    const box = new Box({ x: 0, y: 0 }, 1024, 768)
    const bbox = box.getAABBAsBBox()

    // out of bound
    check2d.createCircle({ x: -20, y: -20 }, 10)

    // 3 bodies in bounds
    check2d.createCircle({ x: 10, y: 10 }, 10)
    check2d.createCircle({ x: 30, y: 30 }, 10)
    check2d.createEllipse({ x: 10, y: 60 }, 20, 10)

    // bbox is even without inserting to system
    const potentials = check2d.getPotentials(bbox)

    // the list of bodies colliding
    const collisions = potentials.filter((body) =>
      check2d.checkCollision(box, body)
    )

    expect(collisions.length).toBe(0)
  })

  it('THEN change width & height works with isCentered & zero angle', () => {
    const { System, Box } = require('../../src')

    const box = new Box({ x: 5, y: 5 }, 10, 10, { isCentered: true })
    box.width = 20
    box.height = 20

    const check2d = new System()
    check2d.insert(box)

    expect(box.bbox.maxX - box.bbox.minX).toBe(box.width)
    expect(box.bbox.maxY - box.bbox.minY).toBe(box.height)
  })

  it('THEN change width & height works with isCentered & nonzero angle', () => {
    const { System, Box, deg2rad } = require('../../src')

    const box = new Box({ x: 5, y: 5 }, 10, 10, {
      isCentered: true,
      angle: deg2rad(90)
    })
    box.width = 20
    box.height = 20

    const check2d = new System()
    check2d.insert(box)

    expect(box.bbox.maxX - box.bbox.minX).toBe(box.width)
    expect(box.bbox.maxY - box.bbox.minY).toBe(box.height)
  })
})
