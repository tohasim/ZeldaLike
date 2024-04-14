"use strict";
window.addEventListener("load", init);

//#region CONTROLLER
function init() {
	console.log("Js kører");
	requestAnimationFrame(tick);
	document.addEventListener("keydown", keyDown);
	document.addEventListener("keyup", keyUp);
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
}
//#endregion

//#region VIEW
function displayPlayerAtPosition() {
	const visualPlayer = document.getElementById("player");
	visualPlayer.style.translate = `${player.x}px ${player.y}px`;
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
	speed: 200,
	moving: false,
	direction: undefined,
};

function movePlayer(deltaTime) {
	player.moving = false;

	const newPos = {
		x: player.x,
		y: player.y,
	};

	if (controls.left) {
		player.moving = true;
		newPos.x -= player.speed * deltaTime;
		player.direction = "left";
	}
	if (controls.right) {
		player.moving = true;
		newPos.x += player.speed * deltaTime;
		player.direction = "right";
	}
	if (controls.up) {
		player.moving = true;
		newPos.y -= player.speed * deltaTime;
		player.direction = "up";
	}
	if (controls.down) {
		player.moving = true;
		newPos.y += player.speed * deltaTime;
		player.direction = "down";
	}

	if (canMoveTo(newPos)) {
		player.x = newPos.x;
		player.y = newPos.y;
	}
}

function canMoveTo(position) {
	if (
		position.x < 0 ||
		position.x > 470 ||
		position.y < 0 ||
		position.y > 330
	) {
		player.moving = false;
		return false;
	}
	return true;
}
//#endregion
