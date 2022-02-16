// get canvas
let mainCanvas = document.getElementById("canvas-animations");
let ctx = mainCanvas.getContext("2d");

// get inputs
let keydownOutput = document.getElementById("keydown-output");
let keyupOutput = document.getElementById("keyup-output");

// get image
let image = document.getElementById("goomy");

// play position and movement
let playerXDir = 0;
let playerYDir = 0;
let playerSpeed = 2;
let playerX = 250;
let playerY = 250;
const playerWidth = 20;
const playerHeight = 20;

// ball position and movement
let ballX = 150;
let ballY = 150;
let ballXDir = 1 + Math.random();
let ballYDir = 1 + Math.random();
let ballSpeed = 1;
const ballRadius = 20; // defying code norms constants should be lowercase change my mind

// image settings
const imageHeight = ballRadius * 2;
const imageWidth = ballRadius * 2;

// random number generater
function randomNum() {
    return -(Math.random() * (1.155 - 0.85) + 0.85);
}

// key press
function keyPressed(event) {
    let keydown = event.keyCode;
    keydownOutput.innerHTML = "Key down code: " + keydown;

    switch (keydown) {
        case 65:
            playerXDir = -1;
            break;
        case 68:
            playerXDir = 1;
            break;
        case 87:
            playerYDir = -1;
            break;
        case 83:
            playerYDir = 1;
            break;
    }
}

function keyReleased(event) {
    let keyup = event.keyCode;
    keyupOutput.innerHTML = "Key up code: " + keyup;

    switch (keyup) {
        case 65:
        case 68:
            playerXDir = 0;
            break;
        case 87:
        case 83:
            playerYDir = 0;
            break;
    }
}

// updates block cords
function movePlayer() {
    if (playerX + (playerXDir * playerSpeed) <= 5 + ballRadius * 2 || playerX + (playerXDir * playerSpeed) >= 495 - ballRadius * 2) {
        console.log("Collision");
    } else {
        playerX += playerXDir * playerSpeed;
    }
    if (playerY + (playerYDir * playerSpeed) <= 5 + ballRadius * 2 || playerY + (playerYDir * playerSpeed) >= 495 - ballRadius * 2) {
        console.log("Collision");
    } else {
        playerY += playerYDir * playerSpeed;
    }
}

// draws block from cords
function drawPlayer() {
    ctx.fillRect(playerX, playerY, playerWidth, playerHeight);
}

function wallCollision(ballPosition, ballDir) {
    if (ballPosition + (ballDir * ballSpeed) <= (ballRadius / 2) || ballPosition + (ballDir * ballSpeed) >= 500 - (ballRadius / 2)) {
        return false;
    } else {
        return true;
    }
}

function playerCollision() {
    if (ballX + ballRadius >= playerX && ballX - ballRadius <= playerX + playerWidth && ballY + ballRadius >= playerY && ballY - ballRadius <= playerY + playerWidth) {
        ballXDir *= randomNum();
        ballYDir *= randomNum();
        return true;
    }
    return false;
}

// updates ball cords
function moveBall() {
    playerCollision();
    if (wallCollision(ballX, ballXDir) === true) {
        ballX += ballXDir * ballSpeed;
    } else {
        ballXDir *= randomNum();
    }
    if (wallCollision(ballY, ballYDir) === true) {
        ballY += ballYDir * ballSpeed;
    } else {
        ballYDir *= randomNum();
    }
}

// draws ball from cords
function drawBall() {
    ctx.beginPath();
    ctx.arc(ballX, ballY, ballRadius, 0, 2 * Math.PI);
    ctx.fill();
}

function drawImage() {
    ctx.drawImage(image, ballX - ballRadius, ballY - ballRadius, imageHeight, imageWidth);
}

function refreshPlayer() {
    ctx.clearRect(0, 0, 500, 500);
    movePlayer();
    moveBall();
    drawPlayer();
    // drawBall();
    drawImage();
}

setInterval(refreshPlayer, 10);