/**
 * Generates a DOM component representing the footer for the Battleship game.
 * This footer may include instructions on how to play the game and links to social media.
 *
 * @returns {HTMLElement} - The footer component.
 */
const Footer = () => {
  const element = document.createElement('div')
  element.className = 'footer'

  const instructions = document.createElement('div')
  instructions.className = 'instructions'

  const question1Container = document.createElement('div')

  const question1 = document.createElement('h3')
  question1.textContent = 'How to play Battleship?'
  const answer1 = document.createElement('div')
  answer1.innerHTML = `
       <p>1. Place your ships on the board.</p>
       <p>2. Attack the enemy waters by clicking on a cell. The enemy retaliates by attacking a cell in your waters.</p>
       <p>3. Cells marked by green means the attack was a miss and red means it was a hit!</p>
       <p>4. The objective of the game is to be the first one to sink all of your opponents ships.</p>
   `
  question1Container.appendChild(question1)
  question1Container.appendChild(answer1)

  const question2Container = document.createElement('div')

  const question2 = document.createElement('h3')
  question2.textContent = 'What is Battleship?'
  const answer2 = document.createElement('div')
  answer2.innerHTML = `
       <p>Battleship is a strategy type guessing game for two players. It is played on ruled grids on which each player's fleet of warships are marked. The locations of the fleets are concealed from the other player. Players alternate turns calling "shots" at the other player's ships, and the objective of the game is to destroy the opposing player's fleet.</p>
   `
  question2Container.appendChild(question2)
  question2Container.appendChild(answer2)

  instructions.appendChild(question2Container)
  instructions.appendChild(question1Container)

  // GitHub link
  const gitHubLink = document.createElement('a')
  gitHubLink.href = 'https://github.com/shravzzv/ODIN-Battleship-project'
  gitHubLink.target = '_blank'
  gitHubLink.rel = 'noopener noreferrer'
  gitHubLink.textContent = 'Give this project a star on GitHub'
  gitHubLink.className = 'gitHubLink'

  const gitHubImage = document.createElement('img')
  gitHubImage.src = 'https://cdn-icons-png.flaticon.com/512/25/25231.png'
  gitHubImage.alt = 'GitHub'
  gitHubImage.className = 'gitHubImage'
  gitHubLink.appendChild(gitHubImage)

  element.appendChild(instructions)
  element.appendChild(gitHubLink)
  return element
}

export default Footer
