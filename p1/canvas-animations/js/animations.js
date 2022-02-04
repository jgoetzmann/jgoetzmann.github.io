// get canvas
let mainCanvas = document.getElementById("canvas-animations");
let ctx = mainCanvas.getContext("2d");

// positions
let xPosition = 0;
let yPosition = 0;
let updateX = 1;
let updateY = 1;

function moveHorizontal() {
    // clear screen
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

/*
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