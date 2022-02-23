const Gameboard = (() => {
    let gameboard = [[1, 2, 3], [4, 5, 6], [7, 8, 9]];
    let moves = 0;

    const getBoard = () => {
        return gameboard
    }

    const move = ([x, y], symbol) => {
        gameboard[x][y] = symbol;
        moves++;
    }

    const getMoves = () => {
        return moves;
    }

    const clear = () => {
        gameboard.splice(0, 3);
        gameboard.push([1, 2, 3], [4, 5, 6], [7, 8, 9]);
        moves = 0;
    }

    return { getBoard, move, clear, getMoves, }

})();

const GameController = (() => {
    let players = []
    let activePlayer;
    let isAIActive = false;
    const createPlayer = (name, symbol) => {
        players.push(Player(name, symbol));
    }
    const removePlayers = () => {
        players.splice(0, 2);
    }
    const getPlayers = () => players;
    const checkForWinner = (gameboard) => {
        let winnerFound = false;
        for (let i = 0; i <= 2; i++) {
            if (gameboard[0][i] == gameboard[1][i] && gameboard[1][i] == gameboard[2][i]) { //check vertical
                winnerFound = true;
                if (gameboard[0][i] == 'x') {
                
                    return 10;
                }
                else {
                    return -10;
                };
            }
            if (gameboard[i][0] == gameboard[i][1] && gameboard[i][1] == gameboard[i][2]) { //check horizontal
                winnerFound = true;
                if (gameboard[i][0] == 'x') {
                    return 10;
                }
                else { 
                    return -10
                };
            }
            if (gameboard[0][0] === gameboard[1][1] && gameboard[1][1] === gameboard[2][2]) { //check diaganol
                winnerFound = true;
                if (gameboard[0][0] == 'x') {
                    return 10;
                }
                else {
                    return -10
                };
            }
            if (gameboard[0][2] === gameboard[1][1] && gameboard[1][1] === gameboard[2][0]) { //check diaganol
                winnerFound = true;
                if (gameboard[0][2] == 'x') {
                    return 10;
                }
                else {
                    return -10
                }
            }
            else if (winnerFound = false) {
                return 0;
            }
        }
        return 0;

        }
    const setActivePlayer = (index) => {
        activePlayer = players[index];
    }
    const getActivePlayer = () => activePlayer;
    const changeActivePlayer = () => {
        if (players.indexOf(activePlayer) === 0) {
            setActivePlayer(1);
        }
        else if (players.indexOf(activePlayer) === 1) {
            setActivePlayer(0);
        }
    }
    const gameOver = (symbol) => {
        players.forEach(player => {
            if (player.getSymbol() === symbol) {
                displayController.gameOverScreen(`${player.getName()} wins!`)
            }
            else if (symbol === "draw") {
                displayController.gameOverScreen('Draw!');
            }
        })
    }

    const activateAI = () => {
        isAIActive = true;
    }

    const deactivateAI = () => {
        isAIActive = false;
    }
    const getAIState = () => {
        return isAIActive;
    }
    const minimax = (board, depth, isMax) => {   
        let score = checkForWinner(board);
        if (score == 10) {
            return score - depth; 
        }
        if (score == -10) {
            return score + depth;            
        }
        if (isFull(board)) {
            return 0;
        }
        if (isMax) {
            let best = -10000;
            for (let i = 0; i <= 2; i++) {
                for (let j = 0; j <= 2; j++) {
                   {
                    if (board[i][j] != 'x' && board[i][j] != 'o') {
                        const originalValue = board[i][j];
                        board[i][j] = 'o';
                        best = Math.max(best, minimax(board, depth + 1,!isMax));
                        board[i][j] = originalValue;                               
                    }
                }
                }
            }
            return best;
        }
        else {
            let best = 10000;
            for (let i = 0; i <= 2; i++) {
                for (let j = 0; j <= 2; j++) {
                    if (depth > 9) {
                        return
                    }
                    else {
                    if (board[i][j] != 'x' && board[i][j] != 'o') {
                        const originalValue = board[i][j];
                        board[i][j] = 'x';
                        best = Math.min(best, minimax(board ,depth + 1 ,!isMax));
                        board[i][j] = originalValue;   
                    }
                }
                }
            }
            return best;
        }
    }
    const findBestMove = () => {
        let board = Gameboard.getBoard();
        let bestVal = -10000;
        for (let i = 0; i <= 2; i++) {
            for (let j = 0; j <= 2; j++) {
                const originalValue = board[i][j];
                if (board[i][j] != 'x' && board[i][j] != 'o') {
                    board[i][j] = 'x';
                    let moveVal = minimax(board ,0 , false);
                    board[i][j] = originalValue;
                    if (moveVal > bestVal) {
                        bestRow = i;
                        bestCol = j;
                        bestVal = moveVal;
                    }
                }
            }
        }
        return [bestRow, bestCol];
    }
    const isFull = (board) => {
       for (let i=0; i<3; i++) {
           for (let j=0; j<3; j++) {
               if (board[i][j] != 'x' || board[i][j] != 'o') {
                   return false;
               }
               else return true;
           }
       }  
    }
    return { checkForWinner, createPlayer, getPlayers, removePlayers, setActivePlayer, getActivePlayer, changeActivePlayer, activateAI, deactivateAI, getAIState, findBestMove, gameOver }
})();

