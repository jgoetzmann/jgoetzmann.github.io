// Goomy Game Code:

// Debug values
let testGoomy = 0;

// Second Check value
let gameLength = 0;

// Base values 
let happiness = 50;
let hunger = 10;
let health = 50;
let statTotal = 150;

// Meter values
let happinessMeter = document.getElementById("hapiness-meter");
let hungerMeter = document.getElementById("hunger-meter");
let healthMeter = document.getElementById("health-meter");

// Paragraph values
let happinessParagraph = document.getElementById("happiness-paragraph");
let hungerParagraph = document.getElementById("hunger-paragraph");
let healthParagraph = document.getElementById("health-paragraph");

// Update values (difficulty)
let happinessUpdateValue = 1;
let hungerUpdateValue = .5;
let healthUpdateValue = .5;

// Image values 
let goomyImage = document.getElementById("goomy-image");
const goomyLibrary = ["images/goomy-god.png", "images/goomy-flushed.png", "images/goomy-very-happy.jpg", "images/goomy-happy.jpg", "images/goomy-neutral.jpg", "images/goomy-annoyed.jpeg", "images/goomy-very-sad.jpg", "images/goomy-distress.jpg", "images/goomy-dead.jpg"];
goomyImageLibrary = 4;
isDead = false;

// Log values
let logParagraph = document.getElementById("log-paragraph");
const displayArray = ["<br>", "<br>", "<br>", "<br>", "<br>", "<br>", "<br>", "<br>", "<br>", "<br>", "<br>", "<br>", "<br>", "<br>", "<br>", "<br>", "<br>", "<br>", "<br>", "<br>"];

// Amuse onClick
function amuseGoomy() {
    // console.log("Amuse Trigger");
    if (happiness >= 90) { happiness = 100 } else { happiness += 10 };
    // console.log("happines: " + happiness);
    displayLog("You Amused Goomy!")
}

// Feed onClick
function feedGoomy() {
    // console.log("Feed Trigger");
    if (hunger >= 18) { hunger = 20 } else { hunger += 2 };
    // console.log("hunger: " + hunger);
    displayLog("You Fed Goomy!")
}

// Heal onClick
function healGoomy() {
    // console.log("Heal Trigger");
    if (health >= 95) { health = 100 } else { health += 5 };
    // console.log("health: " + health);
    displayLog("You Healed Goomy!")
}

// Calls from Full UI Refresh -- Updates Meters
function refreshUI() {
    let happinessMeter = document.getElementById("hapiness-meter");
    let hungerMeter = document.getElementById("hunger-meter");
    let healthMeter = document.getElementById("health-meter");

    /*
    console.log(happinessMeter);
    console.log(hungerMeter);
    console.log(healthMeter);
    */

    happinessMeter.value = happiness;
    hungerMeter.value = hunger;
    healthMeter.value = health;

    let happinessParagraph = document.getElementById("happiness-paragraph");
    let hungerParagraph = document.getElementById("hunger-paragraph");
    let healthParagraph = document.getElementById("health-paragraph");

    /*
    console.log(happinessParagraph);
    console.log(hungerParagraph);
    console.log(healthParagraph);
    */

    happinessParagraph.innerHTML = happiness;
    hungerParagraph.innerHTML = hunger;
    healthParagraph.innerHTML = health;
}

// Calls for Update every second
setInterval(updateValues, 100);

// Calls from Above -- Calls for Full UI Refresh
function updateValues() {

    if (Number.isInteger(gameLength / 10) === true) {
        if (happiness > 0) { happiness -= happinessUpdateValue };
        if (hunger > 0) { hunger -= hungerUpdateValue };
        if (health > 0) { health -= healthUpdateValue };
        // console.log("update at " + gameLength);

        updatePicture();
    }
    refreshUI();

    gameLength += 1;
    // console.log(gameLength);
    // displayLog(gameLength);
}

// Calls from Full UI Refresh -- Updates Picture
function updatePicture() {
    statTotal = happiness + health + (hunger * 5);

    if (50 > statTotal && statTotal >= 1) {
        goomyImageLibrary = 7;
        displayLog("[" + gameLength + "] Goomy is in Distress");
    } else if (100 > statTotal && statTotal >= 50) {
        goomyImageLibrary = 6;
        displayLog("Goomy is Very Sad");
    } else if (133 > statTotal && statTotal >= 100) {
        goomyImageLibrary = 5;
        displayLog("Goomy is Annoyed");
    } else if (166 > statTotal && statTotal >= 133) {
        goomyImageLibrary = 4;
        displayLog("Goomy is feeling OK");
    } else if (200 > statTotal && statTotal >= 166) {
        goomyImageLibrary = 3;
        displayLog("Goomy is Happy");
    } else if (250 > statTotal && statTotal >= 200) {
        goomyImageLibrary = 2;
        displayLog("Goomy is Very Happy!");
    } else if (300 > statTotal && statTotal >= 250) {
        goomyImageLibrary = 1;
        displayLog("Goomy is falling for you!!!");
    } else if (statTotal === 300) {
        goomyImageLibrary = 0;
        displayLog("Goomy is God!!!!!");
    } else if (statTotal === 0) {
        goomyImageLibrary = 8;
        displayLog("Goomy Fainted for Our Sins");
        if (isDead === false) { death() };
    } else {
        console.log("Error")
    }

    goomyImage.src = goomyLibrary[goomyImageLibrary];
}

// Gameover Function
function death() {
    let hideUI = document.getElementById("game-ui")
    hideUI.style.visibility = "hidden";
    alert("Goomy Fainted they lived for: " + Math.round(gameLength / 10) + " seconds!");
    isDead = true;
}

// Calls from Anywhere -- Updates Log
function displayLog(message) {

    let userLog = "";

    displayArray[0] = "[" + gameLength + "] " + message + "<br><br>";

    for (let i = 20; i >= 0; i--) {
        displayArray[i + 1] = displayArray[i];
    }

    displayArray[0] = "<br> Your Log: <br> <br>"
    delete displayArray[21];

    for (let i = 0; i < 21; i++) {
        userLog += displayArray[i];
    }
    logParagraph.innerHTML = userLog;

    // console.log(displayArray);
}