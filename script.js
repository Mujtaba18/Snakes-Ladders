const boardBox = document.querySelector('#boardBox');
const boardGrid = 10;

const cellWidth = 9.2;
const gridWidth = cellWidth * boardGrid;
const cellpadding = (100 - gridWidth) / 2;

const dices = document.querySelectorAll('.gameDice');
const diceButton = document.querySelector('#rollDice');

let currentPosition = 9 * boardGrid;
let circle = null;

const fading = document.querySelector('#fadingScreen');
const whosTurnMsg = document.querySelector('#whosTurnMsg');

const pieces = document.querySelector('.piece');

let currentPlayerNum = 0;
let players = [
    { position: 9 * boardGrid, circle: null, id: 'player1', isFirstMove: true },
    { position: 9 * boardGrid, circle: null, id: 'player2', isFirstMove: true },
    { position: 9 * boardGrid, circle: null, id: 'player3', isFirstMove: true },
    { position: 9 * boardGrid, circle: null, id: 'player4', isFirstMove: true }
];

const snakes = {
    'cell-0-3': 'cell-2-1',
    'cell-0-5': 'cell-4-9',
    'cell-1-7': 'cell-8-2',
    'cell-3-1': 'cell-7-1',
    'cell-4-3': 'cell-6-0',
    'cell-4-8': 'cell-7-8',
    'cell-8-3': 'cell-8-7'
}

const ladders = {
    'cell-9-2': 'cell-7-0',
    'cell-9-7': 'cell-7-9',
    'cell-7-7': 'cell-1-3',
    'cell-4-2': 'cell-2-3',
    'cell-2-5': 'cell-1-5',
    'cell-2-0': 'cell-0-0',
    'cell-1-9': 'cell-0-9'
}


for (let row = 0; row < boardGrid; row++) {
    for (let col = 0; col < boardGrid; col++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.id = `cell-${row}-${col}`;

        cell.style.left = `${cellpadding + col * cellWidth}%`;
        cell.style.top = `${cellpadding + row * cellWidth}%`;

        boardBox.appendChild(cell);
    }
}

players.forEach((player, index) => {
    const firstCell = document.querySelector('#cell-9-0');
    player.circle = document.createElement('div');
    player.circle.classList.add('piece');
    player.circle.classList.add(`player${index + 1}`);
    firstCell.appendChild(player.circle);
});

function whichPlayerTurn() {
    whosTurnMsg.textContent = `Player ${currentPlayerNum + 1} Turn`;
    boardBox.classList.add('fading');
    fading.classList.add('show');

    setTimeout(() => {
        fading.classList.remove('show');
        boardBox.classList.remove('fading');
    }, 1000);
}

function updatePlayerTurn() {
    currentPlayerNum = (currentPlayerNum + 1) % players.length;
    whichPlayerTurn();
}

function rollDice() {
    const finalNumber = Math.floor(Math.random() * 6) + 1;
    // console.log(`Rolled Dice Number: ${randomNum}`);
    let currentDice = 1;


    function showDiceImages(number) {
        dices.forEach(dice => {
            dice.style.display = 'none';
        });
        const activeDice = document.querySelector(`#gameDice${number}`);
        if (activeDice) {
            activeDice.style.display = 'block';
        }
    }

    const interval = setInterval(() => {
        showDiceImages(currentDice);

        currentDice++;
        if (currentDice > 6) {
            currentDice = 1;
        }
    }, 100);

    setTimeout(() => {
        clearInterval(interval);
        showDiceImages(finalNumber);


        movePiece(finalNumber);
    }, 700)

}

function movePiece(moves) {
    const player = players[currentPlayerNum];
    let row = Math.floor(player.position / boardGrid);
    let col = player.position % boardGrid;

    let cellsToWin = 0 + player.position;

    if (player.isFirstMove) {
        moves--;
        player.isFirstMove = false;
    }

    if (moves > cellsToWin) {
        return;
    }

    for (let i = 0; i < moves; i++) {

        if (row % 2 === 0) {
            col--;
            if (col < 0) {
                col = 0;
                row--;
            }
        } else {
            col++;
            if (col >= boardGrid) {
                col = boardGrid - 1;
                row--;
            }
        }
        if (row < 0) {
            row = 0;
            col = 0;
            break;
        }
    }

    player.position = row * boardGrid + col;

    const cellId = `cell-${row}-${col}`;

    if (snakes[cellId]) {
        player.position = parseCellId(snakes[cellId]);
    } else if (ladders[cellId]) {
        player.position = parseCellId(ladders[cellId]);
    }

    const newRow = Math.floor(player.position / boardGrid);
    const newCol = player.position % boardGrid;
    const newCell = document.querySelector(`#cell-${newRow}-${newCol}`);

    // console.log(player.position);
    if (player.position === 0) {
        newCell.appendChild(player.circle);
        alert(`${player.id} Wins!!`);
    }
    else if (newCell) {
        newCell.appendChild(player.circle);
    }

    updatePlayerTurn();
}

function parseCellId(cellId) {
    const [row, col] = cellId.replace('cell-', '').split('-').map(Number);
    return row * boardGrid + col;
}

dices.forEach(dice => {
    dice.addEventListener('click', rollDice);
});

whichPlayerTurn();

