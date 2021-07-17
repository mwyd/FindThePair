const setupGame = (difficulty = 0) => {
    const board = document.querySelector('#board')

    const vBoard = []
    const symbols = [...'ABCDEFGHIJKLMNOPQRSTUVWXYZ123456']
    
    const levels = [
        {name: 'easy', symbols: 8},
        {name: 'medium', symbols: 18},
        {name: 'hard', symbols: 32}
    ]
    
    let currentLevel = levels[difficulty]
    let matchesLeft = currentLevel.symbols
    let lastClicked = null
    
    const createBoardRow = () => {
        const el = document.createElement('div')
        el.classList.add('board-row')
    
        return el
    }
    
    const createBoardField = id => {
        const el = document.createElement('div')
        el.classList.add('board-field', 'board-field--reversed')
        el.setAttribute('data-field-index', id)
    
        el.onclick = async e => {
            e.target.innerText = vBoard[id]
            e.target.classList.remove('board-field--reversed')
    
            await new Promise(r => setTimeout(r, 1000))
    
            if(lastClicked == null) {
                lastClicked = e.target
                return
            }
    
            if(id != lastClicked.dataset.fieldIndex && vBoard[lastClicked.dataset.fieldIndex] == vBoard[id]) {
                e.target.onclick = null
                lastClicked.onclick = null
    
                matchesLeft--
    
                if(matchesLeft == 0) alert('Well done')
            }
            else {
                e.target.innerText = ''
                e.target.classList.add('board-field--reversed')
    
                lastClicked.innerText = ''
                lastClicked.classList.add('board-field--reversed')
            }
    
            lastClicked = null
        }
    
        return el
    }
    
    const generateVBoard = () => {
        for(let i = 0; i < currentLevel.symbols; i++) {
            const symbol = symbols.shift()
    
            vBoard.push(symbol, symbol)
        }
    
        // Fisher–Yates shuffle
        for(let i = vBoard.length - 1; i > 0; i--) {
            const tmp = vBoard[i]
            const j =  Math.floor(Math.random() * (i + 1))
    
            vBoard[i] = vBoard[j]
            vBoard[j] = tmp
        }
    }
    
    const drawVBoard = () => {
        board.innerHTML = ''

        const size = Math.sqrt(vBoard.length)
    
        for(let i = 0; i < size; i++) {
            const boardRow = createBoardRow()
    
            for(let j = 0; j < size; j++) {
                boardRow.appendChild(createBoardField(i * size + j))
            }
    
            board.appendChild(boardRow)
        }
    }
    
    generateVBoard()
    drawVBoard()
}

const difficultyEasyRadio = document.querySelector('#difficulty-easy')
const difficultyMediumRadio = document.querySelector('#difficulty-medium')
const difficultyHardRadio = document.querySelector('#difficulty-hard')

const playButton = document.querySelector('#play-button')

// 0 - easy
// 1 - medium
// 2 - hard
const getDifficulty = () => {
    return difficultyEasyRadio.checked
        ? 0
        : difficultyMediumRadio.checked
            ? 1
            : 2
}

playButton.addEventListener('click', () => { setupGame(getDifficulty()) })