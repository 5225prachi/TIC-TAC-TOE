document.addEventListener('DOMContentLoaded', () => {
    const cells = document.querySelectorAll('.cell');
    const message = document.querySelector('.message');
    const restartButton = document.getElementById('restart');
    const twoPlayerModeButton = document.getElementById('two-player-mode');
    const vsComputerModeButton = document.getElementById('vs-computer-mode');
    const gameBoard = document.getElementById('game-board');

    let board = Array(9).fill(null);
    let currentPlayer = 'X';
    let gameMode = 'twoPlayer'; // Default mode is 2 Players
    let isGameActive = true;

    const winningConditions = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    function handleCellClick(event) {
        const clickedCell = event.target;
        const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index'));

        if (board[clickedCellIndex] !== null || !isGameActive) {
            return;
        }

        board[clickedCellIndex] = currentPlayer;
        clickedCell.textContent = currentPlayer;
        clickedCell.classList.add(currentPlayer); // Add class based on player X or O

        checkResult();

        if (isGameActive) {
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
            if (gameMode === 'vsComputer' && currentPlayer === 'O') {
                handleComputerMove();
            }
        }
    }

    function handleComputerMove() {
        const bestMove = minimax(board, 'O').index;
        board[bestMove] = 'O';
        const cell = document.querySelector(`[data-index='${bestMove}']`);
        cell.textContent = 'O';
        cell.classList.add('O');
        checkResult();
        currentPlayer = 'X';
    }

    function checkResult() {
        let roundWon = false;
        for (let i = 0; i < winningConditions.length; i++) {
            const [a, b, c] = winningConditions[i];
            if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                roundWon = true;
                break;
            }
        }

        if (roundWon) {
            message.textContent = `Player ${currentPlayer} has won!`;
            isGameActive = false;
            restartButton.style.display = 'block';
            return;
        }

        if (!board.includes(null)) {
            message.textContent = 'Game ended in a draw!';
            isGameActive = false;
            restartButton.style.display = 'block';
            return;
        }
    }

    function restartGame() {
        board.fill(null);
        cells.forEach(cell => {
            cell.textContent = '';
            cell.classList.remove('X', 'O'); // Remove X and O classes
        });
        currentPlayer = 'X';
        isGameActive = true;
        message.textContent = '';
        restartButton.style.display = 'none';
    }

    function setMode(mode) {
        gameMode = mode;
        restartGame();
    }

    function minimax(newBoard, player) {
        const availSpots = newBoard.map((cell, index) => cell === null ? index : null).filter(v => v !== null);

        if (checkWin(newBoard, 'X')) {
            return { score: -10 };
        } else if (checkWin(newBoard, 'O')) {
            return { score: 10 };
        } else if (availSpots.length === 0) {
            return { score: 0 };
        }

        const moves = [];
        for (let i = 0; i < availSpots.length; i++) {
            const move = {};
            move.index = availSpots[i];
            newBoard[availSpots[i]] = player;

            if (player === 'O') {
                const result = minimax(newBoard, 'X');
                move.score = result.score;
            } else {
                const result = minimax(newBoard, 'O');
                move.score = result.score;
            }

            newBoard[availSpots[i]] = null;
            moves.push(move);
        }

        let bestMove;
        if (player === 'O') {
            let bestScore = -10000;
            for (let i = 0; i < moves.length; i++) {
                if (moves[i].score > bestScore) {
                    bestScore = moves[i].score;
                    bestMove = i;
                }
            }
        } else {
            let bestScore = 10000;
            for (let i = 0; i < moves.length; i++) {
                if (moves[i].score < bestScore) {
                    bestScore = moves[i].score;
                    bestMove = i;
                }
            }
        }

        return moves[bestMove];
    }

    function checkWin(board, player) {
        return winningConditions.some(condition => {
            return condition.every(index => board[index] === player);
        });
    }

    cells.forEach(cell => cell.addEventListener('click', handleCellClick));
    restartButton.addEventListener('click', restartGame);
    twoPlayerModeButton.addEventListener('click', () => setMode('twoPlayer'));
    vsComputerModeButton.addEventListener('click', () => setMode('vsComputer'));
});