const Player = (name, symbol) => { // player contructor
    const score = 0;
    const getName = () => name;
    const setSymbol = (symbol) => this.symbol = symbol;
    const getSymbol = () => symbol;
    const setScore = (score) => score += 10;
    const getScore = () => score;

    return { getName, setSymbol, getSymbol, setScore, getScore }
}
const displayController = (() => { //Module controlling DOM manipulation

    const playerInput = document.querySelector(".player-input");
    const playerOneX = document.querySelector("#player-one-name");
    const playerTwoO = document.querySelector("#player-two-name");
    const playButton = document.querySelector('#play');
    const newGameBtn = document.querySelector("#new-game");
    const controls = document.querySelector(".controls");
    const computerOrPlayer = document.querySelector(".player-or-computer");
    const versusComputerWindow = document.querySelector('.versus-computer');
    const versusPlayer = document.querySelector('#vs-player-btn');
    const versusComputer = document.querySelector('#vs-computer-btn');
    const onePlayerName = document.querySelector('#one-player-name');
    const playComputerButton = document.querySelector('#play-comp');

    const buttonInit = () => {


        newGameBtn.addEventListener('click', () => {
            newGameBtn.classList.add('hidden');
            computerOrPlayer.classList.remove('hidden');
        })

        versusPlayer.addEventListener("click", Gameboard.clear());
        versusPlayer.addEventListener("click", deleteGrid());
        versusPlayer.addEventListener("click", createGrid());
        versusPlayer.addEventListener("click", GameController.removePlayers());
        versusPlayer.addEventListener("click", () => {
            GameController.deactivateAI();
            controls.classList.add("hidden");
            computerOrPlayer.classList.add("hidden");
            playerInput.classList.remove("hidden");
        });

        playButton.addEventListener('click', createPlayer);
        playButton.addEventListener('click', showActivePlayer);

        versusComputer.addEventListener('click', GameController.activateAI);
        versusComputer.addEventListener("click", Gameboard.clear());
        versusComputer.addEventListener("click", deleteGrid());
        versusComputer.addEventListener("click", createGrid());
        versusComputer.addEventListener("click", GameController.removePlayers());

        versusComputer.addEventListener('click', () => {
            computerOrPlayer.classList.add("hidden");
            versusComputerWindow.classList.remove("hidden");
        })

        playComputerButton.addEventListener('click', createPlayer);
        playComputerButton.addEventListener('click', showActivePlayer);
        playComputerButton.addEventListener('click', () => {
            versusComputerWindow.classList.add('hidden');

        })


        updateGrid();
    }

    const createPlayer = () => { //Creates players within Gamecontroller using input values

        if (GameController.getAIState() === false) {
            if (playerOneX.value === playerTwoO.value) {
                alert('Players must have different names');
            }
            else {
                GameController.removePlayers();
                GameController.createPlayer(playerOneX.value, 'x');
                GameController.createPlayer(playerTwoO.value, 'o');
                GameController.setActivePlayer(0);
                playerInput.classList.add('hidden');
                addBlockListener();
                deletePlayerDisplay();
                displayPlayers();
                blockHightlight();
                controls.classList.remove("hidden");
            }
        }
        else if (GameController.getAIState() === true) {
            GameController.removePlayers();
            GameController.createPlayer(onePlayerName.value, 'x');
            GameController.createPlayer('Computer', 'o');
            GameController.setActivePlayer(0);
            versusComputerWindow.classList.add('.hidden');
            addBlockListener();
            deletePlayerDisplay();
            displayPlayers();
            blockHightlight();
            controls.classList.remove("hidden");

        }
    }
    const createGrid = () => {

        const gameContainer = document.querySelector("#game-grid");
        for (let i = 0; i <= 2; i++) {
            for (let j = 0; j <= 2; j++) {
                const block = document.createElement('div');
                block.classList.add('block');
                block.classList.add('empty');
                gameContainer.appendChild(block);
                block.value = [i, j];
                const symbol = document.createElement('span');
                symbol.classList.add('material-icons-outlined')
                block.appendChild(symbol);

            }
        }
    }

    const deleteGrid = () => {
        const gameContainer = document.querySelector("#game-grid");
        gameContainer.innerHTML = " ";
    }

    const displayPlayers = () => {
        GameController.getPlayers().forEach((player) => {
            const playerContainer = document.createElement('div');

            playerContainer.classList.add('player');
            playerContainer.value = player.getName();
            const playerDisplay = document.querySelector("#player-display");
            const displaySymbol = document.createElement('span');
            displaySymbol.classList.add('material-icons-outlined')
            if (player.getSymbol() === "x") {
                displaySymbol.textContent = "close";
            }
            else if (player.getSymbol() === "o") {
                displaySymbol.textContent = "radio_button_unchecked"
            }
            playerContainer.textContent = `${player.getName()} : `;
            playerContainer.appendChild(displaySymbol);
            playerDisplay.appendChild(playerContainer);

            if (player === GameController.getActivePlayer()) {
                playerContainer.classList.add("active")
                playerContainer.classList.add('active-one')
            }
        });

    }

    const deletePlayerDisplay = () => {
        const playerDisplay = document.querySelector("#player-display");
        playerDisplay.innerHTML = " ";
    }

    const updateGrid = () => {
        const blocks = document.querySelectorAll(".block")

        blocks.forEach(block => {

            symbol = block.querySelector("span");
            if (block.value === "x") {
                symbol.textContent = "close";
            }
            else if (block.value === "o") {
                symbol.textContent = "radio_button_unchecked";
            }

        })



    }
    const addBlockListener = () => {
        const blocks = document.querySelectorAll(".block")
        blocks.forEach(block => {
            block.addEventListener('click', blockMove)
            block.addEventListener('click', blockHightlight)
        })
    }
    const removeBlockListener = () => {
        const blocks = document.querySelectorAll(".block")
        blocks.forEach(block => {
            block.removeEventListener('click', blockMove)
            block.removeEventListener('click', blockHightlight)
        })
    }
    const blockHightlight = () => { //highlights the active player
        const blocks = document.querySelectorAll(".block");
        blocks.forEach(block => {
            if (GameController.getActivePlayer().getName() === GameController.getPlayers()[0].getName()) {
                block.classList.remove('player-two');
                block.classList.remove('player-one');
                block.classList.add('player-one');
            }
            else {
                block.classList.remove('player-one');
                block.classList.remove('player-two');
                block.classList.add('player-two');
            }
        })
    }
    const blockMove = (event) => {
        const blocks = document.querySelectorAll(".block");
        let activeSymbol = GameController.getActivePlayer().getSymbol();
        if (GameController.getAIState() === false) {      
            Gameboard.move(event.target.value, activeSymbol);
            event.target.value = activeSymbol;
            event.target.classList.remove('empty');
            GameController.changeActivePlayer();
            updateGrid();
            showActivePlayer();
            if (GameController.checkForWinner(Gameboard.getBoard()) > 0) {
                GameController.gameOver('x');
            }
            else if (GameController.checkForWinner(Gameboard.getBoard()) < 0) {
                GameController.gameOver('o');
            }
            else if (GameController.checkForWinner(Gameboard.getBoard()) == 0 && Gameboard.getMoves() == 9) {
                GameController.gameOver('draw');
            }
            event.target.removeEventListener('click', blockMove);
        }
        else if (GameController.getAIState() === true) {
            Gameboard.move(event.target.value, 'x');
            event.target.value = 'x';
            updateGrid();
            showActivePlayer();
            if (GameController.checkForWinner(Gameboard.getBoard()) > 0) {
                GameController.gameOver('x');
            }
            else if (GameController.checkForWinner(Gameboard.getBoard()) < 0) {
                GameController.gameOver('o');
            }
            else if (GameController.checkForWinner(Gameboard.getBoard()) == 0 && Gameboard.getMoves() == 9) {
                GameController.gameOver('draw');
            }
            
            else {
            GameController.changeActivePlayer();
            showActivePlayer();
            for (let i = 0; i <= 8; i++) {      
                if (blocks[i].value.toString() === GameController.findBestMove().toString()) {
                    blocks[i].value = 'o';
                    blocks[i].removeEventListener('click', blockMove);
                    blocks[i].classList.remove('empty');
                }
            }    
            Gameboard.move(GameController.findBestMove(), 'o');
            updateGrid();
            GameController.changeActivePlayer(); 
            showActivePlayer();

            if (GameController.checkForWinner(Gameboard.getBoard()) > 0) {
                GameController.gameOver('x');
            }
            if (GameController.checkForWinner(Gameboard.getBoard()) < 0) {
                GameController.gameOver('o');
            }
            if (GameController.checkForWinner(Gameboard.getBoard()) == 0 && Gameboard.getMoves() == 9) {
                GameController.gameOver('draw');
            }
        }
        }
    }
    const AIBlockmove = () => {
        let activeSymbol = GameController.getActivePlayer().getSymbol();

        const random = Math.floor(Math.random() * 9);
        const blocks = document.querySelectorAll(".block");
        const blocksArray = Array.from(blocks);
        if (GameController.isThereAWinner() === false && Gameboard.getMoves() < 9) {

            if (blocks[random].value === "o" || blocks[random].value === "x") {
                AIBlockmove();
            }
            else {
                Gameboard.move(blocksArray[random].value, activeSymbol);
                blocks[random].removeEventListener('click', blockMove);
                blocks[random].classList.remove('empty');
                blocks[random].value = activeSymbol;
                updateGrid();
                GameController.changeActivePlayer();
                showActivePlayer();
                GameController.checkForWinner(Gameboard.getBoard());
                blockHightlight();
            }
        }
    }
    const showActivePlayer = () => {
        GameController.getPlayers().forEach(player => {
            let activePlayerName = GameController.getActivePlayer().getName();
            let activePlayerSymbol = GameController.getActivePlayer().getSymbol();
            if (player.getName() === activePlayerName) {
                const players = document.querySelectorAll('.player')
                players.forEach(player => {
                    player.classList.remove('active-two');
                    player.classList.remove('active-one');
                    if (player.value === activePlayerName && activePlayerSymbol === 'x') {
                        player.classList.add('active-one');
                    }
                    if (player.value === activePlayerName && activePlayerSymbol === 'o') {
                        player.classList.add('active-two');
                    }
                })
            }
        })
    }
    const gameOverScreen = (player) => {
        const gameOver = document.querySelector('.gameover')
        const gameOverTitle = document.querySelector('#gameovertitle');
        const playerWins = document.querySelector('#player-wins');
        const rematch = document.querySelector('#rematch');
        const newNames = document.querySelector('#new-names');
        gameOverTitle.textContent = "Game Over!";
        playerWins.textContent = `${player}`
        rematch.textContent = "Rematch?";
        newNames.textContent = "New Names?";
        gameOver.classList.remove('hidden');
        removeBlockListener();
        rematch.addEventListener('click', () => {
            Gameboard.clear();
            deleteGrid();
            createGrid();
            displayPlayers();
            addBlockListener();
            deletePlayerDisplay();
            displayPlayers();
            GameController.setActivePlayer(0);
            blockHightlight();
            showActivePlayer();
            gameOver.classList.add('hidden');
            controls.classList.remove("hidden");
        });
        newNames.addEventListener('click', () => {
            buttonInit();
            playerInput.classList.remove("hidden");
            gameOver.classList.add('hidden');
        })
    }
    return { createGrid, deleteGrid, buttonInit, displayPlayers, deletePlayerDisplay, updateGrid, gameOverScreen, AIBlockmove }
})();

displayController.buttonInit();