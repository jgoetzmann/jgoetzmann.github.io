// gets canvas element
let map = document.getElementById("map");
let ctx = map.getContext("2d");

function clickTest(click) {
    console.log(click)
}

// draw rectangle
ctx.fillStyle = "#808080";
ctx.fillRect(0, 230, 240, 20);
ctx.fillRect(220, 130, 20, 120);
ctx.fillRect(220, 130, 240, 20);
ctx.fillRect(460, 130, 20, 220);
ctx.fillRect(460, 330, 240, 20);
ctx.fillRect(700, 230, 20, 120);
ctx.fillRect(720, 230, 240, 20);