let continueGame = "y";

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