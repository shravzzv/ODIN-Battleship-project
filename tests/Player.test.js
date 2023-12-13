import { Player } from '../src/Player'
import { Gameboard } from '../src/Gameboard'

describe('Player', () => {
  let player
  let board
  let attackSpy

  beforeEach(() => {
    board = Gameboard()
    player = Player('John', board)
    attackSpy = jest.spyOn(player, 'attack')
  })

  afterEach(() => {
    attackSpy.mockClear()
  })

  test('should create a player with a given name', () => {
    expect(player.name).toMatch('John')
  })

  test('should be able to attack an empty index on the enemy board', () => {
    const result = player.attack('a1')

    expect(attackSpy).toHaveBeenCalledWith('a1')
    expect(result).toMatchObject({
      isHit: false,
      message: 'John attacked at a1',
    })
    expect(board.getMissedAttacks()).toEqual(['a1'])
  })

  test('should be able to attack a ship', () => {
    board.placeShip('a1', 5, 'h')

    const result = player.attack('a2')
    expect(attackSpy).toHaveBeenCalledWith('a2')
    expect(result).toMatchObject({
      isHit: true,
      message: 'John attacked at a2',
    })
    expect(board.getMissedAttacks().length).toBe(0)
  })

  test('should not be allowed to attack an index that is out of bounds of the board', () => {
    expect(() => player.attack('z9')).toThrow(
      'Invalid index: Cannot attack an index that is out of bounds!'
    )
  })

  test('should not be allowed to attack a same index twice', () => {
    board.placeShip('a1', 5, 'h')

    const result = player.attack('a2')
    expect(attackSpy).toHaveBeenCalledWith('a2')
    expect(result).toMatchObject({
      isHit: true,
      message: 'John attacked at a2',
    })
    expect(board.getMissedAttacks().length).toBe(0)

    expect(() => player.attack('a2')).toThrow(
      'Invalid index: Cannot attack an already attacked index!'
    )
  })
})
