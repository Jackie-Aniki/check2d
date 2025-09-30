describe('GIVEN Line', () => {
  it('THEN without constructor values it throws', () => {
    const { Line } = require('../../src')

    const case1 = () => new Line({})

    expect(case1).toThrow()
  })

  it('THEN two lines collide', () => {
    const { System, Line } = require('../../src')

    const check2d = new System()
    const line1 = new Line({ x: -10, y: -10 }, { x: 10, y: 10 })
    const line2 = new Line({ x: 10, y: -10 }, { x: -10, y: 10 })

    check2d.insert(line1)
    check2d.insert(line2)

    let results = 0

    check2d.checkAll(() => {
      results++
    })

    expect(results).toBeGreaterThan(0)
  })

  it('THEN you can set and get start and end', () => {
    const { System } = require('../../src')
    const check2d = new System()

    const start = { x: 13, y: 13 }
    const end = { x: 69, y: 69 }
    const line = check2d.createLine(start, end)

    expect(line.start).toStrictEqual(start)
    expect(line.end).toStrictEqual(end)

    line.start = { x: 10, y: 10 }
    expect(line.start).toStrictEqual({ x: 10, y: 10 })

    line.end = { x: 99, y: 99 }
    expect(line.end).toStrictEqual({ x: 99, y: 99 })
  })

  describe('AND you set options', () => {
    it('THEN the parameters are set', () => {
      const { System } = require('../../src')
      const check2d = new System()
      const body = check2d.createLine(
        { x: 0, y: 0 },
        { x: 10, y: 0 },
        {
          isStatic: true,
          isTrigger: true
        }
      )

      expect(body.isStatic).toBe(true)
      expect(body.isTrigger).toBe(true)
    })
  })
})
