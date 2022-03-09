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
let buttonCost1 = 0;
let buttonCost2 = 300;
let buttonCost3 = 1000;
let buttonCost4 = 500;
let buttonCost5 = 1500;
let buttonCost6 = 3000;
let buttonCost7 = 50;
let buttonCost8 = 100;
let buttonCost9 = 100;
let buttonCost10 = 2500;
let buttonCost11 = 2500;
let buttonCost12 = 2500;

// building level set
let bankAmount = 0;
let canonLevel = 1;
let laserLevel = 1;
let utilityLevel = 1;

// ui
let roundUI = document.getElementById("round-ui");
let moneyUI = document.getElementById("money-ui");
let livesUI = document.getElementById("lives-ui");
let bankUI = document.getElementById("bank-ui");
let canonUI = document.getElementById("canon-ui");
let laserUI = document.getElementById("laser-ui");
let utilityUI = document.getElementById("utility-ui");

// jank stats to help with pushing values for buildings
let xPush = 0;
let yPush = 0;
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
    [0, -10, -15, -15, -25, -25, -25, -35, -35, -35, -55, -80], // positionX
    [0, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200], // positionY
    [0, 0.5, 0.4, 1.2, 0.3, 0.9, 0.25, 0.2, 0.6, 0.17, 0.1, 0.05], // speed
    [0, 5, 10, 10, 20, 20, 20, 30, 30, 30, 50, 75], // size
    [true, false, false, false, false, false, false, false, false, false, false, false], // dead
];

// buildings on map
const buildingData = [
    [], // name
    [], // level (not used)
    [], // positionX
    [], // positionY
    [], // size (radius)
    [], // range
    [], // attackspeed
    [], // damage per shot
    [], // targets
    [] // special ability and id
];

const buildingSpawns = [
    ["canon", "multi canon", "huge canon", "laser", "frost laser", "super laser"], // name
    [canonLevel, canonLevel, canonLevel, laserLevel, laserLevel, laserLevel], // level (not used)
    [0, 0, 0, 0, 0, 0], // positionX
    [0, 0, 0, 0, 0, 0], // positionY
    [5, 7.5, 12.5, 5, 7.5, 12.5, ], // size (radius)
    [50, 30, 100, 60, 20, 100], // range
    [30, 30, 80, 5, 5, 300], // attackspeed
    [5, 5, 250, 3, 0.9, 50], // damage per shot
    [1, 3, 1, 1, 1, 10], // targets
    [0, 1, 2, 3, 4, 5] // special ability and id
];



//// debug ////



let updateUI = true; // updates UI

function showUnits() { // prints units on map
    console.log("On Map Units:");
    for (i = 0; i < data[0].length; i++) { // loops through length of array
        console.log(data[0][i]); // prints name
    }
}

function showBuilding() { // print buildings on map
    console.log("On Map Buildings:");
    for (i = 0; i < buildingData[0].length; i++) { // loops through length of array
        console.log(buildingData[0][i]); // prints name
    }
}

function showArrays() { // prints arrays
    console.log("enemy array:");
    console.log(data);
    console.log("enemy spawn array:");
    console.log(spawns);
    console.log("building array:");
    console.log(buildingData);
    console.log("building spawn array:");
    console.log(buildingSpawns);
}

function showStats() { // shows basic stats
    console.log("round:" + round) // prints round
    console.log("money:" + money) // prints money
    console.log("lives:" + lives) // prints lives
    console.log("banks:" + bankAmount) // prints bank amount
    console.log("canonlevel:" + canonLevel) // prints canon level
    console.log("laserlevel:" + laserLevel) // prints laser leve
    console.log("utilitylevel:" + utilityLevel) // prints utility level
}



//// functions for buildings ////



// cross references all buildings to make sure their isnt collision
function positionBuildingTest(positionTestX, positionTestY, size) {
    for (k = 0; k < buildingData[0].length; k++) {
        let a = size + buildingData[4][k]; // adds radi of test circle and existing circles
        let x = positionTestX - buildingData[2][k] // compares x Positions of what test circle and existing circles
        let y = positionTestY - buildingData[3][k] // compares y Positions of what test circle and existing circles 
        if (a > Math.sqrt((x * x) + (y * y))) { // simple circle collision test
            return false; // if collision detected return false
        }
    }
    console.log("Placement test success")
    return true; // returns true if no collision
}

