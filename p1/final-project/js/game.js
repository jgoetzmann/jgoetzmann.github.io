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
let button13 = document.getElementById("button13");
let button14 = document.getElementById("button14");
let button15 = document.getElementById("button15");
let button16 = document.getElementById("button16");
let button17 = document.getElementById("button17");
let button18 = document.getElementById("button18");
let button19 = document.getElementById("button19");
let button20 = document.getElementById("button20");
let button21 = document.getElementById("button21");
let button22 = document.getElementById("button22");
let button23 = document.getElementById("button23");
let button24 = document.getElementById("button24");

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
let buttonCost13 = 1500;
let buttonCost14 = 5000;
let buttonCost15 = 500;
let buttonCost16 = 2500;
let buttonCost17 = 200;
let buttonCost18 = 750;
let buttonCost19 = 1500;
let buttonCost20 = 3000;
let buttonCost21 = 12500;
let buttonCost22 = 12500;
let buttonCost23 = 12500;
let buttonCost24 = 12500;

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
    [], // dead
    [] // id
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
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11] // id
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
    [], // id
    [] // buffs
];

const buildingSpawns = [
    ["canon", "multi canon", "huge canon", "laser", "frost laser", "super laser", "moving canon", "death laser", "missile", "scatter missle", "toxic missle", "shock missle", "legend 1", "legend 2", "legend 3", "legend 4", "car canon"], // name
    [1, 1, 1, 2, 2, 2, 1, 2, 3, 3, 3, 3, 0, 0, 0, 0, 1], // properties
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // positionX
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // positionY
    [5, 7.5, 12.5, 5, 7.5, 12.5, 10, 15, 5, 7.5, 12.5, 15, 0, 0, 0, 0, 4.8], // size (radius)
    [50, 30, 100, 60, 20, 100, 50, 400, 400, 30, 20, 20, 0, 0, 0, 0, 30], // range
    [30, 30, 80, 1, 200, 5, 600, 600, 120, 50, 20, 20, 0, 0, 0, 0, 5], // attackspeed
    [5, 5, 250, 3, 0.9, 0.5, 100, 50, 0, 0, 0, 0, 0, 0, 0, 0, 1], // damage per shot
    [1, 3, 1, 1, 1, 10, 1, 10, 0, 0, 0, 0, 0, 0, 0, 0, 1], // targets
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 6.1], // special ability and id
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] // buffs
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
        if (positionTestY < 480 && positionTestY > 0 && positionBuildingTest(positionTestX, positionTestY, size) === true && (positionTestY < (200 - size) || positionTestY > (280 + size))) {
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
    buildingSpawns[7][0] += 10; // damage per hit
    buildingSpawns[6][0] -= 3; // attack speed
    if (buildingSpawns[6][0] < 5) { buildingSpawns[6][i] = 5 } // sets attackspeed to laser speed if too low
    buildingSpawns[5][0] += 10; // range
    buildingSpawns[7][1] += 5; // damage per hit
    buildingSpawns[5][1] += 5; // range
    buildingSpawns[8][1] += 1; // targets
    buildingSpawns[7][2] += 150; // damage per hit
    buildingSpawns[5][2] += 20; // range
    buildingSpawns[7][6] += (Math.floor(50 * ((1 + canonLevel)) / 2)) // damage on spawned units
    buildingSpawns[7][16] += (canonLevel); // on hit damage of car
    buildingSpawns[5][16] += 5; // range of car
    for (i = 0; i < buildingData[0].length; i++) { // iterates through canons on field
        if (buildingData[9][i] === 0) { // canon
            buildingData[7][i] += 10; // damage per hit
            buildingData[6][i] -= 3; // attack speed
            if (buildingData[6][i] < 5) { buildingData[6][i] = 5 } // sets attackspeed to laser speed if too low
            buildingData[5][i] += 10; // range
        } else if (buildingData[9][i] === 1) { // multi canon
            buildingData[7][i] += 5; // damage per hit
            buildingData[5][i] += 5; // range
            buildingData[8][i] += 1; // targets
        } else if (buildingData[9][i] === 2) { // huge canon
            buildingData[7][i] += 150; // damage per hit
            buildingData[5][i] += 20; // range
        } else if (buildingData[9][i] === 6) { // moving canon
            buildingData[7][i] += (Math.floor(50 * ((1 + canonLevel))) / 2) // damage on spawned units
        } else if (buildingData[9][i] === 16) { // moving car
            buildingData[7][i] += (canonLevel); // on hit damage of car
            buildingData[5][i] += 5; // range of car
        }
    }
}

