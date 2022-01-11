/* let continueGame = "y";

while (continueGame === "y") {

    let death = false; // Variable Set

    // let welcomeMsg = "Welcome! You just entered a cave and there are 2 pathways.";
    alert("Welcome! You just entered a cave and there are 2 pathways.");

    let playerChoice = prompt("Pathway 1(right) or Pathway 2(left)?  (1 or 2)"); // Branch 1
    if (playerChoice === "1") {
        let playerAge = prompt("How old are you?"); // Branch 2a - death
        if (playerAge < 13) {
            alert("too young");
        } else if (playerAge >= 14 && playerAge <= 17) {
            alert("perfect age. tasty. I eat you");
            death = true;
        } else {
            alert("Sorry, you died");
            death = true;
        }
    } else if (playerChoice === "2") { // Branch 2b - survive
        alert("Yay! You passed the bear on the other side. ");
    } else {
        alert("Sorry, there are only 2 caves you died of impatience.");
        death = true;
    }

    if (death === false) {
        alert("You encountered a chest. You got " + Math.floor(Math.random() * 21) + " gold!");
    }

    // Variable set for upcoming fight
    let playerHealth = 100;
    let bearHealth = 100;
    let bearAttack = Math.floor(Math.random() * 10 + 1);
    let playerAttack = Math.floor(Math.random() * 10 + 1);

    // Bear combat
    if (death === false) {
        alert("Oh no! A bear has attacked you! No more running away. You lost " + bearAttack + " hitpoints.");
        playerHealth -= bearAttack;
        alert("Remaining hitpoints: " + playerHealth);

        while (playerHealth >= 1 && bearHealth >= 1) {
            let playerPick = prompt("Would you like to attack(1) or block(2)?");

            if (playerPick === "1") {
                bearHealth -= playerAttack
                alert("You did " + playerAttack + " damage!\nThe bear has " + bearHealth + " health left!");
            } else if (playerPick === "2") {
                alert("You can't block! Its a bear.");
            }

            if (bearHealth >= 1) {
                playerHealth = playerHealth - bearAttack;
                alert("The bear attacks you! You took " + bearAttack + " damage!\nYou have " + playerHealth + " health left!");
            }
        }

    } // Finishing messages
    if (playerHealth <= 0 || death === true) {
        alert("Game Over! You died!");
    } else if (bearHealth <= 0) {
        alert("You won!")
    }
    continueGame = prompt("Would you like to play again (y/n)? ");

}
*/

let continueGame = "y";
while (continueGame == "y") {

    let welcomeMsg = "Welcome to Treasure Hunt! In this game, your objective is to find the pot of gold at the end of the forest! However, there will be obstacles along the way, so you must survive to obtain the gold.";
    alert(welcomeMsg);

    // variables
    let playerHealth = 100
    let monsterHealth = 100

    // ask which cave to enter?
    let playerChoice = Number(prompt("You will have to make many decisions throughout the game. To start off, choose a path. Both paths will eventually reach the gold, although one path will be more difficult. Do you enter path 1, the fire realm? Or path 2, the ice realm? (1 or 2)?"));

    let goodPath = Math.floor(Math.random() * 2) + 1;
    //choose the path
    if (playerChoice === goodPath) {
        alert("Good job! You have chosen the good path. Fortunately, there will be less dangers on the path ")
        let monsterAttack = Number(prompt("You have been walking for hours, and you encounter a 7 foot tall monster with teeth as sharp as knives. You have 100 hitpoints. Do you choose to run (1) or stay and fight (2)?"))
        if (monsterAttack == 1) {
            alert("You run away, only to encounter a 300 foot cliff. You realize that fighting the monster is your only option, so you run back to it.");

        } else if (monsterAttack == 2) {
            alert("Your bravery paid off! The monster is indimitated by you so thankfully it doesn't strike you first.");

        }
        //MONSTER FIGHT SCENE 1
        let fightChoice = Number(prompt("You prepare to face the monster. It has 100 hit points as do you. Do you want to strike its side (1) or body (2)?"))
        let goodFightChoice = Math.floor(Math.random() * 2) + 1;
        if (fightChoice === goodFightChoice) {
            let playerDmg = Math.floor(Math.random() * 80) + 60;
            let monsterHealth = 100 - playerDmg
            alert("you attack the monster and do a HUGE amount of damage! You deal " + playerDmg + "damage and the monster is left with " + 100 - playerDmg + "health.")

        } else {
            let playerDmg = Math.floor(Math.random() * 50) + 30;
            let monsterHealth = 100 - playerDmg
            alert("You missed your strike, but you did hit part of the monster. You deal " + playerDmg + " damage, and the monster is left with " + monsterHealth + " health.");
        }
        //MONSTER FIGHT SCENE 2
        alert("The monster is startled by your sudden attack and is thrown back. You quickly look at your surroundings to see if anything could help you finish it off. You notice a mysterious scroll on a nearby tree. It reads 'I make up oceans and seas and all in between. I am the monster's weakness, so use me for success.'");
        alert("You pause to think for a moment, and you realize the answer to the riddle is water! You figured out the monster's weakness!");

        let fightChoiceSecond = Number(prompt("You remember your water bottle inside of your backpack. You notice the monster is almost recovered and is strolling towards you to finish you off. Do you risk turning around to grab your water bottle (1) or do you get ready to fight it with your hands again (2)"));


        if (fightChoiceSecond == 1) {
            let playerDmg = monsterHealth;
            let monsterHealth = monsterHealth - playerDmg;
            alert("You quickly unzip your backpack, grab the bottle, open the lid, and fling the water at the monster. Upon contact, the water shrivels up the monster until it is nothing more than a pile of sand. Your water attack did " + playerDmg + " damage. You have successfully defeated the monster!");

        } else {
            let playerDmg = Math.floor(Math.random() * 10) + 5;
            let monsterHealth = monsterHealth - playerDmg;
            let monsterDmg = Math.floor(Math.random() * 90) + 95;
            let playerHealth = 100 - monsterDmg;
            alert("You decide to fight the monster with your bare hands, but this was a poor decision. It comes forward and slashes your face, dealing " + monsterDmg + "damage. You are only left with " + playerHealth + "hp.");
        }

    } else if (playerChoice != goodPath) {
        alert("Unfortunately you have chosen the difficult path. The monsters on this path will do more damage and you will have less health.");
    } else {
        alert("That path doesn't exist. Please select 1 or 2");
    }
}