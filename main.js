let timerIntervalId = null

const setupGame = (difficulty = 0) => {
    clearInterval(timerIntervalId)

    const timer = document.querySelector('#timer-mutable')
    timer.innerText = '00:00:00'

    const board = document.querySelector('#board')
    board.innerHTML = ''

    const vBoard = []
    const symbols = [...new Array(32).keys()]
    
    const levels = [
        {name: 'easy', symbols: 8},
        {name: 'medium', symbols: 18},
        {name: 'hard', symbols: 32}
    ]
    
    let currentLevel = levels[difficulty]
    let matchesLeft = currentLevel.symbols
    let lastClicked = null
    let initTime = null
    let eventLocked = false
    
    const getElapsedTime = () => {
        return (Date.now() - initTime) / 1000
    }

    const formatTime = time => {
        const hours = Math.floor(time / 3600).toString().padStart(2, '0')
        const minutes = Math.floor(time / 60).toString().padStart(2, '0')
        const seconds = Math.floor(time % 60).toString().padStart(2, '0')

        return `${hours}:${minutes}:${seconds}`
    }

    const updateTimer = () => {
        timer.innerText = formatTime(getElapsedTime())
    }
    
    const highlightTimer = () => {
        timer.classList.add('timer-mutable--highlighted')
        setTimeout(() => timer.classList.remove('timer-mutable--highlighted'), 1000)
    }

    const showField = el => {
        el.classList.remove('board-field--reversed')
        el.innerHTML = `<img src="assets/${vBoard[el.dataset.fieldIndex]}.png">`
    }

    const hideField = el => {
        el.classList.add('board-field--reversed')
        el.innerHTML = ''
    }

    const fieldClickEvent = async e => {
        if(eventLocked) return

        let currentClicked = e.currentTarget

        showField(currentClicked)

        if(initTime == null) {
            initTime = Date.now()
            timerIntervalId = setInterval(updateTimer, 1000)
        }

        if(lastClicked == null) {
            lastClicked = currentClicked
            return
        }

        if(currentClicked.dataset.fieldIndex == lastClicked.dataset.fieldIndex) {
            hideField(currentClicked)
        }
        else if(vBoard[lastClicked.dataset.fieldIndex] == vBoard[currentClicked.dataset.fieldIndex]) {
            currentClicked.removeEventListener('click', fieldClickEvent)
            lastClicked.removeEventListener('click', fieldClickEvent)

            matchesLeft--

            if(matchesLeft == 0) {
                clearInterval(timerIntervalId)
                highlightTimer()
            }
        }
        else {
            eventLocked = true

            await new Promise(r => setTimeout(r, 1000))

            hideField(currentClicked)
            hideField(lastClicked)

            eventLocked = false
        }

        lastClicked = null
    }

    const createBoardRow = () => {
        const el = document.createElement('div')
        el.classList.add('board-row')
    
        return el
    }
    
    const createBoardField = id => {
        const el = document.createElement('div')
        el.classList.add('board-field', 'board-field--reversed')

        el.setAttribute('data-field-index', id)
        el.addEventListener('click', fieldClickEvent)
    
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

playButton.addEventListener('click', () => setupGame(getDifficulty()))

setupGame()