const boardBox = document.querySelector('#boardBox');
const boardGrid = 10;

const cellWidth = 9.2;
const gridWidth = cellWidth * boardGrid;
const cellpadding = (100 - gridWidth) / 2;

const dices = document.querySelectorAll('.gameDice');
const diceButton = document.querySelector('#rollDice');

let currentPosition = 9 * boardGrid;
let circle = null;
let isFirstMove = true;

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

        if (row === 9 && col === 0) {
            circle = document.createElement('div');
            circle.classList.add('piece');
            cell.appendChild(circle);
        }
    }
}

function rollDice() {
    const randomNum = Math.floor(Math.random() * 6) + 1;

    dices.forEach(dice => {
        dice.style.display = 'none';
    });

    const activeDice = document.querySelector(`#gameDice${randomNum}`);
    activeDice.style.display = 'block';

    movePiece(randomNum);
}

function movePiece(moves) {
    let row = Math.floor(currentPosition / boardGrid);
    let col = currentPosition % boardGrid;

    let cellsToWin = 0 + currentPosition;

    if (isFirstMove) {
        moves--;
        isFirstMove = false;
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

    currentPosition = row * boardGrid + col;

    const cellId = `cell-${row}-${col}`;

    if (snakes[cellId]) {
        currentPosition = parseCellId(snakes[cellId]);
    } else if (ladders[cellId]) {
        currentPosition = parseCellId(ladders[cellId]);
    }

    const newRow = Math.floor(currentPosition / boardGrid);
    const newCol = currentPosition % boardGrid;
    const newCell = document.querySelector(`#cell-${newRow}-${newCol}`);

    console.log(currentPosition);
    if (currentPosition === 0) {
        newCell.appendChild(circle);
        alert('Congratulations!');
    }
    else if (newCell) {
        newCell.appendChild(circle);
    }
}

function parseCellId(cellId) {
    const [row, col] = cellId.replace('cell-', '').split('-').map(Number);
    return row * boardGrid + col;
}



diceButton.addEventListener('click', rollDice);