// takes range and size of to generate position to place then checks for collision
function buildingPlacement(range, size) {
    if (size > 200) { size = 200 } // sets size to 200 if over 200 to avoid off screen circles
    for (j = 0; j < 100; j++) { // tries to place building 100 times
        let positionTestX = Math.floor(Math.random() * 960) + 1; // finds x value between 0 and 960
        let positionTestY = Math.floor(Math.random() * (80 + (range - 10) * 2)) + 1; // returns number 1 - (80 + 2(range - 10))
        positionTestY += (210 - range) // adds 200 - range to make sure that building is in range of track
            // following line tests current buildings against new one being placed and makes sure Y is not in track
        if (positionTestY < 1080 && positionTestY > 0 && positionBuildingTest(positionTestX, positionTestY, size) === true && (positionTestY < (200 - size) || positionTestY > (280 + size))) {
            xPush = positionTestX;
            yPush = positionTestY;
            return true; // retruns true if no collision found
        }
    }
    console.log("Placement fail") // logs failed placement
    return false; // if cube fails to pass collision test 100 times then returns false
}

// upgrades canons in data and in spawn arrays
function canonUpgrade() {
    for (i = 0; i < 3; i++) { // 3 iterations
        if (i === 0) { // canon
            buildingSpawns[1][i] += 1; // level
            buildingSpawns[5][i] += 10; // damage per hit
            buildingSpawns[6][i] -= 3; // attack speed
            if (buildingSpawns[6][i] < 5) { buildingSpawns[6][i] = 5 } // sets attackspeed to laser speed if too low
            buildingSpawns[7][i] += 10; // range
        } else if (i === 1) { // multi canon
            buildingSpawns[1][i] += 1; // level
            buildingSpawns[5][i] += 5; // damage per hit
            buildingSpawns[7][i] += 5; // range
            buildingSpawns[8][i] += 1; // targets
        } else if (i === 2) { // huge canon
            buildingSpawns[1][i] += 1; // level
            buildingSpawns[5][i] += 150; // damage per hit
            buildingSpawns[7][i] += 20; // range
        }
    }
    for (i = 0; i < buildingData[0].length; i++) { // iterates through canons on field
        if (buildingData[9][i] === 0) { // canon
            buildingData[1][i] += 1; // level
            buildingData[5][i] += 10; // damage per hit
            buildingData[6][i] -= 3; // attack speed
            if (buildingData[6][i] < 5) { buildingData[6][i] = 5 } // sets attackspeed to laser speed if too low
            buildingData[7][i] += 10; // range
        } else if (buildingData[9][i] === 1) { // multi canon
            buildingData[1][i] += 1; // level
            buildingData[5][i] += 5; // damage per hit
            buildingData[7][i] += 5; // range
            buildingData[8][i] += 1; // targets
        } else if (buildingData[9][i] === 2) { // huge canon
            buildingData[1][i] += 1; // level
            buildingData[5][i] += 150; // damage per hit
            buildingData[7][i] += 20; // range
        }
    }
}

// upgrades laser in data and in spawn arrays
function laserUpgrade() {
    for (i = 3; i < 6; i++) { // 3 iterations
        if (i === 3) { // laser
            buildingSpawns[1][i] += 1; // level
            buildingSpawns[5][i] += 3; // % damage per hit
            buildingSpawns[7][i] += 5; // range
        } else if (i === 4) { // frost laser
            buildingSpawns[1][i] += 1; // level
            buildingSpawns[7][i] += 10; // range
            buildingSpawns[8][i] += 1; // targets
        } else if (i === 5) { // super laser
            buildingSpawns[1][i] += 1; // level
            buildingSpawns[5][i] += 10; // damage per hit
            buildingSpawns[7][i] += 20; // range
            buildingSpawns[8][i] += 5; // targets

        }
    }
    for (i = 3; i < buildingData[0].length; i++) { // iterates through lasers on field
        if (buildingData[9][i] === 3) { // laser
            buildingData[1][i] += 1; // level
            buildingData[5][i] += 3; // % damage per hit
            buildingData[7][i] += 5; // range
        } else if (buildingData[9][i] === 4) { // frost laser
            buildingData[1][i] += 1; // level
            buildingData[7][i] += 5; // range
            buildingData[8][i] += 1; // targets
        } else if (buildingData[9][i] === 5) { // super laser
            buildingData[1][i] += 1; // level
            buildingData[5][i] += 10; // damage per hit
            buildingData[7][i] += 20; // range
            buildingData[8][i] += 5; // targets

        }
    }
}