// upgrades laser in data and in spawn arrays
function laserUpgrade() {
    buildingSpawns[7][3] += 3; // % damage per hit
    buildingSpawns[5][3] += 5; // range
    buildingSpawns[5][4] += 5; // range
    buildingSpawns[8][4] += 1; // targets
    buildingSpawns[7][6] += (laserLevel / 2); // damage per hit
    buildingSpawns[5][5] += 20; // range
    for (i = 0; i < buildingData[0].length; i++) { // iterates through lasers on field
        if (buildingData[9][i] === 3) { // laser
            buildingData[7][i] += 3; // % damage per hit
            buildingData[5][i] += 5; // range
        } else if (buildingData[9][i] === 4) { // frost laser
            buildingData[5][i] += 5; // range
            buildingData[8][i] += 1; // targets
        } else if (buildingData[9][i] === 5) { // super laser
            buildingData[7][i] += (laserLevel / 2); // damage per hit
            buildingData[5][i] += 20; // range
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
        for (i = 0; i < buildingSpawns.length; i++) { // loops through array to push to data
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
        for (i = 0; i < buildingSpawns.length; i++) { // loops through array to push to data
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
        for (i = 0; i < buildingSpawns.length; i++) { // loops through array to push to data
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
        for (i = 0; i < buildingSpawns.length; i++) { // loops through array to push to data
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
        for (i = 0; i < buildingSpawns.length; i++) { // loops through array to push to data
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
        for (i = 0; i < buildingSpawns.length; i++) { // loops through array to push to data
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

function purchase13() { // moving canon
    let buildingType = 6; // what building you are spawning
    xPush = 0; // refresh x push value
    yPush = 0; // refresh y push value
    if (money >= buttonCost13 && buildingPlacement(buildingSpawns[5][buildingType], buildingSpawns[4][buildingType]) === true) { // Check Money and Collision
        money -= buttonCost13; // taxes money
        for (i = 0; i < buildingSpawns.length; i++) { // loops through array to push to data
            if (i === 2) { // checks if i is push x cords
                buildingData[i].push(xPush); // pushes correcy x cords
            } else if (i === 3) { // checks if i is push y cords
                buildingData[i].push(yPush); // pushes correcy y cords
            } else { // pushes cords based on array value if not cords
                buildingData[i].push(buildingSpawns[i][buildingType]); // adds to data array
            }
        }
        buttonCost13 += 1500; // increases cost
        console.log("Purchase 13 Success"); // logs success
        button13.innerHTML = "Buy Moving Canon! ($" + buttonCost13 + ")"; // updates ui
    } else {
        console.log("Purchase 13 Fail"); // logs fail
    }
}

function purchase14() {
    let buildingType = 7; // what building you are spawning
    xPush = 0; // refresh x push value
    yPush = 0; // refresh y push value
    if (money >= buttonCost14 && buildingPlacement(buildingSpawns[5][buildingType], buildingSpawns[4][buildingType]) === true) { // Check Money and Collision
        money -= buttonCost14; // taxes money
        for (i = 0; i < buildingSpawns.length; i++) { // loops through array to push to data
            if (i === 2) { // checks if i is push x cords
                buildingData[i].push(xPush); // pushes correcy x cords
            } else if (i === 3) { // checks if i is push y cords
                buildingData[i].push(yPush); // pushes correcy y cords
            } else { // pushes cords based on array value if not cords
                buildingData[i].push(buildingSpawns[i][buildingType]); // adds to data array
            }
        }
        buttonCost14 += 5000; // increases cost
        console.log("Purchase 14 Success"); // logs success
        button13.innerHTML = "Buy Death Laser! ($" + buttonCost14 + ")"; // updates ui
    } else {
        console.log("Purchase 14 Fail"); // logs fail
    }
}


///// Timebased Functions /////



// sets adds skew to spawns
function positionOffset(size) {
    return Math.random() * size + 200;
}

// takes in size and returns lives that should be lost
function livesCost(enemyID) {
    switch (data[7][enemyID]) { // switches id to deterime lives lost
        case 11: // boss
            return 200;
        case 10: // huge
            return 100;
        case 9: // large
        case 8:
        case 7:
            return 25;
        case 6: // medium
        case 5:
        case 4:
            return 10;
        case 3: // small
        case 2:
            return 3;
        case 1: // tiny
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
        for (i = 0; i < spawns.length; i++) {
            data[i].push(spawns[i][spawnChoice]); // adds to data array
        }
    }
}

// draws building size on field
function drawBuilding() {
    if (buildingData[0].length > 0) { // makes sure array has something in it
        for (i = 0; i < buildingData[0].length; i++) { // iterates through loop
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
                case 6:
                case 6.1:
                    ctx.fillStyle = "#ff3636"; // color
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
    let randomChoice = Math.ceil(Math.random() * 100); // draws random number
    for (i = spawns[0].length - 1; i > 0; i--) { // calls large first then descends to small
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
            ctx.strokeStyle = "#ff3636"; // color
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
        case 6.1: // moving canon
            ctx.strokeStyle = "#ff3636"; // color
            ctx.lineWidth = 2.5;
            break;
        case 7: // death laser
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
        for (j = spawns[0].length - 1; j > 0; j--) { // loops through strongest to weakes data set
            for (k = 0; k < data[0].length; k++) { // loops through array
                let circle2X = data[2][k] + (data[5][k] / 2); // finds center of x of cube
                let circle2Y = data[3][k] + (data[5][k] / 2); // finds center of y of cube
                let circle2Radi = data[5][k] / 2 // find radi
                if (j === data[7][k] && collisionAttackCheck(positionXAttack, positionYAttack, rangeAttack, circle2X, circle2Y, circle2Radi) === true) { // finds units ordering from strongest to weakist
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

// spawns car
function spawnCar() {
    for (j = 0; j < buildingSpawns.length; j++) {
        if (j === 2) { // if x position
            buildingData[j].push(1100) // sets building to x
        } else if (j === 3) {
            buildingData[j].push(Math.ceil(Math.random() * 70) + 205) // skews y
        } else {
            buildingData[j].push(buildingSpawns[j][16]); // pushes car onto field
        }
    }
}

// math behind circle square collision
function circleSquareCollision(circle, rect) {
    let distX = Math.abs(circle.x - rect.x - rect.w / 2);
    let distY = Math.abs(circle.y - rect.y - rect.h / 2);
    if (distX > (rect.w / 2 + circle.r)) { return false; }
    if (distY > (rect.h / 2 + circle.r)) { return false; }
    if (distX <= (rect.w / 2)) { return true; }
    if (distY <= (rect.h / 2)) { return true; }
    let dx = distX - rect.w / 2;
    let dy = distY - rect.h / 2;
    return (dx * dx + dy * dy <= (circle.r * circle.r)); // returns true if collision
}

// moves car and checks for collision
function carCollision(i) {
    buildingData[2][i] -= 0.8; // updates xPosition
    let circle = { x: buildingData[2][i], y: buildingData[3][i], r: buildingData[4][i] }; // circle object define
    for (j = 0; j < data[0].length; j++) { // iterates through enemy
        let rect = { x: data[2][j], y: data[3][j], w: data[5][j], h: data[5][j] }; // defines rectangle test
        if (circleSquareCollision(circle, rect) === true) { // if collision detected
            data[1][j] -= buildingSpawns[7][6]; // removes hp from cube
            return true; // if collision removes hp from building
        }
    }
    return false;
}

// calculate tower attacks
function attack() {
    if (buildingData[0].length > 0) { // checks that there is units
        for (i = 0; i < buildingData[0].length; i++) { // iterates through loop
            if (buildingData[9][i] === 6.1) { // checks if car
                if (carCollision(i) === true || buildingData[3][i] < 0) { // check if collision or offscreen
                    for (k = 0; k < buildingData.length; k++) { // iterates through arrays in building data
                        buildingData[k].splice(i, 1); // removes building from unit array
                    }
                }
            }
            if (Number.isInteger(round / buildingData[6][i]) === true) { // attackspeed
                for (n = 0; n < buildingData[8][i]; n++) { // loops through attack depending on target
                    let enemyTarget = 0; // resets target
                    switch (buildingData[9][i]) {
                        case 0:
                        case 6.1:
                            enemyTarget = findEnemy(i, 1); // first
                            break;
                        case 5:
                        case 1:
                        case 4:
                            enemyTarget = findEnemy(i, 2); // random
                            break;
                        case 3:
                        case 2: // 
                            enemyTarget = findEnemy(i, 0); // strong
                            break;
                        case 6: // canon maker
                            spawnCar(); // spawns car
                            console.log(buildingData[0][i] + " spawned " + buildingData[0][buildingData[0].length - 1]); // logs spawn message
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
                                    console.log(buildingData[0][i] + " dealt 100 damage!")
                                } else { // if not boss
                                    data[1][enemyTarget] -= Math.ceil((data[1][enemyTarget] / 100) * buildingData[7][i]); // takes hp of unit and divdes its hp 100 and multiplies it by damage then subtracts it
                                    console.log(buildingData[0][i] + " dealt " + Math.ceil((data[1][enemyTarget] / 100) * buildingData[7][i]) + " damage!"); // logs damage

                                }
                                break;
                            case 4: // frost laser
                                drawProjectiles(buildingData[2][i], buildingData[3][i], (data[2][enemyTarget]) + (data[5][enemyTarget] / 2), (data[3][enemyTarget]) + (data[5][enemyTarget] / 2), 4); // draws projectiles
                                data[4][enemyTarget] = 0.02 // slows based on level
                                console.log(buildingData[0][i] + " slowed a unit by 10%!"); // logs damage
                                break;
                            case 6.1: // moving canon factory
                                drawProjectiles(buildingData[2][i], buildingData[3][i], (data[2][enemyTarget]) + (data[5][enemyTarget] / 2), (data[3][enemyTarget]) + (data[5][enemyTarget] / 2), 6.1); // draws projectiles
                                data[1][enemyTarget] -= buildingData[7][i]; // takes damage per shot and subtracts from hp
                                console.log(buildingData[0][i] + " dealt " + buildingData[7][i] + " damage!"); // logs damage
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
    for (i = data[0].length - 1; i >= 0; i--) { // runs through array back to front
        if (data[6][i] === true || data[1][i] < 1) { // checks if dead or has <1 hp
            if (deathMoney === true) { // checks if death money should be awarded
                money += Math.floor(data[5][i] * (2 + (5 * utilityLevel / 100))); // awards money
            }
            for (j = 0; j < data.length; j++) { // selects all arrays of an index
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
            alert("Congradulations on Beating the Game! Every Round that went by was 30 Seconds Wasted in you Life! If you got here Legit Good Job if not you Found an Exploit Yay! You may Continue on in Freeplay and Flex on your Friends!")
        }
    }
}

// calls update every 3/10 second
setInterval(refreshUI, 30);