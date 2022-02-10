// get canvas
let mainCanvas = document.getElementById("canvas-animations");
let ctx = mainCanvas.getContext("2d");

// get inputs
let keydownOutput = document.getElementById("keydown-output");
let keyupOutput = document.getElementById("keyup-output");

// play position and movement
let playerX = 250;
let playerY = 250;
let playerXDir = 0;
let playerYDir = 0;
let playerSpeed = 2;

// ball position and movement
let ballX = 250;
let ballY = 250;
let ballRadius = 20;
let ballXDir = 1 + Math.random();
let ballYDir = 1 + Math.random();
let ballSpeed = 5;

// key press
function keyPressed(event) {
    let keydown = event.keyCode;
    keydownOutput.innerHTML = "Key down code: " + keydown;

    switch (keydown) {
        case 37:
            playerXDir = -1;
            break;
        case 39:
            playerXDir = 1;
            break;
        case 38:
            playerYDir = -1;
            break;
        case 40:
            playerYDir = 1;
            break;
    }
}

function keyReleased(event) {
    let keyup = event.keyCode;
    keyupOutput.innerHTML = "Key up code: " + keyup;

    switch (keyup) {
        case 37:
        case 39:
            playerXDir = 0;
            break;
        case 38:
        case 40:
            playerYDir = 0;
            break;
    }
}

// updates block cords
function movePlayer() {
    if (playerX + (playerXDir * playerSpeed) <= 0 || playerX + (playerXDir * playerSpeed) >= 480) {
        console.log("Collision");
    } else {
        playerX += playerXDir * playerSpeed;
    }
    if (playerY + (playerYDir * playerSpeed) <= 0 || playerY + (playerYDir * playerSpeed) >= 480) {
        console.log("Collision");
    } else {
        playerY += playerYDir * playerSpeed;
    }
}

// draws block from cords
function drawPlayer() {
    ctx.fillRect(playerX, playerY, 20, 20);
}

function wallCollision(ballPosition, ballDir) {
    if (ballPosition + (ballDir * ballSpeed) <= (ballRadius / 2) || ballPosition + (ballDir * ballSpeed) >= 500 - (ballRadius / 2)) {
        return false;
    } else {
        return true;
    }
}

// updates ball cords
function moveBall() {
    if (wallCollision(ballX, ballXDir) === true) {
        ballX += ballXDir * ballSpeed;
    } else {
        ballXDir *= -1;
    }
    if (wallCollision(ballY, ballYDir) === true) {
        ballY += ballYDir * ballSpeed;
    } else {
        ballYDir *= -1;
    }
}

// draws ball from cords
function drawBall() {
    ctx.beginPath();
    ctx.arc(ballX, ballY, ballRadius, 0, 2 * Math.PI);
    ctx.fill();
}



function refreshPlayer() {
    ctx.clearRect(0, 0, 500, 500);
    movePlayer();
    moveBall();
    drawPlayer();
    drawBall();
}

setInterval(refreshPlayer, 10);



/*
// positions
let xPosition = 0;
let yPosition = 0;
let updateX = 1;
let updateY = 1;

function moveHorizontal() {
    // clear screens
    ctx.clearRect(0, 0, 500, 500);
    // draw rect at current position
    ctx.fillRect(xPosition, 0, 20, 20);

    // move the x position over by x pixels
    xPosition += 1;

    // hit wall
    if (xPosition >= 500) { xPosition = 0 };
}

function moveVertical() {
    // clear screen
    ctx.clearRect(0, 0, 500, 500);
    // draw rect at current position
    ctx.fillRect(0, yPosition, 20, 20);

    // move the x position over by x pixels
    yPosition += 1;

    // hit wall
    if (yPosition >= 500) { yPosition = 0 };
}

function bounce() {
    ctx.clearRect(0, 0, 500, 500);
    ctx.fillRect(xPosition, yPosition, 20, 20);

    xPosition += updateX;
    yPosition += updateY;

    if (xPosition >= 500 || xPosition <= 0) { updateX *= -1 };
    if (yPosition >= 500 || yPosition <= 0) { updateY *= -1 };
}


// setInterval(moveHorizontal, 5);
// setInterval(moveVertical, 5);
setInterval(bounce, 5);

function circleBounce() {
    ctx.clearRect(0, 0, 500, 500);
    ctx.beginpath();
    ctx.arc(xPosition, yPosition, 25, 0, 2 * Math.PI);
    ctx.stroke();
    console.log("Circle");
}

// setInterval(circleBounce, 5);

circleBounce()
*/