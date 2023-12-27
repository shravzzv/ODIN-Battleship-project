import { ComputerPlayer } from '../src/ComputerPlayer'
import { Gameboard } from '../src/Gameboard'

describe('ComputerPlayer', () => {
  let computerPlayer
  let board
  let attackSpy

  beforeEach(() => {
    board = Gameboard()
    computerPlayer = ComputerPlayer(board)
    attackSpy = jest.spyOn(computerPlayer, 'attack')
  })

  afterEach(() => {
    attackSpy.mockClear()
  })

  test('should be able to attack a random index', () => {
    computerPlayer.attack()

    expect(attackSpy).toHaveBeenCalled()

    // since there are no ships on the board, this attack should miss
    expect(
      board.getMissedAttacks()[0] === computerPlayer.getLastAttack().index
    ).toBe(true)
  })

  test('should not attack an already attacked index', () => {
    // when making 100 different attacks, all 100 attacks will be at different indices
    for (let i = 0; i < 100; i++) {
      computerPlayer.attack()
    }

    expect(computerPlayer.getAttacks()).toHaveLength(100)

    // since no ships have been placed on the board, every attack should be a miss
    expect(
      computerPlayer.getAttacks().every((attack) => attack.isHit === false)
    ).toBe(true)

    expect(board.getMissedAttacks()).toHaveLength(100)

    // there are no more valid indices to attack because every index is already attacked

    expect(() => computerPlayer.attack()).toThrow(
      'Invalid attack: All 100 cells have been attacked!'
    )
  })

  test('should be able to hit a ship', () => {
    board.placeShip('a1', 5, 'h')

    let i = 0
    while (i < 100) {
      computerPlayer.attack()
      i++
    }

    expect(attackSpy).toHaveBeenCalledTimes(100)
    expect(board.areAllShipsSunk()).toBe(true)
    expect(board.getMissedAttacks()).toHaveLength(95)
    expect(() => computerPlayer.attack()).toThrow()

    expect(
      computerPlayer
        .getAttacks()
        .every((attack) =>
          ['a1', 'a2', 'a3', 'a4', 'a5'].includes(attack.index)
            ? attack.isHit === true
            : attack.isHit === false
        )
    ).toBe(true)
  })

  test(`should attack one of the ship's surroundings when it is hit`, () => {
    board.placeShip('a1', 3, 'h')
    // ship is located at 'a1', 'a2', 'a3'

    // looking for the first hit
    let isHit = false
    while (!isHit) {
      computerPlayer.attack()
      isHit = computerPlayer.getLastAttack().isHit
    }

    // expect the next attack to be in the surroundings
    computerPlayer.attack()

    expect(
      ['a1', 'a2', 'a3', 'a4', 'b1', 'b2', 'b3'].includes(
        computerPlayer.getLastAttack().index
      )
    ).toBe(true)

    expect(attackSpy).toHaveBeenCalled()
  })
})
