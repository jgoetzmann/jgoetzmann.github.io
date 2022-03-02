// gets canvas element
let map = document.getElementById("map");
let ctx = map.getContext("2d");

// variables
let money = 100;
let lives = 200;
let round = 1000;

// enemy stats
const data = [
    ["startA", "startA", "startB"], // name
    [10, 10, 30], // hp
    [-25, -75, -100], // positionX
    [263, 225.7, 232], // positionY
    [0.5, 0.5, 0.4], // speed
    [5, 5, 10], // size
    [false, false, false] // dead
];

// spawn probability
const spawns = [
    ["nil", "tiny", "small", "small-f", "normal", "normal-f", "normal-s", "large", "large-f", "large-s", "huge", "boss"], // name
    [0, 10, 30, 30, 100, 100, 300, 500, 500, 1500, 5000, 25000], // hp
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // positionX
    [0, 205, 205, 205, 205, 205, 205, 205, 205, 205, 205, 205], // positionY
    [0, 0.5, 0.4, 1.2, 0.3, 0.9, 0.25, 0.2, 0.6, 0.17, 0.1, 0.05], // speed
    [0, 5, 10, 10, 20, 20, 20, 30, 30, 30, 50, 75], // size
    [true, false, false, false, false, false, false, false, false, false, false, false], // dead
];

// debug
function showDebug() {
    // data array debug
    console.log("On Map Units:");
    for (i = 0; i < 7; i++) {
        console.log(data[i]);
    }
    // spawn array debug
    console.log("Unit Library:");
    console.log(spawns);
}
showDebug();

// updates positions
function updatePosition(enemyID) {
    data[2][enemyID] += data[4][enemyID];
}

// spawns units and updates round
function spawnUnits() {
    let roundUI = document.getElementById("round-ui");
    roundUI.innerHTML = Math.floor(round / 1000);
    round += 1;
    if (Number.isInteger(round / 30) === true) { // triggers every 3 secs
        let spawnChoice = unitChoice(); // finds what unit to select
        for (i = 0; i < 7; i++) {
            data[i].push(spawns[i][spawnChoice]); // adds to data array
        }
    }
}

// random selection of unit
function unitChoice() {
    let randomChoice = Math.floor(Math.random() * 100) + 1;
    for (i = 11; i > 0; i--) {
        if (randomChoice < (round / 100) - (i * 30) + 60) { // spawn odds formula
            console.log("spawned " + spawns[0][i])
            return i;
        }
    }
    console.log("spawned nothing")
    return 0;
}
// calculate tower attacks
function attack() {}

// clears array and awards money
function clearData() {
    for (i = data[0].length; i >= 0; i--) { // runs through array back to front
        if (data[6][i] === true) { // checks if dead
            money += data[5][i]; // awards money
            for (j = 0; j < 7; j++) { // selects all arrays of an index
                data[j].splice(i); // removes dead things from data array
            }
        }
    }
}

// calls position update, unit spawns, and attacks
function refreshUI() {
    ctx.clearRect(0, 200, 960, 80);
    ctx.fillStyle = "#808080";
    ctx.fillRect(0, 200, 960, 80);
    ctx.fillStyle = "#ffffff";
    attack();
    spawnUnits();
    clearData();
    for (i = 0; i < data[0].length; i++) { // fail save for clearData
        if (data[6][i] === false) {
            updatePosition(i);
            ctx.fillRect(data[2][i], data[3][i], data[5][i], data[5][i]);
        }
    }
}

// calls update every 1/10 second
setInterval(refreshUI, 100)