import { expect, test, describe } from 'bun:test'
import { calcBet, round, type Label } from './calcBet'

describe('round()', () => {
  test('rounds to specified decimal places', () => {
    expect(round(3.14159265, 2)).toBe(3.14)
    expect(round(3.14159265, 4)).toBe(3.1416)
    expect(round(3.14159265, 0)).toBe(3)
  })

  test('handles negative numbers', () => {
    expect(round(-3.14159265, 2)).toBe(-3.14)
  })

  test('handles zero', () => {
    expect(round(0, 2)).toBe(0)
  })
})

describe('calcBet()', () => {
  test('null for invalid inputs', () => {
    expect(calcBet(0, 50)).toBeNull()
    expect(calcBet(50, 0)).toBeNull()
    expect(calcBet(NaN, 50)).toBeNull()
    expect(calcBet(50, NaN)).toBeNull()
    expect(calcBet(0, 0)).toBeNull()
  })

  type Odds = [number, number]
  type Expected = {
    left: [Label, number]
    right: [Label, number]
    midpoint?: number
    opposite?: number
    normalized?: number
  }
  const validInputTestCases: [Odds, Expected][] = [
    [
      [60, 40], // odds1 > odds2
      {
        left: ['YES', 1],
        right: ['NO', 1],
        midpoint: 50,
        opposite: 50,
        normalized: 1,
      },
    ],
    [[40, 60], { left: ['NO', 1], right: ['YES', 1], midpoint: 50 }],
    [[50, 50], { left: ['NO', 1], right: ['YES', 1], midpoint: 50 }],
    [[75, 25], { left: ['YES', 1], right: ['NO', 1], midpoint: 50 }],
    [[99, 1], { left: ['YES', 1], right: ['NO', 1], midpoint: 50 }],
    [[70, 20], { left: ['YES', 1], right: ['NO', 1.22], midpoint: 45 }],
    [[20, 70], { left: ['NO', 1.22], right: ['YES', 1] }],
  ]

  validInputTestCases.forEach(([[odds1, odds2], expected]) => {
    test(`${odds1} vs ${odds2}`, () => {
      const result = calcBet(odds1, odds2)
      expect(result).not.toBeNull()
      if (!result) throw new Error('Result should not be null')

      expect(result.leftLabel).toBe(expected.left[0])
      expect(result.rightLabel).toBe(expected.right[0])
      expect(round(result.leftAmount, 2)).toBe(expected.left[1])
      expect(round(result.rightAmount, 2)).toBe(expected.right[1])
      if (expected.midpoint) expect(result.midpoint).toBe(expected.midpoint)
      if (expected.opposite) expect(result.opposite).toBe(expected.opposite)
      if (expected.normalized)
        expect(result.normalized).toBe(expected.normalized)
    })
  })
})
