const Gameboard = (() => {
    let gameboard = [[1, 2, 3], [4, 5, 6], [7, 8, 9]];

    const getBoard = () => {
        return gameboard
    }

    const move = ([x, y], symbol) => {
        gameboard[x][y] = symbol;
    }
    const clear = () => {
        gameboard.splice(0, 3);
        gameboard.push([1, 2, 3], [4, 5, 6], [7, 8, 9]);
    }
    return { getBoard, move, clear }

})();

const GameController = (() => { 
    let players = []
    let activePlayer;
    let inactivePlayer;
    const createPlayer = (name, symbol, active) => {
        players.push(Player(name, symbol, active));

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
            }
            if (gameboard[i][0] === gameboard[i][1] && gameboard[i][1] === gameboard[i][2]) { //check horizontal
                gameOver(gameboard[i][0]);
            }

            if (gameboard[0][0] === gameboard[1][1] && gameboard[1][1] === gameboard[2][2]) { //check diaganol
                gameOver(gameboard[0][0]);
            }
            if (gameboard[0][2] === gameboard[1][1] && gameboard[1][1] === gameboard[2][0]) { //check diaganol
                gameOver(gameboard[0][2]);
            }
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
                displayController.gameOverScreen(player.getName())
            }
        })
        displayController.buttonInit();
    }
    return { checkForWinner, createPlayer, getPlayers, removePlayers, setActivePlayer, getActivePlayer, setInactivePlayer, getInactivePlayer, changeActivePlayer }
})();

const Player = (name, symbol) => {
    const getName = () => name;
    const setSymbol = (symbol) => this.symbol = symbol;
    const getSymbol = () => symbol;
    let setPosition = (x, y) => {
        return [x, y];
    }

    return { getName, setSymbol, setPosition, getSymbol, }
}

const displayController = (() => {

    const buttonInit = () => {

        const newGameBtn = document.createElement("button");
        newGameBtn.textContent = "New Game";
        newGameBtn.setAttribute("id", "new-game");
        document.querySelector(".controls").appendChild(newGameBtn);
        newGameBtn.addEventListener("click", Gameboard.clear());
        newGameBtn.addEventListener("click", displayController.deleteGrid());
        newGameBtn.addEventListener("click", displayController.createGrid());
        newGameBtn.addEventListener("click", GameController.removePlayers());
        newGameBtn.addEventListener("click", () => {
            playerOneInput.classList.remove("hidden")
        });
        newGameBtn.addEventListener("click", () => {
            newGameBtn.remove()
        });
        const playerOneInput = document.querySelector(".player-one-input");
        const playerOneX = document.querySelector("#player-one-x");
        const playerOneO = document.querySelector("#player-one-o");

        const createPlayerX = () => {
            GameController.removePlayers();
            GameController.createPlayer('Player One', 'x');
            GameController.createPlayer('Player Two', 'o');
            GameController.setActivePlayer(0);
            playerOneInput.classList.add('hidden');
            blockListener();
            deletePlayerDisplay();
            displayPlayers();
            blockHightlight();
            
        }

        const createPlayerO = () => {
            GameController.removePlayers();
            GameController.createPlayer('Player One', 'o');
            GameController.createPlayer('Player Two', 'x');
            GameController.setActivePlayer(0);
            playerOneInput.classList.add('hidden');
            blockListener();
            deletePlayerDisplay();
            displayPlayers();
            blockHightlight();

        }

        playerOneX.addEventListener('click', createPlayerX);
        playerOneO.addEventListener('click', createPlayerO);
        playerOneO.addEventListener('click', showActivePlayer);
        playerOneO.addEventListener('click', showActivePlayer);
        playerOneX.addEventListener('click', () => {
            playerOneX.removeEventListener('click', createPlayerX)
            playerOneO.removeEventListener('click', createPlayerO)
        });
        playerOneO.addEventListener('click', () => {
            playerOneX.removeEventListener('click', createPlayerX)
            playerOneO.removeEventListener('click', createPlayerO)
        })
        
        


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
    const blockListener = () => {

        const blocks = document.querySelectorAll(".block")
        blocks.forEach(block => {
            block.addEventListener('click', blockMove)
            block.addEventListener('click', blockHightlight)
        })

    }

    const blockHightlight = () => {
        const blocks = document.querySelectorAll(".block");
        blocks.forEach(block => {
            if (GameController.getActivePlayer().getName() === "Player One") {
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
        let activePlayer = GameController.getActivePlayer().getName();
           if (player.getName() === activePlayer) {
               const players = document.querySelectorAll('.player')
               players.forEach(player => {
                player.classList.remove('active-two');
                player.classList.remove('active-one');
                   if (player.value === activePlayer && activePlayer === "Player One") {
                       player.classList.add('active-one');
                   }
                   if (player.value === activePlayer && activePlayer === "Player Two") {
                    player.classList.add('active-two');  
                   }
               })
           }
       })
    }

    const gameOverScreen = (player) => {
        const gameOver = document.querySelector('.gameover');
        const gameOverTitle = document.createElement('h1');
        const playerWins = document.createElement('p');
        gameOverTitle.textContent = "Game Over!";
        playerWins.textContent = `${player} wins!`
        gameOver.appendChild(gameOverTitle);
        gameOver.appendChild(playerWins);
        gameOver.classList.remove('hidden');
    }

    return { createGrid, deleteGrid, buttonInit, displayPlayers, deletePlayerDisplay, updateGrid, gameOverScreen }
})();

displayController.buttonInit();

