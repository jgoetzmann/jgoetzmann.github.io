// gets canvas element
let map = document.getElementById("map");
let ctx = map.getContext("2d");

// draw map
// ctx.fillStyle = "#808080";
// ctx.fillRect(0, 230, 960, 20);

// variables
let money = 100;
let round = 1;
let death = false;
let spawnType = 0;

// enemy stats
const data = [
    ["test", "test2"], // name
    [5, 10], // hp
    [100, 100], // positionX
    [235, 202.5], // positionY
    [0.5, 0.2], // speed
    [10, 75], // size
    [false, false] // dead
];

/*
for (i = 0; i < 5; i++) {
    data[i].push(library[i][0]);
}
*/
for (i = 0; i < 5; i++) {
    console.log(data[i]);
}

function updatePosition(enemyID) {
    data[2][enemyID] += data[4][enemyID];
    console.log(data[2][enemyID])
}

function spawnUnits() {}

function attack() {}

function refreshUI() {
    ctx.clearRect(0, 200, 960, 80);
    ctx.fillStyle = "#808080";
    ctx.fillRect(0, 200, 960, 80);
    ctx.fillStyle = "#ffffff";
    attack();
    spawnUnits();
    for (i = 0; i < data[0].length; i++) {
        if (data[6][i] === false) {
            updatePosition(i);
            ctx.fillRect(data[2][i], data[3][i], data[5][i], data[5][i]);
        }
    }
}

setInterval(refreshUI, 10)