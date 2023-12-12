/**
 * Factory function for creating a Battleship Player.
 *
 * @param {string} name - The name of the player.
 * @param {Object} enemyGameboard - The Gameboard object of the opponent.
 * @returns {Object} - Player object with methods for making attacks.
 */
export const Player = (name, enemyGameboard) => {
  /**
   * Makes an attack on the enemy Gameboard at the specified index.
   *
   * @param {string} index - The index representing the coordinates of the attack, e.g., 'a1', 'j10'.
   * @throws {Error} - Throws an error if the attack is invalid.
   * @returns {Object} - Object containing information about the attack result.
   */
  const attack = (index) => {
    try {
      enemyGameboard.receiveAttack(index)

      const isHit = enemyGameboard
        .getShipsState()
        .some((item) => item.indices.includes(index))

      return {
        isHit,
        message: `${name} attacked at ${index}`,
      }
    } catch (error) {
      throw new Error(error.message)
    }
  }

  return {
    name,
    attack,
  }
}
