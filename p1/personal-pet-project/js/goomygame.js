console.log("Hello World")

const bp = [100, 200, 120, 800];
const moves = ["Jay beam", "Rishay Punch", "Ethan Slam", "Soren Smack"];

console.log(bp[0]);
console.log(moves[0]);

// Base values 
let happiness = 50;
let hunger = 5;
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
let happinessUpdateValue = 10
let hungerUpdateValue = 1
let healthUpdateValue = 5

// Image values 
let goomyImage = document.getElementById("goomy-image")

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
    if (hunger >= 9) { hunger = 10 } else { hunger += 1 };
    console.log("hunger: " + hunger);
}

// Heal onClick
function healGoomy() {
    console.log("Heal Trigger");
    if (health >= 90) { health = 100 } else { health += 10 };
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
setInterval(updateValues, 1000);

// Updates values
function updateValues() {
    if (happiness > 0) { happiness -= happinessUpdateValue };
    if (hunger > 0) { hunger -= hungerUpdateValue };
    if (health > 0) { health -= healthUpdateValue };
    refreshUI();
}

function updatePicture() {
    goomyImage.src = goomy
}