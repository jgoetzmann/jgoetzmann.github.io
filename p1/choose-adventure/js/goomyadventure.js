alert("Welcome to Goomy Rouge Like Game");
// starts game
let start = true;

// checks if player wants to play the game
while (start == true) {

    // set user variables
    let life = 50;
    let move1 = "tackle";
    let move2 = "shield";
    let death = false;
    let playAgain = "no";
    let goomyLevel = 0;
    let money = 5;
    let treasure = false;

    // set enemy health
    function enemyHealthz(level) {
        let healthReturn = Math.floor(Math.random() * 5 + 3) * (3 * level);
        return healthReturn;
    }

    // set enemy attack1
    function enemyAttack1z() {
        let attack1Return = "tackle";
        return attack1Return;
    }

    // set enermy attack2
    function enemyAttack2z() {
        let attack2Return = "smack";
        return attack2Return;
    }


    function shop() {
        let shopSelection = prompt("You are in the shop! You have " + money + " gold!\nThey are servering:\n$2 Health (1)\n$10 Health (2)\n$20 Random Treasure (3)");
        if (shopSelection == 1 && money >= 2) {
            life += 2;
            money -= 2;
            alert("You bought 2 Health for $2!");
        } else if (shopSelection == 2 && money >= 10) {
            life += 12;
            money -= 10;
            alert("You bought 12 Health for $10!");
        } else if (shopSelection == 3 && money >= 20 && treasure == false) {
            treasure == true;
            money -= 20;
            alert("You bought a Treasure! If you win it will be even more epic!");
        } else {
            alert("You are either too broke or bought something that doesnt exist!");
        }
        return "Thank you for coming"
    }

    // battle function
    function battle(level) {
        let enemyHealth = 0;
        enemyHealth = enemyHealthz(level);
        let enemyAttack1 = enemyAttack1z();
        let enemyAttack2 = enemyAttack2z();

        // end of battle reward
        function reward() {
            money += level + 5
            return "You have " + money + " gold! \nDo you want to do to the shop? (yes/no)"
        }

        while (enemyHealth > 0 && life > 0) {
            // prompt for user move
            let userAttack = prompt("There is a level " + goomyLevel + " enemy goomy with: \n" + enemyHealth + " health \nDo you want to attack it with: \n" + move1 + " (1) \n" + move2 + " (2)");
            let userAttackSelect = false;
            let userBlockSelect = false;
            let userErrorSelect = false;
            let userAttackBlocked = 0;
            let userAttackAmount = 0; // amoung us
            let enemyMove = Math.floor(Math.random() * 2 + 1);
            let enemyAttack = 0;
            let damageTaken = 0;

            // user move select
            if (userAttack == 1) {
                if (move1 == "tackle") {
                    userAttackSelect = true;
                    userAttackAmount = Math.floor(Math.random() * 5 + 5);
                } else if (move1 == "shield") {
                    userBlockSelect = true;
                    userAttackBlocked = 5;
                } else {
                    userErrorSelect = true;
                }
            } else if (userAttack == 2) {
                if (move2 == "tackle") {
                    userAttackSelect = true;
                    userAttackAmount = Math.floor(Math.random() * 5 + 5);
                } else if (move2 == "shield") {
                    userBlockSelect = true;
                    userAttackBlocked = 12;
                } else {
                    userErrorSelect = true;
                }
            } else {
                userErrorSelect = true;
            }

            // enemy move select
            if (enemyMove == 1) {
                if (enemyAttack1 == "tackle") {
                    enemyAttack = Math.floor(Math.random() * 5 + 5);
                } else {
                    enemyAttack = 10 + level;
                }
            } else {
                if (enemyAttack2 == "tackle") {
                    enemyAttack = Math.floor(Math.random() * 6 * 3);
                } else {
                    enemyAttack = 10 + level;
                }
            }

            // damage function
            function damageCalc() {
                if (userBlockSelect == true) {
                    damageTaken = enemyAttack - userAttackBlocked;
                    life -= damageTaken
                    return "You blocked " + userAttackBlocked + " damage! \nThe enemy goomy has " + enemyHealth + " health left! \nYou took " + damageTaken + " damage!\nYou have " + life + " health left!";
                } else if (userAttackSelect == true) {
                    damageTaken = enemyAttack - userAttackBlocked;
                    enemyHealth -= userAttackAmount;
                    if (enemyHealth <= 0) {
                        return "You dealt " + userAttackAmount + " damage! \nThe enemy goomy has died! \nYou killed it before it could attack!\nYou have " + life + " health left!";
                    } else {
                        life -= damageTaken;
                        return "You dealt " + userAttackAmount + " damage! \nThe enemy goomy has " + enemyHealth + " health left! \nYou took " + damageTaken + " damage!\nYou have " + life + " health left!";
                    }
                } else {
                    damageTaken = enemyAttack - userAttackBlocked;
                    life -= damageTaken;
                    return "Your move failed!\nThe enemy goomy has " + enemyHealth + " health left! \nYou took " + damageTaken + " damage!\nYou have " + life + " health left!";
                }
            }

            // information return
            alert(damageCalc())

            // check if user is not dead
            if (life <= 0) {
                death = true;
            }
        }

        // requests shop
        let shopz = prompt(reward());

        // actual shop (too lazy to make into function)
        if (shopz == "yes" || shopz == "Yes") {
            alert(shop());
        }
    }

    // enemy you fight
    if (death == false) {
        for (let i = 1; i <= 9; i++) {
            goomyLevel = i
            battle(i);
        }
    }

    // prompts replay after win or lose
    if (death === true) { // I had big change heart (i love === now)
        alert("You lost Skillissue");
        playAgain = prompt("Do you want to play again? (yes/no)");
        if (playAgain == "yes" || playAgain == "Yes") {} else {
            start = false;
        }
    } else if (treasure == true) {
        alert("You won and you have the treasure! Epic Gamer!")
        playAgain = prompt("Do you want to play again? (yes/no)");
        if (playAgain == "yes" || playAgain == "Yes") {} else {
            start = false;
        }
    } else {
        alert("You won but didnt get the treasure :(")
        playAgain = prompt("Do you want to play again? (yes/no)");
        if (playAgain == "yes" || playAgain == "Yes") {} else {
            start = false;
        }
    }
}