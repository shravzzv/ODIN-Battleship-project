import Guide from './components/Guide'
import Board from './components/Board'

/**
 * Module for DOM interaction.
 *
 * @returns {Object} - Interface object with methods for DOM manipulation.
 */
export const Interface = (() => {
  /**
   * Reference to the root element in the DOM where the game interface is rendered.
   *
   * @type {HTMLElement}
   */
  const _root = document.querySelector('#root')

  /**
   * Initializes the DOM interface.
   */
  const initialize = () => {
    _root.appendChild(Guide())
    _root.appendChild(Board())
    document
      .querySelectorAll('.cell')
      .forEach((cell) => cell.addEventListener('click', _handleCellClick))
  }

  const _handleCellClick = (e) => {
    const index = e.target.attributes['data-index'].value
    _markCellAsAttacked(index)
  }

  const placeShips = (shipsState) => {
    shipsState.forEach((item) => {
      let { indices, ship } = item
      indices.forEach((index) => {
        let cell = document.querySelector(`.cell[data-index=${index}]`)
        cell.classList.add('ship')
      })
    })
  }

  const _markCellAsAttacked = (index) => {
    const cell = document.querySelector(`.cell[data-index=${index}]`)
    cell.classList.add('attacked')
  }

  return { initialize, placeShips }
})()
