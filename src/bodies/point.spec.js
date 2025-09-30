describe('GIVEN Point', () => {
  it('THEN without constructor values, initializes with (0, 0)', () => {
    const { Point } = require('../../src')

    const point = new Point()

    expect(point.x).toBe(0)
    expect(point.y).toBe(0)
  })

  describe('AND you set options', () => {
    it('THEN the parameters are set', () => {
      const { System } = require('../../src')
      const check2d = new System()
      const body = check2d.createPoint(
        { x: 0, y: 0 },
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
