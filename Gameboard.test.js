import { Gameboard } from './Gameboard'

describe('Gameboard', () => {
  let gameboard
  let placeShipSpy

  beforeEach(() => {
    gameboard = Gameboard()
    placeShipSpy = jest.spyOn(gameboard, 'placeShip')
  })

  afterEach(() => {
    placeShipSpy.mockClear()
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
})
