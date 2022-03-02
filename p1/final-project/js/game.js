// gets canvas element
let map = document.getElementById("map");
let ctx = map.getContext("2d");

// variables
let money = 100;
let lives = 200;
let round = 1000;

// buttons
let button1 = document.getElementById("button1");
let button2 = document.getElementById("button2");
let button3 = document.getElementById("button3");
let button4 = document.getElementById("button4");
let button5 = document.getElementById("button5");
let button6 = document.getElementById("button6");
let button7 = document.getElementById("button7");
let button8 = document.getElementById("button8");
let button9 = document.getElementById("button9");
let button10 = document.getElementById("button10");
let button11 = document.getElementById("button11");
let button12 = document.getElementById("button12");

// ui
let roundUI = document.getElementById("round-ui");
let moneyUI = document.getElementById("money-ui");
let livesUI = document.getElementById("lives-ui");

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
    // stats
    console.log("round:" + round)
    console.log("money:" + money)
    console.log("lives:" + lives)

}
showDebug();

///// Onclick Functions /////

function purchase1() {
    let randomTarget = Math.floor(Math.random() * data[6].length);
    console.log("Purchase 1 Trigger");
    if (money >= 25) {
        money -= 25;
        console.log("Killed " + data[0][randomTarget])
        data[6][randomTarget] = true;
    }
}

function purchase2() {
    console.log("Purchase 2 Trigger")
}

function purchase3() {
    console.log("Purchase 3 Trigger")
}

function purchase4() {
    console.log("Purchase 4 Trigger")
}

function purchase5() {
    console.log("Purchase 5 Trigger")
}

function purchase6() {
    console.log("Purchase 6 Trigger")
}

function purchase7() {
    console.log("Purchase 7 Trigger")
}

function purchase8() {
    console.log("Purchase 8 Trigger")
}

function purchase9() {
    console.log("Purchase 9 Trigger")
}

function purchase10() {
    console.log("Purchase 10 Trigger")
}

function purchase11() {
    console.log("Purchase 11 Trigger")
}

function purchase12() {
    console.log("Purchase 12 Trigger")
}

///// Timebased Functions /////

// updates positions
function updatePosition(enemyID) {
    data[2][enemyID] += data[4][enemyID];
}

// spawns units and updates round
function spawnUnits() {
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
    roundUI.innerHTML = "Round: " + Math.floor(round / 1000);
    moneyUI.innerHTML = "Money: " + money;
    livesUI.innerHTML = "Lives: " + lives;
}

// calls update every 1/10 second
setInterval(refreshUI, 100)