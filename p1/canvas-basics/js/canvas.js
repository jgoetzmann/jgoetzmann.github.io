// for loop practice
for (let i = 1; i <= 10; i++) { console.log(i) };
for (let i = 10; i >= 1; i--) { console.log(i) };
for (let i = 1; i <= 9; i += 2) { console.log(i) };

// gets canvas element
let demoCanvas = document.getElementById("demo-canvas");
// creates canvas object
let ctx = demoCanvas.getContext("2d");

// draw rectangle
ctx.fillStyle = "#8fabff";
ctx.fillRect(0, 0, 200, 100);

// draw lines
ctx.beginPath();
ctx.moveTo(0, 0);
ctx.lineTo(200, 100);
ctx.stroke();

// draw lines
ctx.beginPath();
ctx.moveTo(200, 0);
ctx.lineTo(0, 100);
ctx.stroke();

// draw circle
ctx.beginPath();
ctx.arc(100, 50, 25, 0, 2 * Math.PI);
ctx.strokeStyle = "Red";
ctx.stroke();

for (let i = 50; i > 0; i -= 5) {
    ctx.beginPath();
    ctx.arc(100, 50, i, 0, 2 * Math.PI);
    ctx.strokeStyle = "Red";
    ctx.stroke();
}