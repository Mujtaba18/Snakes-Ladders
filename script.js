const boardBox = document.querySelector('#boardBox');
const boardGrid = 10;

const cellWidth = 9.2;
const gridWidth = cellWidth * boardGrid;
const cellpadding = (100 - gridWidth) / 2;

const dices = document.querySelectorAll('.gameDice');
const diceButton = document.querySelector('#rollDice');

let currentPosition = 9 * boardGrid;
let circle = null;


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
    
}


diceButton.addEventListener('click', rollDice);
