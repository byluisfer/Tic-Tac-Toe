let btnRef = document.querySelectorAll(".button-config");
let startRef = document.querySelector(".alert");
let newgameBtn = document.getElementById("new-game");
let msgRef = document.getElementById("message");
let xTurn = true;
let count = 0;
let gameOver = false;
let xStartsNext = true;
let playerVsAi = false;

let winningPattern = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

// Event to start a game between two players, hides the main menu and shows the game board
document
  .getElementById("player-vs-player")
  .addEventListener("click", function () {
    resetGame();
    playerVsAi = false;
    document.querySelector(".main-menu").style.display = "none";
    document.querySelector(".table").style.display = "flex";
    updateActivePlayerIndicator();
  });

// Event to return to the main menu from the game
document.getElementById("back-to-menu").addEventListener("click", function () {
  resetGame();
  document.querySelector(".main-menu").style.display = "flex";
  document.querySelector(".table").style.display = "none";
});

/**
 * Enables all game buttons, clears their text, removes winner class, and hides the start alert container
 */
function enableButtons() {
  btnRef.forEach((element) => {
    element.innerText = "";
    element.disabled = false;
    element.classList.remove("winner");
  });
  startRef.classList.add("hide");
}

// Event to start a new game from the corresponding button
newgameBtn.addEventListener("click", () => {
  resetGame();
  if (playerVsAi) {
    xTurn = true;
    updateActivePlayerIndicator();
    if (!xTurn) aiMove();
  }
});

/**
 * Disables all game buttons and shows the startup alert container
 */
function disableButtons() {
  btnRef.forEach((element) => (element.disabled = true));
  startRef.classList.remove("hide");
}

/**
 * Executes when a player wins. Disables buttons, highlights the winning line, and displays the winner message
 * @param {string} letter The player symbol ('X' or 'O') that won
 * @param {Array<number>} winningLine The indices of the winning pattern
 */
function winFunction(letter, winningLine) {
  disableButtons();
  winningLine.forEach((index) => btnRef[index].classList.add("winner"));
  msgRef.innerHTML = letter === "X" ? "X Wins" : "O Wins";
  gameOver = true;
}

/**
 * Executes when the game is a draw. Disables buttons, and displays the draw message
 */
function drawFunction() {
  disableButtons();
  msgRef.innerText = "Draw";
  gameOver = true;
}

/**
 * Determines if the game is a draw or whether any of the victory criteria are met by the present board state
 */
function winChecker() {
  for (let line of winningPattern) {
    let [element1, element2, element3] = [
      btnRef[line[0]].innerText,
      btnRef[line[1]].innerText,
      btnRef[line[2]].innerText,
    ];
    if (element1 !== "" && element2 !== "" && element3 !== "") {
      if (element1 === element2 && element2 === element3) {
        winFunction(element1, line);
        return;
      }
    }
  }
  if (count === 9) {
    drawFunction();
  }
}

/**
 * Updates the display to indicate which player's turn it is (X or O)
 */
function updateActivePlayerIndicator() {
  const player1Div = document.getElementById("playerX");
  const player2Div = document.getElementById("playerO");
  if (xTurn) {
    player1Div.classList.add("active");
    player2Div.classList.remove("active");
  } else {
    player1Div.classList.remove("active");
    player2Div.classList.add("active");
  }
}

/**
 * Clears the game board and resets the parameters, returning the game to its original state
 */
function resetGame() {
  enableButtons();
  count = 0;
  gameOver = false;
  startRef.classList.add("hide");
  xTurn = xStartsNext;
  xStartsNext = !xStartsNext;
  updateActivePlayerIndicator();
}

// Add click events to each game button to mark X or O and check the game state
btnRef.forEach((element) => {
  element.addEventListener("click", () => {
    if (playerVsAi && !xTurn) {
      return;
    }
    if (!element.innerText) {
      element.innerText = xTurn ? "X" : "O";
      element.disabled = true;
      count += 1;
      winChecker();
      if (playerVsAi) {
        xTurn = !xTurn;
        updateActivePlayerIndicator();
        if (!xTurn) setTimeout(aiMove, 200);
      } else {
        xTurn = !xTurn;
        updateActivePlayerIndicator();
      }
    }
  });
});

//
document.getElementById("player-vs-ai").addEventListener("click", function () {
  xStartsNext = true;
  resetGame();
  playerVsAi = true;
  document.querySelector(".main-menu").style.display = "none";
  document.querySelector(".table").style.display = "flex";
  xTurn = true;
  updateActivePlayerIndicator();
  if (!xTurn) aiMove();
});

/**
 * Manages the logic of AI movement. chooses an arbitrary blank button to be the AI's movement.
 */
function aiMove() {
  if (gameOver) return;
  let availableButtons = Array.from(btnRef).filter((btn) => !btn.innerText);
  if (availableButtons.length === 0) return;
  let randomBtn =
    availableButtons[Math.floor(Math.random() * availableButtons.length)];
  randomBtn.innerText = "O";
  randomBtn.disabled = true;
  count += 1;
  xTurn = true;
  updateActivePlayerIndicator();
  winChecker();
}
