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

const getPlayer = new URLSearchParams(window.location.search);
const numOfPlayers = getPlayer.get('Player');

let cheat = 'win';
let cheatPosition = 0;

let currentPlayerNum = 0;
let players = [
    { position: 9 * boardGrid, circle: null, id: 'player1', name: 'Player 1', isFirstMove: true, wins: 0, won: false },
    { position: 9 * boardGrid, circle: null, id: 'player2', name: 'Player 2', isFirstMove: true, wins: 0, won: false },
    { position: 9 * boardGrid, circle: null, id: 'player3', name: 'Player 3', isFirstMove: true, wins: 0, won: false },
    { position: 9 * boardGrid, circle: null, id: 'player4', name: 'Player 4', isFirstMove: true, wins: 0, won: false }
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

if (numOfPlayers === '1') {
    players = players.map((player, num) => {
        if (num !== 0) {
            player.hidden = true;
        }
        return player;
    });
} else if (numOfPlayers === '2') {
    players = players.map((player, num) => {
        if (num !== 0 && num !== 1) {
            player.hidden = true;
        }
        return player;
    });
} else if (numOfPlayers === '3') {
    players = players.map((player, num) => {
        if (num === 3) {
            player.hidden = true;
        }
        return player;
    });
} else {
    players.forEach(player => player.hidden = false);
}

players.forEach((player, index) => {
    const playersNum = document.getElementById(player.id);
    if (!player.hidden) {
        const firstCell = document.querySelector('#cell-9-0');
        player.circle = document.createElement('div');
        player.circle.classList.add('piece');
        player.circle.classList.add(`player${index + 1}`);
        firstCell.appendChild(player.circle);
    } else {
        playersNum.style.display = 'none';
    }
});

function whichPlayerTurn() {
    if (numOfPlayers !== '1'|| players[currentPlayerNum].wins === 1) {
        whosTurnMsg.textContent = `Player ${currentPlayerNum + 1} Turn`;
        boardBox.classList.add('fading');
        fading.classList.add('show');

        setTimeout(() => {
            fading.classList.remove('show');
            boardBox.classList.remove('fading');
        }, 1000);
    }
}

function updatePlayerTurn() {
    currentPlayerNum = (currentPlayerNum + 1) % players.length;
    while (players[currentPlayerNum].hidden || players[currentPlayerNum].wins === 1) {
        currentPlayerNum = (currentPlayerNum + 1) % players.length;
    }
    whichPlayerTurn();
}

function showPlayAgain() {
    if (numOfPlayers !== '1') {
        whosTurnMsg.innerHTML = `You got 6!! \n One more chance..`;
        boardBox.classList.add('fading');
        fading.classList.add('show');

        setTimeout(() => {
            fading.classList.remove('show');
            boardBox.classList.remove('fading');
        }, 1000);
    }
}

function rollDice() {
    const finalNumber = Math.floor(Math.random() * 6) + 1;
    // console.log(`Rolled Dice Number: ${finalNumber}`);
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

        if (finalNumber !== 6) {
            updatePlayerTurn();
        } else {
            showPlayAgain();
        }

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

    if (player.position === 0) {
        newCell.appendChild(player.circle);
        player.wins++;
        let getWins = document.getElementById(`wins-${player.id}`);
        getWins.innerText = player.wins;

        player.won = true;
        updatePlayerTurn();
        alert(`${player.name} Wins!!`);

        return;
    }
    else if (newCell) {
        newCell.appendChild(player.circle);
    }

    // if (players.every(play => play.wins >= 1)) {
    //     alert("Game Over!!");
    // }
}

function parseCellId(cellId) {
    const [row, col] = cellId.replace('cell-', '').split('-').map(Number);
    return row * boardGrid + col;
}

function linkToGame() {
    if (document.getElementById("Player-1-btn").checked === true) {
        location.href = 'game.html?Player=1';
    } else if (document.getElementById("Player-2-btn").checked === true) {
        location.href = 'game.html?Player=2';
    } else if (document.getElementById("Player-3-btn").checked === true) {
        location.href = 'game.html?Player=3';
    } else {
        location.href = 'game.html?Player=4';
    }
}

document.addEventListener('keydown', function (e) {
    const key = e.key.toLowerCase();
    console.log(e.key);

    if (key === cheat[cheatPosition]) {
        cheatPosition++;

        if (cheatPosition === cheat.length) {
            winCheat();
            cheatPosition = 0;
        }
    } else {
        cheatPosition = 0;
    }
});

function winCheat() {
    console.log('Cheat Code Active!!')
    const player = players[currentPlayerNum];

    player.position = 0;

    const newPlace = document.querySelector('#cell-0-0');
    newPlace.appendChild(player.circle);

    player.wins++;
    let getWins = document.getElementById(`wins-${player.id}`);
    getWins.innerText = player.wins;
    alert(`${player.name} Wins!!`);
}

dices.forEach(dice => {
    dice.addEventListener('click', rollDice);
});

whichPlayerTurn();

