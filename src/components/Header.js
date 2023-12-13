/**
 * DOM component representing a battleship gameboard.
 *
 * @returns {HTMLElement}
 */

const Header = () => {
  const element = document.createElement('div')
  element.className = 'header'

  const title = document.createElement('h1')
  title.className = 'title'
  title.textContent = 'Battleship'
  element.appendChild(title)

  const subTitle = document.createElement('p')
  subTitle.textContent = `Sink all of your enemy's ships before they sink yours.`
  subTitle.className = 'subTitle'
  // element.appendChild(subTitle)

  return element
}

export default Header