///// Onclick Functions /////



function purchase1() { // canon
    let buildingType = 0; // what building you are spawning
    xPush = 0; // refresh x push value
    yPush = 0; // refresh y push value
    if (money >= buttonCost1 && buildingPlacement(buildingSpawns[5][buildingType], buildingSpawns[4][buildingType]) === true) { // Check Money and Collision
        money -= buttonCost1; // taxes money
        for (i = 0; i < 10; i++) { // loops through array to push to data
            if (i === 2) { // checks if i is push x cords
                buildingData[i].push(xPush); // pushes correcy x cords
            } else if (i === 3) { // checks if i is push y cords
                buildingData[i].push(yPush); // pushes correcy y cords
            } else { // pushes cords based on array value if not cords
                buildingData[i].push(buildingSpawns[i][buildingType]); // adds to data array
            }
        }
        buttonCost1 += 100; // increases cost
        console.log("Purchase 1 Success"); // logs success
        button1.innerHTML = "Buy Canon! ($" + buttonCost1 + ")"; // updates ui
    } else {
        console.log("Purchase 1 Fail"); // logs fail
    }
}

function purchase2() { // multi canon
    let buildingType = 1; // what building you are spawning
    xPush = 0; // refresh x push value
    yPush = 0; // refresh y push value
    if (money >= buttonCost2 && buildingPlacement(buildingSpawns[5][buildingType], buildingSpawns[4][buildingType]) === true) { // Check Money and Collision
        money -= buttonCost2; // taxes money
        for (i = 0; i < 10; i++) { // loops through array to push to data
            if (i === 2) { // checks if i is push x cords
                buildingData[i].push(xPush); // pushes correcy x cords
            } else if (i === 3) { // checks if i is push y cords
                buildingData[i].push(yPush); // pushes correcy y cords
            } else { // pushes cords based on array value if not cords
                buildingData[i].push(buildingSpawns[i][buildingType]); // adds to data array
            }
        }
        buttonCost2 += 300; // increases cost
        console.log("Purchase 2 Success"); // logs success
        button2.innerHTML = "Buy Multi Canon! ($" + buttonCost2 + ")"; // updates ui
    } else {
        console.log("Purchase 2 Fail"); // logs fail
    }
}

function purchase3() { // huge canon
    let buildingType = 2; // what building you are spawning
    xPush = 0; // refresh x push value
    yPush = 0; // refresh y push value
    if (money >= buttonCost3 && buildingPlacement(buildingSpawns[5][buildingType], buildingSpawns[4][buildingType]) === true) { // Check Money and Collision
        money -= buttonCost3; // taxes money
        for (i = 0; i < 10; i++) { // loops through array to push to data
            if (i === 2) { // checks if i is push x cords
                buildingData[i].push(xPush); // pushes correcy x cords
            } else if (i === 3) { // checks if i is push y cords
                buildingData[i].push(yPush); // pushes correcy y cords
            } else { // pushes cords based on array value if not cords
                buildingData[i].push(buildingSpawns[i][buildingType]); // adds to data array
            }
        }
        buttonCost3 += 1000; // increases cost
        console.log("Purchase 3 Success"); // logs success
        button3.innerHTML = "Buy Huge Canon! ($" + buttonCost3 + ")"; // updates ui
    } else {
        console.log("Purchase 3 Fail"); // logs fail
    }
}

