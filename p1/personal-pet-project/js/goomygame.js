console.log("Hello World");

const bp = [100, 200, 120, 800];
const moves = ["Jay beam", "Rishay Punch", "Ethan Slam", "Soren Smack"];

console.log(bp[0]);
console.log(moves[0]);

// Debug values
let testGoomy = 0;

// Second Check value
let gameLength = 0;

// Base values 
let happiness = 50;
let hunger = 10;
let health = 50;

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
let goomyImage = document.getElementById("goomy-image")
const goomyLibrary = ["images/goomy-god.png", "images/goomy-flushed.png", "images/goomy-very-happy.jpg", "images/goomy-happy.jpg", "images/goomy-neutral.jpg", "images/goomy-annoyed.jpeg", "images/goomy-very-sad.jpg", "images/goomy-distress.jpg", "images/goomy-dead.jpg"];

/*
let happinessMeter = document.getElementById("hapiness-meter");
let hungerMeter = document.getElementById("hunger-meter");
let healthMeter = document.getElementById("health-meter");
*/

// Amuse onClick
function amuseGoomy() {
    console.log("Amuse Trigger");
    if (happiness >= 90) { happiness = 100 } else { happiness += 10 };
    console.log("happines: " + happiness);
}

// Feed oncluck
function feedGoomy() {
    console.log("Feed Trigger");
    if (hunger >= 18) { hunger = 20 } else { hunger += 2 };
    console.log("hunger: " + hunger);
}

// Heal onClick
function healGoomy() {
    console.log("Heal Trigger");
    if (health >= 95) { health = 100 } else { health += 5 };
    console.log("health: " + health);
}

// Updates UI
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

// Updates values
function updateValues() {

    if (Number.isInteger(gameLength / 10) === true) {
        if (happiness > 0) { happiness -= happinessUpdateValue };
        if (hunger > 0) { hunger -= hungerUpdateValue };
        if (health > 0) { health -= healthUpdateValue };
        console.log("update at " + gameLength);

        updatePicture();
    }
    refreshUI();

    gameLength += 1;
    console.log(gameLength);
}

function updatePicture() {
    goomyImage.src = goomyLibrary[testGoomy]
}