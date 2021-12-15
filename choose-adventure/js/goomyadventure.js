alert("Welcome to Goomy Rouge Like Game");
// starts game
let start = true;

// checks if player is alive

while (start == true) {

    // set user variables
    let life = 300;
    let move1 = "tackle";
    let move2 = "shield";
    let death = false;
    let playAgain = "no";
    let goomyLevel = 0


    // set enemy health
    function enemyHealthz(level) {
        let healthReturn = Math.floor(Math.random() * 4 * level + level * 2);
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

    // battle function
    function battle(level) {
        let enemyHealth = 0;
        enemyHealth = enemyHealthz(level);
        let enemyAttack1 = enemyAttack1z();
        let enemyAttack2 = enemyAttack2z();

        while (enemyHealth > 0 && life > 0) {
            let userAttack = prompt("There is an level " + goomyLevel + " enemy goomy with: \n" + enemyHealth + " health \nDo you want to attack it with: \n" + move1 + " (1) \n" + move2 + " (2)");
            let userAttackSelect = false;
            let userBlockSelect = false;
            let userErrorSelect = false;
            let userAttackBlocked = 0;
            let userAttackAmount = 0; // amoung us
            let enemyMove = Math.floor(Math.random() * 2 + 1);
            let enemyAttack = 0;

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
                    userAttackBlocked = 5;
                } else {
                    userErrorSelect = true;
                }
            } else {
                userErrorSelect = true;
            }

            if (enemyMove == 1) {
                if (enemyAttack1 == "tackle") {
                    enemyAttack = Math.floor(Math.random() * 5 + 5);
                } else {
                    enemyAttack = 12;
                }
            } else {
                if (enemyAttack2 == "tackle") {
                    enemyAttack = Math.floor(Math.random() * 5 + 5);
                } else {
                    enemyAttack = 12;
                }
            }

            if (userErrorSelect == false) {
                if (userBlockSelect == true) {
                    life -= enemyAttack - userAttackBlocked;
                    userBlockSelect = false;
                } else {
                    life -= enemyAttack;
                }
                if (userAttackSelect == true) {
                    life -= enemyAttack;
                    enemyHealth -= userAttackAmount;
                    userAttackSelect = false;
                }
                userErrorSelect = false;
            } else {
                life -= enemyAttack;
            }

            alert("You dealt " + userAttackAmount + " damage! \nThe enemy goomy has " + enemyHealth + " health left! \nYou took damage! You have " + life + " health left!");

            if (life <= 0) {
                death = true;
            }
        }
    }

    // enemy you fight
    while (death == false) {
        for (let i = 1; i <= 9; i++) {
            goomyLevel = i
            battle(i);
        }
    }

    if (death === true) { // I had big change heart (i love === now)
        alert("You lost Skillissue");
        playAgain = prompt("Do you want to play again? (yes/no)");
        if (playAgain == "yes" || playAgain == "Yes") {} else {
            start = false;
        }
    } else {
        alert("You won!")
        playAgain = prompt("Do you want to play again? (yes/no)");
        if (playAgain == "yes" || playAgain == "Yes") {} else {
            start = false;
        }
    }
}