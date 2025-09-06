const {
  System,
  Box,
  Line,
  Circle,
  intersectLineLine,
  intersectLineCircle,
  intersectPolygonPolygon,
  circleOutsidePolygon,
  getWorldPoints
} = require('.')

describe('GIVEN Intersect Utils', () => {
  it('THEN intersectLineLine should work', () => {
    const line1 = new Line({ x: 0, y: 0 }, { x: 100, y: 100 })
    const line2 = new Line({ x: 100, y: 0 }, { x: 0, y: 100 })

    expect(intersectLineLine(line1, line2)).toStrictEqual({ x: 50, y: 50 })
  })

  it('THEN intersectLineCircle should work', () => {
    const line1 = new Line({ x: 0, y: 0 }, { x: 100, y: 100 })
    const circle1 = new Circle({ x: 50, y: 50 }, 10)

    expect(intersectLineCircle(line1, circle1).length).toBe(2)
  })

  it('THEN circleOutsidePolygon should work', () => {
    const check2d = new System()
    const box1 = new Box({ x: 115, y: 152 }, 100, 100)
    const circle1 = new Circle({ x: 100, y: 100 }, 50)
    check2d.insert(box1)
    check2d.insert(circle1)

    expect(circleOutsidePolygon(circle1, box1)).toBe(true)
  })

  it('THEN circle inside concave polygon have correct aInB, bInA', () => {
    const { System } = require('.')
    const check2d = new System()
    const concave = check2d.createPolygon(
      { x: 200, y: 100 },
      [
        { x: -11.25, y: -6.76 },
        { x: -12.5, y: -6.76 },
        { x: -12.5, y: 6.75 },
        { x: -3.1, y: 6.75 },
        { x: -3.1, y: 0.41 },
        { x: -2.35, y: 0.41 },
        { x: -2.35, y: 6.75 },
        { x: 0.77, y: 6.75 },
        { x: 0.77, y: 7.5 },
        { x: -13.25, y: 7.5 },
        { x: -13.25, y: -7.51 },
        { x: -11.25, y: -7.51 }
      ].map(({ x, y }) => ({ x: x * 10, y: y * 10 }))
    )
    const convex = check2d.createCircle({ x: 71.2, y: 37.5 }, 1)

    check2d.checkCollision(convex, concave)

    expect(check2d.response.aInB).toBe(true)
    expect(check2d.response.bInA).toBe(false)
  })

  it('THEN concave polygon inside circle have correct aInB, bInA', () => {
    const { System } = require('.')
    const check2d = new System()
    const convex = check2d.createCircle({ x: -5, y: 3.75 }, 40)
    const concave = check2d.createPolygon(
      { x: -5, y: 3.75 },
      [
        { x: -11.25, y: -6.76 },
        { x: -12.5, y: -6.76 },
        { x: -12.5, y: 6.75 },
        { x: -3.1, y: 6.75 },
        { x: -3.1, y: 0.41 },
        { x: -2.35, y: 0.41 },
        { x: -2.35, y: 6.75 },
        { x: 0.77, y: 6.75 },
        { x: 0.77, y: 7.5 },
        { x: -13.25, y: 7.5 },
        { x: -13.25, y: -7.51 },
        { x: -11.25, y: -7.51 }
      ].map(({ x, y }) => ({ x: x * 0.01, y: y * 0.01 }))
    )

    check2d.checkCollision(concave, convex)

    expect(check2d.response.aInB).toBe(true)
    expect(check2d.response.bInA).toBe(false)
  })

  it('THEN concave polygon inside concave polygon have correct aInB, bInA', () => {
    const { System } = require('.')
    const check2d = new System()
    const concave = check2d.createPolygon(
      { x: -200, y: -300 },
      [
        { x: 190, y: 147 },
        { x: 256, y: 265 },
        { x: 400, y: 274 },
        { x: 360, y: 395 },
        { x: 80, y: 350 }
      ].map(({ x, y }) => ({ x: x * 2, y: y * 2 }))
    )
    const concaveInside = check2d.createPolygon({ x: 0, y: 0 }, [
      { x: 190, y: 147 },
      { x: 256, y: 265 },
      { x: 400, y: 274 },
      { x: 360, y: 395 },
      { x: 80, y: 350 }
    ])

    check2d.checkCollision(concave, concaveInside)

    expect(check2d.response.aInB).toBe(false)
    expect(check2d.response.bInA).toBe(true)
  })

  it('THEN circle and line inside concave aInB works', () => {
    const { System } = require('.')
    const check2d = new System()

    const line = check2d.createLine(
      {
        x: 338.814694511791 + 152.89343950920775,
        y: 15.538920669710976 + 123.4220026097263
      },
      {
        x: 349.64532105529213 + 152.89343950920775,
        y: 12.880947397260442 + 123.4220026097263
      }
    )

    const points = [
      {
        x: 0.6130543326510463,
        y: 106.93230934551116
      },
      {
        x: 14.304601095190236,
        y: 108.97690417047312
      },
      {
        x: 26.565687748210426,
        y: 102.638660213091
      },
      {
        x: 37.19196284749458,
        y: 114.49731019787046
      },
      {
        x: 45.97907494882571,
        y: 110.40812054794652
      },
      {
        x: 57.21840438076086,
        y: 112.45271537290849
      },
      {
        x: 65.801165037875,
        y: 108.15906624048836
      },
      {
        x: 79.08400891198019,
        y: 107.75014727549596
      },
      {
        x: 86.64501234800932,
        y: 112.65717485540466
      },
      {
        x: 110.96283420983266,
        y: 100.59406538812902
      },
      {
        x: 124.04132663972084,
        y: 98.75393004566324
      },
      {
        x: 135.89371040430703,
        y: 96.70933522070128
      },
      {
        x: 148.76785138997823,
        y: 98.34501108067089
      },
      {
        x: 153.4679346069693,
        y: 101.20744383561764
      },
      {
        x: 171.24651025384853,
        y: 83.21500937595229
      },
      {
        x: 184.93805701638777,
        y: 88.9398748858458
      },
      {
        x: 191.2729517871149,
        y: 91.80230764079256
      },
      {
        x: 200.67311822109704,
        y: 83.01054989345607
      },
      {
        x: 211.2993933203811,
        y: 81.7837929984789
      },
      {
        x: 221.31261408701428,
        y: 86.07744213089904
      },
      {
        x: 231.32583485364745,
        y: 85.66852316590666
      },
      {
        x: 235.6172151822045,
        y: 87.09973954338002
      },
      {
        x: 246.6521931699227,
        y: 60.111087853882
      },
      {
        x: 257.6871711576408,
        y: 62.76906112633256
      },
      {
        x: 265.24817459367,
        y: 48.86581631659115
      },
      {
        x: 279.7571271330771,
        y: 39.665139604262265
      },
      {
        x: 291.6095108976633,
        y: 44.98108614916339
      },
      {
        x: 302.8488403295985,
        y: 43.14095080669762
      },
      {
        x: 313.6794668730996,
        y: 45.18554563165961
      },
      {
        x: 327.7797165240729,
        y: 0
      },
      {
        x: 339.83645173287607,
        y: 18.40135342465777
      },
      {
        x: 358.6367846008403,
        y: 17.58351549467298
      },
      {
        x: 370.28481692120954,
        y: 26.375273242009456
      },
      {
        x: 376.00665735928567,
        y: 29.033246514460014
      },
      {
        x: 385.81552668170184,
        y: 15.9478396347034
      },
      {
        x: 396.03309889255195,
        y: 25.352975829528447
      },
      {
        x: 379.4806319109747,
        y: 43.95878873668238
      },
      {
        x: 363.54121926204846,
        y: 38.642842191781256
      },
      {
        x: 355.57151293758534,
        y: 31.28230082191817
      },
      {
        x: 337.17988295805515,
        y: 32.30459823439918
      },
      {
        x: 330.64063674311103,
        y: 25.148516347032256
      },
      {
        x: 321.4448217533459,
        y: 59.29324992389718
      },
      {
        x: 306.7315177697217,
        y: 56.430817168950455
      },
      {
        x: 298.3531085568245,
        y: 54.999600791477064
      },
      {
        x: 289.3616450112763,
        y: 57.044195616439026
      },
      {
        x: 282.2093444636813,
        y: 53.772843896499865
      },
      {
        x: 274.8526924718691,
        y: 59.29324992389721
      },
      {
        x: 263.40901159571695,
        y: 78.10352231354733
      },
      {
        x: 254.8262509386028,
        y: 75.65000852359299
      },
      {
        x: 244.19997583931865,
        y: 99.57176797564804
      },
      {
        x: 231.93888918629844,
        y: 98.34501108067089
      },
      {
        x: 220.69955975436332,
        y: 100.59406538812904
      },
      {
        x: 212.72985342990015,
        y: 96.70933522070128
      },
      {
        x: 205.78190432652204,
        y: 97.11825418569369
      },
      {
        x: 193.31646622928488,
        y: 105.50109296803775
      },
      {
        x: 182.28148824156673,
        y: 102.4342007305948
      },
      {
        x: 175.1291876939716,
        y: 100.38960590563283
      },
      {
        x: 168.38559003481052,
        y: 111.63487744292372
      },
      {
        x: 153.26358316275227,
        y: 114.90622916286284
      },
      {
        x: 143.4547138403361,
        y: 112.45271537290849
      },
      {
        x: 134.258898850571,
        y: 112.65717485540466
      },
      {
        x: 123.83697519550388,
        y: 115.31514812785522
      },
      {
        x: 116.27597175947474,
        y: 115.31514812785522
      },
      {
        x: 84.80584935005626,
        y: 129.62731190258904
      },
      {
        x: 75.20133147185712,
        y: 123.4935274277031
      },
      {
        x: 67.43597659161102,
        y: 123.4935274277031
      },
      {
        x: 56.809701492326866,
        y: 126.96933863013844
      },
      {
        x: 49.24869805629774,
        y: 125.53812225266508
      },
      {
        x: 35.352799849541526,
        y: 127.58271707762704
      },
      {
        x: 26.361336303993397,
        y: 120.22217570776397
      },
      {
        x: 20.63949586591733,
        y: 124.92474380517648
      },
      {
        x: 0,
        y: 121.44893260274114
      }
    ]

    const area = check2d.createPolygon(
      { x: 144.71938174052755, y: 113.40348796741262 },
      points
    )

    const circle = check2d.createCircle({ x: 200, y: 232 }, 3)

    expect(check2d.checkCollision(line, area)).toBe(true)

    expect(check2d.response.aInB).toBe(true)
    expect(check2d.response.bInA).toBe(false)

    expect(check2d.checkCollision(circle, area)).toBe(true)

    expect(check2d.response.aInB).toBe(true)
    expect(check2d.response.bInA).toBe(false)

    expect(check2d.checkCollision(circle, line)).toBe(false)
  })

  describe('WHEN using intersectPolygonPolygon', () => {
    it('THEN it returns empty array when polygons do not touch', () => {
      const { System } = require('.')
      const check2d = new System()
      const square1 = check2d.createPolygon({}, [
        { x: 0, y: 0 },
        { x: 0, y: 10 },
        { x: 10, y: 10 },
        { x: 10, y: 0 }
      ])
      const square2 = check2d.createPolygon({}, [
        { x: 20, y: 20 },
        { x: 20, y: 30 },
        { x: 30, y: 30 },
        { x: 30, y: 20 }
      ])

      const result = intersectPolygonPolygon(square1, square2)

      expect(result).toStrictEqual([])
    })

    it('THEN it detects edge intersections between overlapping squares', () => {
      const { System } = require('.')
      const check2d = new System()
      const square1 = check2d.createPolygon({}, [
        { x: 0, y: 0 },
        { x: 0, y: 10 },
        { x: 10, y: 10 },
        { x: 10, y: 0 }
      ])
      const square2 = check2d.createPolygon({}, [
        { x: 5, y: 5 },
        { x: 5, y: 15 },
        { x: 15, y: 15 },
        { x: 15, y: 5 }
      ])

      const result = intersectPolygonPolygon(square1, square2)

      expect(result.length).toBeGreaterThan(0)
    })

    it('THEN it detects single corner touch', () => {
      const { System } = require('.')
      const check2d = new System()
      const square1 = check2d.createPolygon({}, [
        { x: 0, y: 0 },
        { x: 0, y: 10 },
        { x: 10, y: 10 },
        { x: 10, y: 0 }
      ])
      const square2 = check2d.createPolygon({}, [
        { x: 10, y: 10 },
        { x: 10, y: 20 },
        { x: 20, y: 20 },
        { x: 20, y: 10 }
      ])

      const result = intersectPolygonPolygon(square1, square2)

      expect(result).toStrictEqual([{ x: 10, y: 10 }])
    })
  })
})
