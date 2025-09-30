describe('GIVEN Ellipse', () => {
  describe('AND you adjust radiusX', () => {
    it('THEN it gives correct collision results', () => {
      const { System } = require('../../src')

      const check2d = new System()
      const ellipse = check2d.createEllipse({ x: 0, y: 0 }, 10, 30)

      check2d.createEllipse({ x: 25, y: 0 }, 10, 30)

      let collisions = 0

      check2d.checkAll(() => {
        collisions++
      })

      expect(collisions).toBe(0)

      ellipse.radiusX = 20

      check2d.checkAll(() => {
        collisions++
      })

      expect(collisions).toBe(0)

      check2d.insert(ellipse)
      check2d.checkAll(() => {
        collisions++
      })

      expect(collisions).toBe(2)
    })
  })

  describe('AND you adjust radiusY', () => {
    it('THEN it gives correct collision results', () => {
      const { System } = require('../../src')

      const check2d = new System()
      const ellipse = check2d.createEllipse({ x: 0, y: 0 }, 30, 10)

      check2d.createEllipse({ x: 0, y: 25 }, 30, 10)

      let collisions = 0

      check2d.checkAll(() => {
        collisions++
      })

      expect(collisions).toBe(0)

      ellipse.radiusY = 20

      check2d.checkAll(() => {
        collisions++
      })

      expect(collisions).toBe(0)

      check2d.insert(ellipse)
      check2d.checkAll(() => {
        collisions++
      })

      expect(collisions).toBe(2)
    })
  })

  describe('AND two ellipses perfectly overlap', () => {
    it('THEN they give correct collision results', () => {
      const { System } = require('../../src')

      const check2d = new System()
      const ellipse1 = check2d.createEllipse({ x: 0, y: 0 }, 10, 30)
      const ellipse2 = check2d.createEllipse({ x: 0, y: 0 }, 10, 30)

      expect(check2d.checkCollision(ellipse1, ellipse2)).toBeTruthy()
    })
  })

  describe('AND you set options', () => {
    it('THEN the parameters are set', () => {
      const { System } = require('../../src')
      const check2d = new System()
      const body = check2d.createEllipse({}, 10, 10, 1, {
        isStatic: true,
        isTrigger: true
      })

      expect(body.isStatic).toBe(true)
      expect(body.isTrigger).toBe(true)
    })
  })
})
