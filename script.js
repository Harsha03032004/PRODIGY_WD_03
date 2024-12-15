const gameBoard = document.getElementById('gameBoard');
const cells = document.querySelectorAll('[data-cell]');
const message = document.getElementById('gameMessage');
const restartBtn = document.getElementById('restartBtn');
const humanVsHumanBtn = document.getElementById('humanVsHuman');
const humanVsAIBtn = document.getElementById('humanVsAI');

let isHumanVsAI = false;
let currentPlayer = 'X';
let board = ['', '', '', '', '', '', '', '', ''];
const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
];

humanVsHumanBtn.addEventListener('click', () => startGame(false));
humanVsAIBtn.addEventListener('click', () => startGame(true));
restartBtn.addEventListener('click', resetGame);

function startGame(vsAI) {
    isHumanVsAI = vsAI;
    resetGame();
    message.textContent = isHumanVsAI ? 'You are X. AI is O.' : 'Player X\'s turn.';
}

function handleClick(e) {
    const cell = e.target;
    const index = Array.from(cells).indexOf(cell);

    if (board[index] !== '') return;

    placeMark(cell, currentPlayer);
    board[index] = currentPlayer;

    if (checkWin(currentPlayer)) {
        endGame(`${currentPlayer} Wins!`);
    } else if (board.every(cell => cell !== '')) {
        endGame('Draw!');
    } else {
        swapTurns();

        if (isHumanVsAI && currentPlayer === 'O') {
            setTimeout(aiMove, 500);
        } else {
            message.textContent = `Player ${currentPlayer}'s turn.`;
        }
    }
}

function placeMark(cell, player) {
    cell.textContent = player;
    cell.classList.add('taken');
}

function swapTurns() {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
}

function checkWin(player) {
    return winningCombinations.some(combination => {
        return combination.every(index => board[index] === player);
    });
}

function endGame(result) {
    message.textContent = result;
    gameBoard.classList.add('disabled');
    restartBtn.style.display = 'block';
    cells.forEach(cell => cell.removeEventListener('click', handleClick));
}

function resetGame() {
    board = ['', '', '', '', '', '', '', '', ''];
    currentPlayer = 'X';
    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('taken');
        cell.addEventListener('click', handleClick, { once: true });
    });
    message.textContent = 'Choose a game mode to start!';
    restartBtn.style.display = 'none';
    gameBoard.classList.remove('disabled');
}

function aiMove() {
    const availableMoves = board.map((cell, index) => (cell === '' ? index : null)).filter(index => index !== null);
    const randomMove = availableMoves[Math.floor(Math.random() * availableMoves.length)];

    placeMark(cells[randomMove], 'O');
    board[randomMove] = 'O';

    if (checkWin('O')) {
        endGame('AI Wins!');
    } else if (board.every(cell => cell !== '')) {
        endGame('Draw!');
    } else {
        swapTurns();
        message.textContent = `Player ${currentPlayer}'s turn.`;
    }
}

