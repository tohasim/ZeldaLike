"use strict";
window.addEventListener("load", init);

//#region CONTROLLER
function init() {
  createView();
  requestAnimationFrame(tick);
  document.addEventListener("keydown", keyDown);
  document.addEventListener("keyup", keyUp);
  displayTiles();
}
const controls = {
  left: false,
  right: false,
  up: false,
  down: false,
};

function keyDown(event) {
  switch (event.key) {
    case "ArrowLeft": {
      controls.left = true;
      break;
    }
    case "ArrowRight": {
      controls.right = true;
      break;
    }
    case "ArrowUp": {
      controls.up = true;
      break;
    }
    case "ArrowDown": {
      controls.down = true;
      break;
    }
  }
}

function keyUp(event) {
  switch (event.key) {
    case "ArrowLeft": {
      controls.left = false;
      break;
    }
    case "ArrowRight": {
      controls.right = false;
      break;
    }
    case "ArrowUp": {
      controls.up = false;
      break;
    }
    case "ArrowDown": {
      controls.down = false;
      break;
    }
  }
}

let lastTimestamp = 0;
function tick(timestamp) {
  requestAnimationFrame(tick);
  const deltaTime = (timestamp - lastTimestamp) / 1000;
  lastTimestamp = timestamp;
  movePlayer(deltaTime);
  displayPlayerAtPosition();
  displayPlayerAnimation();
  showDebugging();
}
//#endregion

//#region VIEW

function createView() {
  const background = document.getElementById("background");
  // Create the grid
  for (let row = 0; row < GRID_ROWS; row++) {
    for (let col = 0; col < GRID_COLS; col++) {
      const tile = document.createElement("div");
      tile.classList.add("tile");
      background.appendChild(tile);
    }
  }
  background.style.setProperty("--GRID_COLS", GRID_COLS);
  background.style.setProperty("--GRID_ROWS", GRID_ROWS);
  background.style.setProperty("--TILE_SIZE", TILE_SIZE + "px");
}

function displayTiles() {
  const visualTiles = document.querySelectorAll("#background .tile");

  for (let row = 0; row < GRID_ROWS; row++) {
    for (let col = 0; col < GRID_COLS; col++) {
      const modelTile = getTileAtCoordinate({ row, col });
      const visualTile = visualTiles[row * GRID_COLS + col];

      visualTile.classList.add(getClassForTileType(modelTile));
    }
  }
}

function getClassForTileType(tileType) {
  switch (tileType) {
    case 0:
      return "grass";
    case 1:
      return "path";
    case 2:
      return "stone";
    case 3:
      return "water";
    default:
      return "unknown";
  }
}

function updateView() {}

function displayPlayerAtPosition() {
  const visualPlayer = document.getElementById("player");
  visualPlayer.style.translate = `${player.x - player.regX}px ${
    player.y - player.regY
  }px`;
}

function displayPlayerAnimation() {
  const visualPlayer = document.getElementById("player");
  if (player.moving) {
    visualPlayer.classList = "animate";
    visualPlayer.classList.add(player.direction);
  } else {
    visualPlayer.classList.remove("animate");
  }
}

//#endregion

//#region MODEL
const player = {
  x: 0,
  y: 0,
  regX: 10,
  regY: 24,
  speed: 100,
  moving: false,
  direction: undefined,
};

const tiles = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 0, 0],
  [0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 0, 0],
  [2, 2, 0, 2, 2, 2, 0, 0, 0, 0, 0, 0, 3, 3, 0, 0],
  [2, 2, 0, 2, 2, 2, 0, 0, 1, 0, 0, 0, 3, 3, 0, 0],
  [0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 3, 3, 2, 0],
  [0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 3, 3, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 2, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 2, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
];

const GRID_COLS = tiles[0].length;
const GRID_ROWS = tiles.length;
const TILE_SIZE = 32;

function getTileAtCoordinate({ row, col }) {
  return tiles[row][col];
}

function coordFromPosition(object) {
  return {
    row: Math.floor(object.y / TILE_SIZE),
    col: Math.floor(object.x / TILE_SIZE),
  };
}

function positionFromCoord({ row, col }) {
  return { x: col * TILE_SIZE, y: row * TILE_SIZE };
}

function movePlayer(deltaTime) {
  player.moving = false;

  const newPos = {
    x: player.x,
    y: player.y,
  };

  const diagonalSpeed = (player.speed * Math.sqrt(2)) / 2;

  if (controls.left) {
    player.moving = true;
    newPos.x -= diagonalSpeed * deltaTime;
    player.direction = "left";
  }
  if (controls.right) {
    player.moving = true;
    newPos.x += diagonalSpeed * deltaTime;
    player.direction = "right";
  }
  if (controls.up) {
    player.moving = true;
    newPos.y -= diagonalSpeed * deltaTime;
    player.direction = "up";
  }
  if (controls.down) {
    player.moving = true;
    newPos.y += diagonalSpeed * deltaTime;
    player.direction = "down";
  }

  if (canMoveTo(newPos)) {
    player.x = newPos.x;
    player.y = newPos.y;
  }
}

function canMoveTo({ x, y }) {
  const { row, col } = coordFromPosition({ x, y });
  if (row < 0 || row >= GRID_ROWS || col < 0 || col >= GRID_COLS) {
    return false;
  }
  const tile = getTileAtCoordinate({ row, col });
  switch (tile) {
    case 2:
    case 3:
      return false;
  }
  return true;
}
//#endregion

//#region DEBUGGING
function highlight({ row, col }) {
  const visualTiles = document.querySelectorAll("#background .tile");
  visualTiles[row * GRID_COLS + col].classList.add("highlight");
}

function unhighlight({ row, col }) {
  const visualTiles = document.querySelectorAll("#background .tile");
  visualTiles[row * GRID_COLS + col].classList.remove("highlight");
}

function showDebugging() {
  showDebuggingTileUnderPlayer();
  showPlayerRect();
  showPlayerReg();
}

let lastPlayerCoord = { row: 1, col: 1 };

function showPlayerRect() {
  const player = document.getElementById("player");
  if (!player.classList.contains("showRect")) {
    player.classList.add("showRect");
  }
}

function showPlayerReg() {
  const visualPlayer = document.getElementById("player");
  if (!visualPlayer.classList.contains("showReg")) {
    visualPlayer.classList.add("showReg");
  }
  visualPlayer.style.setProperty("--regX", player.regX + "px");
  visualPlayer.style.setProperty("--regY", player.regY + "px");
}

function showDebuggingTileUnderPlayer() {
  const playerCoord = coordFromPosition(player);
  if (
    playerCoord.row !== lastPlayerCoord.row ||
    playerCoord.col !== lastPlayerCoord.col
  ) {
    unhighlight(lastPlayerCoord);
    highlight(playerCoord);
  }
  lastPlayerCoord = playerCoord;
}
//#endregion