function purchase4() { // laser
    let buildingType = 3; // what building you are spawning
    xPush = 0; // refresh x push value
    yPush = 0; // refresh y push value
    if (money >= buttonCost4 && buildingPlacement(buildingSpawns[5][buildingType], buildingSpawns[4][buildingType]) === true) { // Check Money and Collision
        money -= buttonCost4; // taxes money
        for (i = 0; i < 10; i++) { // loops through array to push to data
            if (i === 2) { // checks if i is push x cords
                buildingData[i].push(xPush); // pushes correcy x cords
            } else if (i === 3) { // checks if i is push y cords
                buildingData[i].push(yPush); // pushes correcy y cords
            } else { // pushes cords based on array value if not cords
                buildingData[i].push(buildingSpawns[i][buildingType]); // adds to data array
            }
        }
        buttonCost4 += 500; // increases cost
        console.log("Purchase 4 Success"); // logs success
        button4.innerHTML = "Buy Laser! ($" + buttonCost4 + ")"; // updates ui
    } else {
        console.log("Purchase 4 Fail"); // logs fail
    }
}

function purchase5() { // frost laser
    let buildingType = 4; // what building you are spawning
    xPush = 0; // refresh x push value
    yPush = 0; // refresh y push value
    if (money >= buttonCost5 && buildingPlacement(buildingSpawns[5][buildingType], buildingSpawns[4][buildingType]) === true) { // Check Money and Collision
        money -= buttonCost5; // taxes money
        for (i = 0; i < 10; i++) { // loops through array to push to data
            if (i === 2) { // checks if i is push x cords
                buildingData[i].push(xPush); // pushes correcy x cords
            } else if (i === 3) { // checks if i is push y cords
                buildingData[i].push(yPush); // pushes correcy y cords
            } else { // pushes cords based on array value if not cords
                buildingData[i].push(buildingSpawns[i][buildingType]); // adds to data array
            }
        }
        buttonCost5 += 1500; // increases cost
        console.log("Purchase 5 Success"); // logs success
        button5.innerHTML = "Buy Frost Laser! ($" + buttonCost5 + ")"; // updates ui
    } else {
        console.log("Purchase 5 Fail"); // logs fail
    }
}

function purchase6() { // super laser
    let buildingType = 5; // what building you are spawning
    xPush = 0; // refresh x push value
    yPush = 0; // refresh y push value
    if (money >= buttonCost6 && buildingPlacement(buildingSpawns[5][buildingType], buildingSpawns[4][buildingType]) === true) { // Check Money and Collision
        money -= buttonCost6; // taxes money
        for (i = 0; i < 10; i++) { // loops through array to push to data
            if (i === 2) { // checks if i is push x cords
                buildingData[i].push(xPush); // pushes correcy x cords
            } else if (i === 3) { // checks if i is push y cords
                buildingData[i].push(yPush); // pushes correcy y cords
            } else { // pushes cords based on array value if not cords
                buildingData[i].push(buildingSpawns[i][buildingType]); // adds to data array
            }
        }
        buttonCost6 += 3000; // increases cost
        console.log("Purchase 6 Success"); // logs success
        button6.innerHTML = "Buy Super Laser! ($" + buttonCost6 + ")"; // updates ui
    } else {
        console.log("Purchase 6 Fail"); // logs fail
    }
}

function purchase7() { // kill random
    if (money >= buttonCost7 && data[0].length > 0) { // Check Money and Target Exists
        money -= buttonCost7; // Taxes Money
        for (k = 0; k < utilityLevel; k++) { // kills a cube for each utility level
            if (data[0].length > 0) { // makes sure there is a target to avoid bugs
                let randomTarget = Math.floor(Math.random() * data[6].length); // Finds Target
                console.log("Killed " + data[0][randomTarget]); // logs people killed
                data[6][randomTarget] = true; // sets death to true on target
                clearData(false); // clears data from array 
            }
        }
        buttonCost7 += (Math.floor(round / 1000) * 5); // increases cost
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
        buttonCost8 += (Math.floor(round / 1000) * 5); // increases cost
        console.log("Purchase 8 Success"); // logs success
        button8.innerHTML = "Slow All! ($" + buttonCost8 + ")"; // updates ui
    } else {
        console.log("Purchase 8 Fail"); // logs fail
    }
}

