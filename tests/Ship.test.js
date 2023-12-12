import { Ship } from '../src/Ship'

describe('Ship Factory', () => {
  let ship
  let hitSpy
  let isSunkSpy
  let getLengthSpy
  let getHitsSpy

  beforeEach(() => {
    ship = Ship(3)
    hitSpy = jest.spyOn(ship, 'hit')
    isSunkSpy = jest.spyOn(ship, 'isSunk')
    getLengthSpy = jest.spyOn(ship, 'getLength')
    getHitsSpy = jest.spyOn(ship, 'getHits')
  })

  afterEach(() => {
    hitSpy.mockClear()
    isSunkSpy.mockClear()
    getLengthSpy.mockClear()
    getHitsSpy.mockClear()
  })

  test('getLength() should return the correct length', () => {
    expect(ship.getLength()).toBe(3)
    expect(getLengthSpy).toHaveBeenCalled()
  })

  test('getHits() should return the correct number of hits', () => {
    expect(ship.getHits()).toBe(0)
    expect(getHitsSpy).toHaveBeenCalled()
  })

  test('hit() should increment the number of hits', () => {
    ship.hit()
    expect(hitSpy).toHaveBeenCalled()
  })

  test('isSunk() should return false when hits are less than the ship length', () => {
    expect(ship.isSunk()).toBe(false)
    expect(isSunkSpy).toHaveBeenCalled()
  })

  test('isSunk() should return true when hits are equal to the ship length', () => {
    ship.hit()
    ship.hit()
    ship.hit()
    expect(hitSpy).toHaveBeenCalledTimes(3)

    expect(ship.isSunk()).toBe(true)
    expect(isSunkSpy).toHaveBeenCalled()
  })

  test('isSunk() should return true when hits are greater than the ship length', () => {
    ship.hit()
    ship.hit()
    ship.hit()
    ship.hit()
    expect(hitSpy).toHaveBeenCalledTimes(4)

    expect(ship.isSunk()).toBe(true)
    expect(isSunkSpy).toHaveBeenCalled()
  })
})
