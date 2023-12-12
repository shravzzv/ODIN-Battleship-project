import { Gameboard } from '../src/Gameboard'

describe('Gameboard', () => {
  let gameboard
  let placeShipSpy
  let receiveAttackSpy
  let areAllShipsSunkSpy

  beforeEach(() => {
    gameboard = Gameboard()
    placeShipSpy = jest.spyOn(gameboard, 'placeShip')
    receiveAttackSpy = jest.spyOn(gameboard, 'receiveAttack')
    areAllShipsSunkSpy = jest.spyOn(gameboard, 'areAllShipsSunk')
  })

  afterEach(() => {
    placeShipSpy.mockClear()
    receiveAttackSpy.mockClear()
  })

  describe('placeShip()', () => {
    test('should be able to place ships at specific coordinates.', () => {
      gameboard.placeShip('a2', 5, 'h')
      expect(placeShipSpy).toHaveBeenCalledWith('a2', 5, 'h')
      expect(gameboard.getShipsState()[0]).toHaveProperty('indices', [
        'a2',
        'a3',
        'a4',
        'a5',
        'a6',
      ])
    })

    test('should be able to place ships at specific coordinates vertically.', () => {
      gameboard.placeShip('a2', 5, 'v')
      expect(placeShipSpy).toHaveBeenCalledWith('a2', 5, 'v')
      expect(gameboard.getShipsState()[0]).toHaveProperty('indices', [
        'a2',
        'b2',
        'c2',
        'd2',
        'e2',
      ])
    })

    test('should not place a ship whose length extends the board', () => {
      expect(() => gameboard.placeShip('a8', 5, 'h')).toThrow(
        'Invalid indices: Ship extends the board bounds!'
      )

      expect(() => gameboard.placeShip('i8', 5, 'v')).toThrow(
        'Invalid indices: Ship extends the board bounds!'
      )
    })

    test('should not allow ships to occupy already occupied indices', () => {
      gameboard.placeShip('a1', 5, 'h')

      expect(() => gameboard.placeShip('a1', 5, 'h')).toThrow(
        'Invalid indices: Ship cannot be placed over other ships!'
      )

      expect(() => gameboard.placeShip('a1', 5, 'v')).toThrow(
        'Invalid indices: Ship cannot be placed over other ships!'
      )
    })

    test('should not allow ships to be placed adjacent to other ships', () => {
      gameboard.placeShip('a1', 2, 'h')

      expect(() => gameboard.placeShip('b1', 2, 'h')).toThrow(
        'Invalid indices: Ship cannot be placed adjacent to other ships!'
      )

      expect(() => gameboard.placeShip('a3', 3, 'v')).toThrow(
        'Invalid indices: Ship cannot be placed adjacent to other ships!'
      )
    })

    test('should allow placing multiple ships on the board', () => {
      // Place the first ship
      gameboard.placeShip('a2', 3, 'h')
      expect(placeShipSpy).toHaveBeenCalledWith('a2', 3, 'h')
      expect(gameboard.getShipsState()[0]).toHaveProperty('indices', [
        'a2',
        'a3',
        'a4',
      ])

      // Place the second ship
      gameboard.placeShip('c5', 4, 'v')
      expect(placeShipSpy).toHaveBeenCalledWith('c5', 4, 'v')
      expect(gameboard.getShipsState()[1]).toHaveProperty('indices', [
        'c5',
        'd5',
        'e5',
        'f5',
      ])

      // Place the third ship
      gameboard.placeShip('j8', 3, 'h')
      expect(placeShipSpy).toHaveBeenCalledWith('j8', 3, 'h')
      expect(gameboard.getShipsState()[2]).toHaveProperty('indices', [
        'j8',
        'j9',
        'j10',
      ])

      // Ensure all ships are in the gameboard state
      expect(gameboard.getShipsState()).toHaveLength(3)
    })
  })

  describe('receiveAttack()', () => {
    test('should attack an empty coordinate', () => {
      gameboard.receiveAttack('a1')
      expect(receiveAttackSpy).toHaveBeenCalledWith('a1')
      expect(gameboard.getMissedAttacks()).toEqual(['a1'])
    })

    test('should not attack a coordinate out of bounds', () => {
      expect(() => gameboard.receiveAttack('z9')).toThrow(
        'Invalid index: Cannot attack an index that is out of bounds!'
      )
    })

    test('should attack a coordinate where a ship is present', () => {
      gameboard.placeShip('a1', 5, 'h')
      gameboard.receiveAttack('a1')

      expect(placeShipSpy).toHaveBeenCalledWith('a1', 5, 'h')
      expect(receiveAttackSpy).toHaveBeenCalledWith('a1')
      expect(gameboard.getShipsState()[0].ship.getHits()).toBe(1)
    })

    test('should not attack an already attacked coordinate', () => {
      gameboard.receiveAttack('j10')
      expect(receiveAttackSpy).toHaveBeenCalledWith('j10')

      expect(() => gameboard.receiveAttack('j10')).toThrow()
    })
  })

  describe('areAllShipsSunk()', () => {
    test('should return false when no ships are placed on the board', () => {
      expect(gameboard.areAllShipsSunk()).toBe(false)
      expect(areAllShipsSunkSpy).toHaveBeenCalled()
    })

    test(`should return false when all ships aren't sunk`, () => {
      gameboard.placeShip('a1', 5, 'v')
      expect(gameboard.areAllShipsSunk()).toBe(false)
      expect(areAllShipsSunkSpy).toHaveBeenCalled()
    })

    test(`should return true when all ships are sunk`, () => {
      gameboard.placeShip('a1', 2, 'v')
      gameboard.receiveAttack('a1')
      gameboard.receiveAttack('b1')
      expect(gameboard.areAllShipsSunk()).toBe(true)
      expect(areAllShipsSunkSpy).toHaveBeenCalled()
    })
  })
})
