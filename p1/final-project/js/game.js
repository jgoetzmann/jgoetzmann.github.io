// gets canvas element
let map = document.getElementById("map");
let ctx = map.getContext("2d");

// variables
let money = 100;
let lives = 200;
let round = 1000;

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

// spawn probability
const spawns = [
        ["nil", "tiny", "small", "small-f", "normal", "normal-s", "long", "large", "large-s", "vertical", "huge", "boss"], // name
        [0, 10, 30, 30, 100, 300, 300, 500, 1500, 1500, 5000, 25000], // hp
        [0, 100], // positionX
        [0, 202.5], // positionY
        [0, 0.2], // speed
        [0, 75], // size
        [true, false], // dead
        [100, 0] // Spawn Chance
    ]
    // raw data grab
for (i = 0; i < 5; i++) {
    console.log(data[i]);
}

function updatePosition(enemyID) {
    data[2][enemyID] += data[4][enemyID];
}

function spawnUnits() {
    let roundUI = document.getElementById("round-ui");
    roundUI.innerHTML = Math.floor(round / 1000)
    round += 1;
}

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

setInterval(refreshUI, 100)