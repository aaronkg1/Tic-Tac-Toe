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
                return gameOver();
            }
            if (gameboard[i][0] === gameboard[i][1] && gameboard[i][1] === gameboard[i][2]) { //check horizontal
                return gameOver();
            }

            if (gameboard[0][0] === gameboard[1][1] && gameboard[1][1] === gameboard[2][2]) { //check diaganol
                return gameOver();
            }
            if (gameboard[0][2] === gameboard[1][1] && gameboard[1][1] === gameboard[2][0]) { //check diaganol
                return gameOver();
            }

        }

    }

    const setActivePlayer = (index) => {
        activePlayer = players[index];
    }

    const getActivePlayer = () => activePlayer;

    const playRound = (symbol, coordinates) => {
        if (activePlayer.getSymbol() = "x") {
            Gameboard.move(coordinates, "x")


        }

    }

    const changeActivePlayer = () => {
        if (players.indexOf(activePlayer) === 0) {
            setActivePlayer(1);
        }

        else if (players.indexOf(activePlayer) === 1) {
            setActivePlayer(0);
        }
    }

    const gameOver = () => {
        console.log("Game Over");
        displayController.buttonInit();
    }


    return { checkForWinner, createPlayer, getPlayers, removePlayers, setActivePlayer, getActivePlayer, changeActivePlayer }

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

        }

        playerOneX.addEventListener('click', createPlayerX);
        playerOneO.addEventListener('click', createPlayerO);
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
            const playerDisplay = document.querySelector("#player-display");
            playerContainer.textContent = `${player.getName()} : ${player.getSymbol()}`;
            playerDisplay.appendChild(playerContainer);

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

            else return
        })

    }
    const blockListener = () => {

        const blocks = document.querySelectorAll(".block")
        blocks.forEach(block => {
            block.addEventListener('click', blockMove)
        })

    }

    const blockMove = (event) => {
        let activeSymbol = GameController.getActivePlayer().getSymbol();
        Gameboard.move(event.target.value, activeSymbol);
        event.target.value = activeSymbol;
        GameController.changeActivePlayer();
        updateGrid();
        GameController.checkForWinner();
        event.target.removeEventListener('click', blockMove);
    }

    return { createGrid, deleteGrid, buttonInit, displayPlayers, deletePlayerDisplay, updateGrid }
})();

displayController.buttonInit();

