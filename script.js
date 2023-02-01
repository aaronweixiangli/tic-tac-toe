/*----- constants -----*/
const COLORS = {
    'null': 'black',
    '1': 'purple',
    '-1': 'yellow'
  }
  const PLAYERS = {
    'null': '',
    '1': 'X',
    '-1': 'O'
  }
  
  const WINNING_COMBINATIONS = [
    [[0,0], [0,1], [0,2]], //first row
    [[1,0], [1,1], [1,2]], //second row
    [[2,0], [2,1], [2,2]], //third row
    [[0,0], [1,0], [2,0]], //first column
    [[0,1], [1,1], [2,1]], //second column
    [[0,2], [1,2], [2,2]], //third column
    [[0,2], [1,1], [2,0]], //diagonal NESW
    [[0,0], [1,1], [2,2]]  //diagonal NWSE
  ]
  
  /*----- state variables -----*/
  let board; //array of 3x3 matrix
  let turn; //1 or -1
  let winner; //null = no winner; 1 or -1 = winner; 'T' = Tie
  
  /*----- cached elements  -----*/
  const messageEl = document.querySelector('h1');
  const divEls = [...document.querySelectorAll('#board > div')];
  const playAgainBtn = document.querySelector('button');
  
  /*----- event listeners -----*/
  document.getElementById('board').addEventListener('click', handleDrop);
  playAgainBtn.addEventListener('click', init);
  
  /*----- functions -----*/
  init();
  // Initialize all states and render()
  function init() {
    board = [
      [null, null, null],
      [null, null, null],
      [null, null, null]
    ];
    turn = 1;
    winner = null;
    render();
  }
  
  function render() {
    renderBoard();
    renderMessage();
    renderControls();
  }
  
  function renderBoard() {
    board.forEach(function(rowArr, rowIdx) {
      // Iterate over the cells in the cur column (colArr)
      rowArr.forEach(function(cellVal, colIdx) {
        const cellId = `r${rowIdx}c${colIdx}`;
        const cellEl = document.getElementById(cellId);
        cellEl.style.color = COLORS[cellVal];
        cellEl.innerText = PLAYERS[cellVal];
      });
    })
  }
  
  function renderMessage() {
    if (winner === 'T') {
      messageEl.innerText = "It's a Tie!!!";
    } else if (winner) {
      messageEl.innerHTML = `<span style="color: ${COLORS[winner]}">${PLAYERS[winner].toUpperCase()}</span> Wins!`;
    } else {
      // Game is in play
      messageEl.innerHTML = `<span style="color: ${COLORS[turn]}">${PLAYERS[turn].toUpperCase()}</span>'s Turn`;
    }
  }
  
  function renderControls() {
    // Ternary expression is the go to when you want 1 of 2 values return
    // <conditional exp> ? <truthy exp> : <falsey exp>
    playAgainBtn.style.visibility = winner ? 'visible': 'hidden';
  }
  
  // In response to user interaction, update all impacted
  // state, then call render();
  function handleDrop(evt) {
    const rowIdx = Math.floor(divEls.indexOf(evt.target) / 3);
    // Guards...
    if (rowIdx === -1 || winner) return;
    // Shortcuts to the row array
    const rowArr = board[rowIdx];
    // Find the index of the column
    const colIdx = Math.floor(divEls.indexOf(evt.target) - (rowIdx * 3));
    if (board[rowIdx][colIdx] !== null) return;
    // Update the board state with the cur player value (turn)
    rowArr[colIdx] = turn;
    console.log(rowIdx, colIdx);
    // Switch player turn
    turn *= -1;
    // Check for winner
    winner = getWinner(rowIdx, colIdx);
    render();
  }
  
  // Check for winner in board state and 
  // return null if no winner, 1/-1 if a player has won, 'T' if tie
  function getWinner(rowIdx, colIdx) {
    return checkWinningCombination(rowIdx, colIdx) ||
      checkTie();
  }
  
  
  function checkWinningCombination(rowIdx, colIdx) {
    let winner = null;
    let player = board[rowIdx][colIdx];
    WINNING_COMBINATIONS.forEach(function(arr) {
      let total = 0;
      arr.forEach(function([row,col]) {
        total += board[row][col];
      });
      if (Math.abs(total) === 3) {
        winner = player;
      }
    })
    return winner;
  }
  
  function checkTie(){
    let isTie = true;
    for (let rowArr of board) {
      for (let cell of rowArr) {
        if (cell === null) {
          isTie = false;
        }
      }
    }
    return isTie ? 'T' : null;
  }