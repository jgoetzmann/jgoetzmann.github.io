// gets canvas element
let map = document.getElementById("map");
let ctx = map.getContext("2d");

// variables
let money = 500;
let lives = 200;
let round = 1000;

// button id pull
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

// button cost set
let buttonCost7 = 50;
let buttonCost8 = 100;

// building level set
let canonLevel = 1;
let laserLevel = 1;
let utilityLevel = 1;

// ui
let roundUI = document.getElementById("round-ui");
let moneyUI = document.getElementById("money-ui");
let livesUI = document.getElementById("lives-ui");

// enemy stats
const data = [
    [], // name
    [], // hp
    [], // positionX
    [], // positionY
    [], // speed
    [], // size
    [] // dead
];

// spawn probability
const spawns = [
    ["nil", "tiny", "small", "small-f", "normal", "normal-f", "normal-s", "large", "large-f", "large-s", "huge", "boss"], // name
    [0, 10, 30, 30, 100, 100, 300, 500, 500, 1500, 5000, 25000], // hp
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // positionX
    [0, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200], // positionY
    [0, 0.5, 0.4, 1.2, 0.3, 0.9, 0.25, 0.2, 0.6, 0.17, 0.1, 0.05], // speed
    [0, 5, 10, 10, 20, 20, 20, 30, 30, 30, 50, 75], // size
    [true, false, false, false, false, false, false, false, false, false, false, false], // dead
];

// buildings on map
const buildingData = [
    [], // name
    [], // positionX
    [], // positionY
    [], // size
    [], // range
    [], // attackspeed
    [], // damaage
    [], // targets
    [], // level
    [] // special ability
];

const buildingSpawns = [
    ["canon", "multi canon", "huge canon", "laser", "frost laser", "super laser", "bank", "canon upgrader", "laser upgrader", "utility upgrader"], // name
    [canonLevel, canonLevel, canonLevel, laserLevel, laserLevel, laserLevel, utilityLevel, false, false, false], // level
    [], // positionX
    [], // positionY
    [20, 30, 50, 20, 30, 50, 30, 30, 30, 30], // size
    [], // range
    [], // attackspeed
    [], // damaage
    [], // targets
    [] // special ability
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
    console.log("Purchase 1 Trigger")
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

function purchase7() { // kill random
    if (money >= buttonCost7 && data[0].length > 0) { // Check Money and Target Exists
        money -= buttonCost7; // Taxes Money
        for (k = 0; k < utilityLevel; k++) { // kills a cube for each utility level
            if (data[0].length > 0) { // makes sure there is a target to avoid bugs
                let randomTarget = Math.floor(Math.random() * data[6].length); // Finds Target
                console.log("Killed " + data[0][randomTarget]); // logs people killed
                data[6][randomTarget] = true; // sets death to true on target
                clearData(); // clears data from array 
            }
        }
        buttonCost7 += 50; // increases cost
        console.log("Purchase 7 Success"); // logs success
        button7.innerHTML = "Kill Random! ($" + buttonCost7 + ")"; // updates ui
    } else {
        console.log("Purchase 7 Fail"); // logs fail
    }
}

function purchase8() { // slow all
    if (money >= buttonCost8 && data[0].length > 0) { // Check Money and Target Exists
        money -= buttonCost8; // Taxes Money
        let slowAmount = 1 // defines slow amount
        for (i = 0; i < utilityLevel; i++) { // loops through as many times as utility level
            slowAmount *= 0.8; // decreasing returns on slow
        }
        console.log("Slowed " + data[0]); // logs people slowed
        for (i = 0; i < data[0].length; i++) { // iterates through loop
            data[4][i] *= slowAmount; // slows speed of all units by slow amount
        }
        buttonCost8 += 100; // increases cost
        console.log("Purchase 8 Success"); // logs success
        button8.innerHTML = "Slow All! ($" + buttonCost8 + ")"; // updates ui
    } else {
        console.log("Purchase 8 Fail"); // logs fail
    }
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

// sets adds skew to spawns
function positionOffset(size) {
    return Math.random() * size + 200;
}
// updates positions
function updatePosition(enemyID) {
    data[2][enemyID] += data[4][enemyID];
}

// spawns units and updates round
function spawnUnits() {
    round += 1; // increases round
    if (Number.isInteger(round / 30) === true) { // triggers every 3 secs
        let spawnChoice = unitChoice(); // finds what unit to select
        switch (spawnChoice) { // calls position offset based on what type of cube it is
            case 11: // boss
                spawns[3][spawnChoice] = positionOffset(5);
                break;
            case 10: // huge
                spawns[3][spawnChoice] = positionOffset(30);
                break;
            case 9: // large
            case 8:
            case 7:
                spawns[3][spawnChoice] = positionOffset(50);
                break;
            case 6: // normal
            case 5:
            case 4:
                spawns[3][spawnChoice] = positionOffset(60);
                break;
            case 3: // small
            case 2:
                spawns[3][spawnChoice] = positionOffset(70);
                break;
            case 1: // tiny
                spawns[3][spawnChoice] = positionOffset(75);
        }
        for (i = 0; i < 7; i++) {
            data[i].push(spawns[i][spawnChoice]); // adds to data array
        }
    }
}

// random selection of unit
function unitChoice() {
    let randomChoice = Math.floor(Math.random() * 100) + 1; // draws random number
    for (i = 11; i > 0; i--) { // calls large first then descends to small
        if (randomChoice < (round / 100) - (i * 30) + 60) { // spawn odds formula
            console.log("spawned " + spawns[0][i]) // logs spawn
            return i; // returns what unit should spawn
        }
    }
    console.log("spawned nothing")
    return 0; // if nothing spawns returns spawn code for 'nil'
}
// calculate tower attacks
function attack() {}

// clears array and awards money
function clearData() {
    for (i = data[0].length; i >= 0; i--) { // runs through array back to front
        if (data[6][i] === true) { // checks if dead
            money += data[5][i]; // awards money
            for (j = 0; j < 7; j++) { // selects all arrays of an index
                data[j].splice(i, 1); // removes dead things from data array
            }
        }
    }
}

// calls position update, unit spawns, and attacks
function refreshUI() {
    ctx.clearRect(0, 200, 960, 80); // clears middle rectangle
    ctx.fillStyle = "#808080"; // sets to gray
    ctx.fillRect(0, 200, 960, 80); // draws middle rectangle again
    ctx.fillStyle = "#ffffff"; // sets to white
    attack();
    spawnUnits();
    clearData();
    for (i = 0; i < data[0].length; i++) { // fail save for clearData
        if (data[6][i] === false) {
            updatePosition(i); // updates cube location
            ctx.fillRect(data[2][i], data[3][i], data[5][i], data[5][i]); // draws cubes
        }
    }
    roundUI.innerHTML = "Round: " + Math.floor(round / 1000); // updates round ui
    moneyUI.innerHTML = "Money: " + money; // updates money ui
    livesUI.innerHTML = "Lives: " + lives; // updates lives ui
}

// calls update every 1/10 second
setInterval(refreshUI, 30)