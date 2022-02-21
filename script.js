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
    return { getBoard, move, clear, getMoves }

})();

const GameController = (() => {
    let players = []
    let activePlayer;
    let inactivePlayer;
    let winnerFound = false;
    const createPlayer = (name, symbol) => {
        players.push(Player(name, symbol));

    }
    const removePlayers = () => {
        players.splice(0, 2);
    }
    const getPlayers = () => players;

    const checkForWinner = () => {
        let gameboard = Gameboard.getBoard();
        for (let i = 0; i <= 2; i++) {
            if (gameboard[0][i] == gameboard[1][i] && gameboard[1][i] == gameboard[2][i]) { //check vertical
                gameOver(gameboard[0][i]);
                winnerFound = true;
            }
            if (gameboard[i][0] === gameboard[i][1] && gameboard[i][1] === gameboard[i][2]) { //check horizontal
                gameOver(gameboard[i][0]);
                winnerFound = true;
            }
            if (gameboard[0][0] === gameboard[1][1] && gameboard[1][1] === gameboard[2][2]) { //check diaganol
                gameOver(gameboard[0][0]);
                winnerFound = true;
            }
            if (gameboard[0][2] === gameboard[1][1] && gameboard[1][1] === gameboard[2][0]) { //check diaganol
                gameOver(gameboard[0][2]);
                winnerFound = true;
            }

        }
        if (winnerFound === false && Gameboard.getMoves() === 9) {
            gameOver('draw');
        }
    }
    const setActivePlayer = (index) => {
        activePlayer = players[index];
    }
    const getActivePlayer = () => activePlayer;
    const setInactivePlayer = () => {
        players.forEach(player => {
            if (player.getName() != getActivePlayer().getName()) {
                inactivePlayer = player;
            }
        })
    }
    const getInactivePlayer = () => inactivePlayer;
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
    const resetWinnerFound = () => {
        if (winnerFound === true) {
            winnerFound = false;
        }
    }
    return { checkForWinner, createPlayer, getPlayers, removePlayers, setActivePlayer, getActivePlayer, setInactivePlayer, getInactivePlayer, changeActivePlayer, resetWinnerFound }
})();

const Player = (name, symbol) => { // player contructor
    const getName = () => name;
    const setSymbol = (symbol) => this.symbol = symbol;
    const getSymbol = () => symbol;
    let setPosition = (x, y) => {
        return [x, y];
    }

    return { getName, setSymbol, setPosition, getSymbol, }
}

const displayController = (() => {

    const playerInput = document.querySelector(".player-input");
    const playerOneX = document.querySelector("#player-one-name");
    const playerTwoO = document.querySelector("#player-two-name");
    const playButton = document.querySelector('#play');
    const newGameBtn = document.querySelector("#new-game");
    const controls = document.querySelector(".controls")
    const buttonInit = () => {

        
        newGameBtn.addEventListener('click', () => {
            newGameBtn.classList.add('hidden');
        })
        newGameBtn.addEventListener("click", Gameboard.clear());
        newGameBtn.addEventListener("click", deleteGrid());
        newGameBtn.addEventListener("click", createGrid());
        newGameBtn.addEventListener("click", GameController.removePlayers());
        newGameBtn.addEventListener("click", () => {
            controls.classList.add("hidden");
            playerInput.classList.remove("hidden");
        });
       
      

        const createPlayer = () => {

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
                controls.classList.remove("hidden")
            }
        }
        playButton.addEventListener('click', createPlayer);
        playButton.addEventListener('click', showActivePlayer);

        updateGrid();
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

    const blockHightlight = () => {
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
        let activeSymbol = GameController.getActivePlayer().getSymbol();
        Gameboard.move(event.target.value, activeSymbol);
        event.target.value = activeSymbol;
        event.target.classList.remove('empty');
        GameController.changeActivePlayer();
        GameController.setInactivePlayer();
        updateGrid();
        showActivePlayer();
        GameController.checkForWinner();
        event.target.removeEventListener('click', blockMove);

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
            GameController.resetWinnerFound();
            Gameboard.clear();
            deleteGrid();
            createGrid();
            displayPlayers();
            addBlockListener();
            deletePlayerDisplay();
            displayPlayers();
            blockHightlight();
            showActivePlayer();
            gameOver.classList.add('hidden');
            controls.classList.remove("hidden");
        });

        newNames.addEventListener('click', () => {
      buttonInit();      
      playerInput.classList.remove("hidden");
      gameOver.classList.add('hidden');
    })}

    return { createGrid, deleteGrid, buttonInit, displayPlayers, deletePlayerDisplay, updateGrid, gameOverScreen }
})();

displayController.buttonInit();