function purchase9() { // bank
    if (money >= buttonCost9) { // Check Money
        money -= buttonCost9; // taxes money
        bankAmount += 1; //adds bank
        buttonCost9 += 20; // increases cost
        console.log("Purchase 9 Success"); // logs success
        button9.innerHTML = "Buy Bank! ($" + buttonCost9 + ")"; // updates ui
    } else {
        console.log("Purchase 9 Fail"); // logs fail
    }
}

function purchase10() { // canon upgrade
    if (money >= buttonCost10) { // Check Money
        money -= buttonCost10; // taxes money
        canonLevel += 1; //adds canon level
        buttonCost10 += 2500; // increases cost
        console.log("Purchase 10 Success"); // logs success
        button10.innerHTML = "Upgrade Canons! ($" + buttonCost10 + ")"; // updates ui
        canonUpgrade(); // upgrades canons on field
    } else {
        console.log("Purchase 10 Fail"); // logs fail
    }
}

function purchase11() { // laser upgrade
    if (money >= buttonCost11) { // Check Money
        money -= buttonCost11; // taxes money
        laserLevel += 1; //adds laser level
        buttonCost11 += 2500; // increases cost
        console.log("Purchase 11 Success"); // logs success
        button11.innerHTML = "Upgrade Lasers! ($" + buttonCost11 + ")"; // updates ui
        laserUpgrade(); // upgrades laser on field
    } else {
        console.log("Purchase 11 Fail"); // logs fail
    }
}

function purchase12() { // utility upgrade
    if (money >= buttonCost12) { // Check Money
        money -= buttonCost12; // taxes money
        utilityLevel += 1; //adds utility level
        buttonCost12 += 2500; // increases cost
        console.log("Purchase 12 Success"); // logs success
        button12.innerHTML = "Upgrade Utility! ($" + buttonCost12 + ")"; // updates ui
    } else {
        console.log("Purchase 12 Fail"); // logs fail
    }
}



///// Timebased Functions /////



// sets adds skew to spawns
function positionOffset(size) {
    return Math.random() * size + 200;
}

// takes in size and returns lives that should be lost
function livesCost(enemyID) {
    switch (data[5][enemyID]) { // switches size of cube to deterime lives lost
        case 75:
            return 200;
        case 50:
            return 100;
        case 30:
            return 25;
        case 20:
            return 10;
        case 10:
            return 3;
        case 5:
            return 1;
    }
}

// updates positions and subtracts lives
function updatePosition() {
    ctx.fillStyle = "#232323"; // sets to white
    for (i = 0; i < data[0].length; i++) { // iterates through array
        data[2][i] += data[4][i]; // adds speed to x value
        if (data[2][i] > 965) { // checks if cube is off screen
            data[6][i] = true; // kills cube
            lives -= livesCost(i); // subtracts lives
            clearData(false); // cleans array without awarding cash
        }
        ctx.fillRect(data[2][i], data[3][i], data[5][i], data[5][i]); // draws cubes
    }
}

