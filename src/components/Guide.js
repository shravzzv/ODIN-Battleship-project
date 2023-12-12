/**
 * DOM component representing a battleship gameboard.
 *
 * @returns {HTMLElement}
 */

const Guide = () => {
  const element = document.createElement('div')
  element.className = 'guide'

  const title = document.createElement('h1')
  title.className = 'title'
  title.textContent = 'Battleship'
  element.appendChild(title)

  const text = document.createElement('p')
  text.textContent = `Sink all of your enemy's ships before they sink yours.`
  element.appendChild(text)

  return element
}

export default Guide
