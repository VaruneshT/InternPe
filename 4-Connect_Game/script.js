const rows = 6;
const cols = 7;
let currentPlayer = 'red';
let board = [];
let moveHistory = [];
let redWins = 0;
let yellowWins = 0;
let gameMode = 'pvp'; // Default to Player vs Player

function createBoard() {
    const boardElement = document.querySelector('.board');
    boardElement.innerHTML = '';
    board = Array.from({ length: rows }, () => Array(cols).fill(null));
    moveHistory = [];
    document.getElementById('undo-button').disabled = true;

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.row = r;
            cell.dataset.col = c;
            cell.addEventListener('click', handleCellClick);
            boardElement.appendChild(cell);
        }
    }
}

function handleCellClick(event) {
    const col = event.target.dataset.col;
    if (makeMove(col)) {
        document.getElementById('undo-button').disabled = false;
        if (checkWin()) {
            highlightWinningDiscs();
            setTimeout(() => alert(`${currentPlayer.charAt(0).toUpperCase() + currentPlayer.slice(1)} wins!`), 100);
            updateScore();
            setTimeout(resetGame, 500);
        } else if (gameMode === 'pvc' && currentPlayer === 'yellow') {
            setTimeout(computerMove, 500);
        } else {
            switchPlayer();
        }
    }
}

function makeMove(col) {
    for (let r = rows - 1; r >= 0; r--) {
        if (!board[r][col]) {
            board[r][col] = currentPlayer;
            moveHistory.push({ row: r, col });
            const cell = document.querySelector(`.cell[data-row='${r}'][data-col='${col}']`);
            const disc = document.createElement('div');
            disc.classList.add(currentPlayer);
            cell.appendChild(disc);
            return true;
        }
    }
    return false;
}

function computerMove() {
    let col;
    do {
        col = Math.floor(Math.random() * cols);
    } while (!makeMove(col));
    if (!checkWin()) {
        switchPlayer();
    } else {
        highlightWinningDiscs();
        setTimeout(() => alert('Yellow (Computer) wins!'), 100);
        updateScore();
        setTimeout(resetGame, 500);
    }
}

function switchPlayer() {
    currentPlayer = currentPlayer === 'red' ? 'yellow' : 'red';
}

function checkWin() {
    const directions = [
        { x: 0, y: 1 },  // Horizontal
        { x: 1, y: 0 },  // Vertical
        { x: 1, y: 1 },  // Diagonal \
        { x: 1, y: -1 }  // Diagonal /
    ];
    for (const { x, y } of directions) {
        const line = [];
        for (let i = -3; i <= 3; i++) {
            const r = moveHistory[moveHistory.length - 1].row + i * y;
            const c = moveHistory[moveHistory.length - 1].col + i * x;
            if (r >= 0 && r < rows && c >= 0 && c < cols && board[r][c] === currentPlayer) {
                line.push({ r, c });
                if (line.length === 4) {
                    moveHistory[moveHistory.length - 1].winningLine = line;
                    return true;
                }
            } else {
                line.length = 0;
            }
        }
    }
    return false;
}

function highlightWinningDiscs() {
    moveHistory[moveHistory.length - 1].winningLine.forEach(({ r, c }) => {
        const cell = document.querySelector(`.cell[data-row='${r}'][data-col='${c}'] div`);
        cell.classList.add('highlight');
    });
}

function updateScore() {
    if (currentPlayer === 'red') {
        redWins++;
        document.getElementById('score-red').textContent = `Red: ${redWins}`;
    } else {
        yellowWins++;
        document.getElementById('score-yellow').textContent = `Yellow: ${yellowWins}`;
    }
}

function undoMove() {
    if (moveHistory.length > 0) {
        const lastMove = moveHistory.pop();
        board[lastMove.row][lastMove.col] = null;
        const cell = document.querySelector(`.cell[data-row='${lastMove.row}'][data-col='${lastMove.col}'] div`);
        cell.parentNode.removeChild(cell);
        switchPlayer();
        if (moveHistory.length === 0) {
            document.getElementById('undo-button').disabled = true;
        }
    }
}

function resetGame() {
    createBoard();
    currentPlayer = 'red';
}

document.getElementById('pvp-button').addEventListener('click', () => {
    gameMode = 'pvp';
    resetGame();
});

document.getElementById('pvc-button').addEventListener('click', () => {
    gameMode = 'pvc';
    resetGame();
});

document.getElementById('undo-button').addEventListener('click', undoMove);
document.getElementById('reset-button').addEventListener('click', resetGame);

// Initialize the game
createBoard();