// spawns units and updates round
function spawnUnits() {
    if (Number.isInteger(round / 30) === true) { // triggers every 3 secs
        let spawnChoice = unitChoice(); // finds what unit to select
        switch (spawnChoice) { // calls position offset based on what type of cube it is
            case 11: // boss
                spawns[3][spawnChoice] = positionOffset(5);
                spawns[1][11] = Math.floor(1.05 * spawns[1][11]); // scales boss hp
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

// draws building size on field
function drawBuilding() {
    if (buildingData[0].length > 0) { // makes sure array has something in it
        for (i = 0; i < buildingData[0].length; i++) { // iterates through loo[]
            let buildingTrace = buildingData[9][i] // grabs i in ability array
            ctx.beginPath(); // starts path
            ctx.arc(buildingData[2][i], buildingData[3][i], buildingData[4][i], 0, 2 * Math.PI); // draws circle
            switch (buildingTrace) { // changes color based on building type
                case 0: // canon
                    ctx.fillStyle = "#feb1b1"; // color
                    break;
                case 1: // multi canon
                    ctx.fillStyle = "#ff8080"; // color
                    break;
                case 2: // huge canon
                    ctx.fillStyle = "#ff4f4f"; // color
                    break;
                case 3: // laser
                    ctx.fillStyle = "#b5e2ff"; // color
                    break;
                case 4: // frost laser
                    ctx.fillStyle = "#6ac5fe"; // color
                    break;
                case 5: // super laser
                    ctx.fillStyle = "#3792cb"; // color
                    break;
                default:
                    ctx.fillStyle = "#232323"; // sets to white
            }
            ctx.fill(); // draws line
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

// range check to make sure cube is in range
function collisionAttackCheck(c1x, c1y, r1, c2x, c2y, r2) {
    let a = r1 + r2; // radi put together
    let x = c1x - c2x; // x positions put together
    let y = c1y - c2y; // y positions put together

    if (a > Math.sqrt((x * x) + (y * y))) { // math
        return true; // return true if collision
    } else {
        return false; // returns false if no collision
    }
}

// draw projectiles for animations
function drawProjectiles(towerX, towerY, enemyX, enmeyY, towerShot) {
    switch (towerShot) {
        case 0: // canon
            ctx.strokeStyle = "#feb1b1"; // color
            ctx.lineWidth = 3;
            break;
        case 1: // multi canon
            ctx.strokeStyle = "#ff8080"; // color
            ctx.lineWidth = 3;
            break;
        case 2: // huge canon
            ctx.strokeStyle = "#ff4f4f"; // color
            ctx.lineWidth = 10;
            break;
        case 3: // laser
            ctx.strokeStyle = "#b5e2ff"; // color
            ctx.lineWidth = 1;
            break;
        case 4: // frost laser
            ctx.strokeStyle = "#6ac5fe"; // color
            ctx.lineWidth = 1;
            break;
        case 5: // super laser
            ctx.strokeStyle = "#3792cb"; // color
            ctx.lineWidth = 1;
            break;
        default:
            ctx.strokeStyle = "#232323"; // sets to white
            ctx.lineWidth = 5;
    }

    ctx.beginPath(); // begins line
    ctx.moveTo(towerX, towerY); // starts line
    ctx.lineTo(enemyX, enmeyY); // end line
    ctx.stroke(); // draw line
}

// find enemy for attack 
function findEnemy(positionDerive, mode) {
    let positionXAttack = buildingData[2][positionDerive]; // takes x position
    let positionYAttack = buildingData[3][positionDerive]; // takes y position
    let rangeAttack = buildingData[5][positionDerive] * 2; // takes radius
    if (mode === 0) { // if target is strong
        let targetSelectChoice = 0; // sets variable to 0
        for (j = 12; j > 0; j--) {
            switch (j) {
                case 11: // boss
                    targetSelectChoice = 75; // sets variable to help find cube
                    break;
                case 10: // huge
                    targetSelectChoice = 50; // sets variable to help find cube
                    break;
                case 9: // large
                case 8:
                case 7:
                    targetSelectChoice = 30; // sets variable to help find cube
                    break;
                case 6: // normal
                case 5:
                case 4:
                    targetSelectChoice = 20; // sets variable to help find cube
                    break;
                case 3: // small
                case 2:
                    targetSelectChoice = 10; // sets variable to help find cube
                    break;
                case 1: // tiny
                    targetSelectChoice = 5; // sets variable to help find cube
            }
            for (k = 0; k < data[0].length; k++) { // loops through array
                let circle2X = data[2][k] + (data[5][k] / 2); // finds center of x of cube
                let circle2Y = data[3][k] + (data[5][k] / 2); // finds center of y of cube
                let circle2Radi = data[5][k] / 2 // find radi
                if (targetSelectChoice === data[5][k] && collisionAttackCheck(positionXAttack, positionYAttack, rangeAttack, circle2X, circle2Y, circle2Radi) === true) { // finds units ordering from strongest to weakist
                    return k; // returns target
                }
            }
        }
    } else if (mode === 1) { // if target first
        for (m = 0; m < data[0].length; m++) { // loops through array
            let circle2X = data[2][m] + (data[5][m] / 2); // finds center of x of cube
            let circle2Y = data[3][m] + (data[5][m] / 2); // finds center of y of cube
            let circle2Radi = data[5][m] / 2 // find radi
            if (collisionAttackCheck(positionXAttack, positionYAttack, rangeAttack, circle2X, circle2Y, circle2Radi) === true) { // finds units ordering from oldest to newist
                return m; // returns target
            }
        }
        return false; // returns false if no target found
    } else if (mode === 2) { // if target random
        for (j = 0; j < 100; j++) {
            let targetSlection = Math.floor(Math.random() * data[0].length)
            let circle2X = data[2][targetSlection] + (data[5][targetSlection] / 2); // finds center of x of cube
            let circle2Y = data[3][targetSlection] + (data[5][targetSlection] / 2); // finds center of y of cube
            let circle2Radi = data[5][targetSlection] / 2 // find radi
            if (collisionAttackCheck(positionXAttack, positionYAttack, rangeAttack, circle2X, circle2Y, circle2Radi) === true) { // finds units ordering from oldest to newist
                return targetSlection; // returns target
            }
        }
        return false;
    }
    return false; // returns false if no target found
}
// calculate tower attacks
function attack() {
    if (data[0].length > 0) { // checks that there is units
        for (i = 0; i < buildingData[0].length; i++) { // iterates through loop
            if (Number.isInteger(round / buildingData[6][i]) === true) { // attackspeed
                for (n = 0; n < buildingData[8][i]; n++) { // loops through attack depending on target
                    let enemyTarget = 0; // resets target
                    switch (buildingData[9][i]) {
                        case 0:
                            enemyTarget = findEnemy(i, 1); // first
                            break;
                        case 5:
                        case 1:
                        case 4:
                            enemyTarget = findEnemy(i, 2); // random
                            break;
                        case 3:
                        case 2:
                            enemyTarget = findEnemy(i, 0); // strong
                    }
                    if (enemyTarget !== false) { // makes sure that enemy target is not false
                        switch (buildingData[9][i]) {
                            case 0: // canon
                                drawProjectiles(buildingData[2][i], buildingData[3][i], (data[2][enemyTarget]) + (data[5][enemyTarget] / 2), (data[3][enemyTarget]) + (data[5][enemyTarget] / 2), 0); // draws projectiles
                                data[1][enemyTarget] -= buildingData[7][i]; // takes damage per shot and subtracts from hp
                                console.log(buildingData[0][i] + " dealt " + buildingData[7][i] + " damage!"); // logs damage
                                break;
                            case 1: // multi canon
                                drawProjectiles(buildingData[2][i], buildingData[3][i], (data[2][enemyTarget]) + (data[5][enemyTarget] / 2), (data[3][enemyTarget]) + (data[5][enemyTarget] / 2), 1); // draws projectiles
                                data[1][enemyTarget] -= buildingData[7][i]; // takes damage per shot and subtracts from hp
                                console.log(buildingData[0][i] + " dealt " + buildingData[7][i] + " damage!"); // logs damage
                                break;
                            case 2: // huge canon
                                drawProjectiles(buildingData[2][i], buildingData[3][i], (data[2][enemyTarget]) + (data[5][enemyTarget] / 2), (data[3][enemyTarget]) + (data[5][enemyTarget] / 2), 2); // draws projectiles
                                data[1][enemyTarget] -= buildingData[7][i]; // takes damage per shot and subtracts from hp
                                console.log(buildingData[0][i] + " dealt " + buildingData[7][i] + " damage!"); // logs damage
                                break;
                            case 5: // super laser
                                drawProjectiles(buildingData[2][i], buildingData[3][i], (data[2][enemyTarget]) + (data[5][enemyTarget] / 2), (data[3][enemyTarget]) + (data[5][enemyTarget] / 2), 5); // draws projectiles
                                data[1][enemyTarget] -= buildingData[7][i]; // takes damage per shot and subtracts from hp
                                console.log(buildingData[0][i] + " dealt " + buildingData[7][i] + " damage!"); // logs damage
                                break;
                            case 3: // laser
                                drawProjectiles(buildingData[2][i], buildingData[3][i], (data[2][enemyTarget]) + (data[5][enemyTarget] / 2), (data[3][enemyTarget]) + (data[5][enemyTarget] / 2), 3); // draws projectiles
                                if (data[5][enemyTarget] === 75) { // if boss
                                    data[1][enemyTarget] -= 100 // take 100 damage
                                } else { // if not boss
                                    data[1][enemyTarget] -= data[1][enemyTarget] / 100 * buildingData[7][i]; // takes hp of unit and divdes its hp 100 and multiplies it by damage then subtracts it
                                }
                                console.log(buildingData[0][i] + " dealt " + buildingData[7][i] + " damage!"); // logs damage
                                break;
                            case 4: // frost laser
                                drawProjectiles(buildingData[2][i], buildingData[3][i], (data[2][enemyTarget]) + (data[5][enemyTarget] / 2), (data[3][enemyTarget]) + (data[5][enemyTarget] / 2), 4); // draws projectiles
                                data[4][enemyTarget] = 0.02 // slows based on level
                                console.log(buildingData[0][i] + " slowed a unit by 10%!"); // logs damage
                                break;
                        }
                    }
                }
            }
        }
    }
}

// clears array and awards money
function clearData(deathMoney) {
    for (i = data[0].length; i >= 0; i--) { // runs through array back to front
        if (data[6][i] === true || data[1][i] < 1) { // checks if dead or has <1 hp
            if (deathMoney === true) { // checks if death money should be awarded
                money += Math.floor(data[5][i] * (2 + (5 * utilityLevel / 100))); // awards money
            }
            for (j = 0; j < 7; j++) { // selects all arrays of an index
                data[j].splice(i, 1); // removes dead things from data array
            }
        }
    }
}

// updates stats on ui
function refreshStatUI() {
    roundUI.innerHTML = "Round: " + Math.floor(round / 1000); // updates round ui
    moneyUI.innerHTML = "Money: " + Math.floor(money); // updates money ui
    livesUI.innerHTML = "Lives: " + lives; // updates lives ui
    bankUI.innerHTML = "Banks: " + bankAmount; // updates bank amount ui
    canonUI.innerHTML = "Canon Level: " + canonLevel; // updates canon level ui
    laserUI.innerHTML = "Laser Level: " + laserLevel; // updates laser level ui
    utilityUI.innerHTML = "Utility Level: " + utilityLevel; // updates utility level ui
}

// clears path of enemies then redraws it
function clearMap() {
    ctx.clearRect(0, 0, 960, 480); // clears rectangle
    ctx.fillStyle = "#6b6b6b"; // sets to gray
    ctx.fillRect(0, 0, 960, 480); // fills rectangle
    ctx.fillStyle = "#dee1e6"; // sets to gray
    ctx.fillRect(0, 200, 960, 80); // draws middle rectangle again
}

// end of round cash
function endRoundCash() {
    if (Number.isInteger(round / 1000) === true) { // gives extra cash every 100 secs
        money = money + 100 + round / 20 + (bankAmount * (25 + (utilityLevel * 5))); // 100 + 50 * roundui + 10 * bankAmount
    }
}

// calls position update, unit spawns, and attacks
function refreshUI() {
    if (updateUI === true) { // debug tool
        round += 1; // increases round
        clearMap(); // refreshes map and redraws path
        drawBuilding(); // draws buildings
        spawnUnits(); // spawns new units
        updatePosition(); // moves units
        attack(); // buildings attack and draws attack animations
        clearData(true); // cleans array and awards money
        endRoundCash(); // awards cash at the end of the round
        refreshStatUI(); // refreshes stat ui
        if (lives < 0) {
            alert("Game Over! You got to round: " + Math.floor(round / 1000) + "! Refresh to Play Again!"); // end of game alert
            updateUI = false; // stops updating game
            lives = "Dead"; // sets lives to dead
            refreshStatUI(); // updates stats at the very end
        }
        if (round === 69000) { // win game trigger
            alert("Congradulations on Beating the Game! Every Round that went by was 100 Seconds Wasted in you Life! If you got here Legit Goodjob if not you Found an Exploit yay! You may Continue on in Freeplay and Flex on your Friends!")
        }
    }
}

// calls update every 1/10 second
setInterval(refreshUI, 30);