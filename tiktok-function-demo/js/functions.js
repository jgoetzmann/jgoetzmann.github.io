function greet(userName) {
    return "hello " + userName;
}

//let userNameReturn = greet(prompt("What is you name?"));//

// console.log(userNameReturn);

function annoyinggreet(userName, repitions) {
    for (let i = repitions; i > 0; i--) {
        console.log(userName);
    }
}

// annoyinggreet(prompt("What is your name?"), prompt("Number of Reps?"));

function sumOfNumber(number1, number2) {
    let mathz = number1 + number2;
    return mathz;
}

// alert(sumOfNumber((Number(prompt("Number 1"))), Number(prompt("Number2"))));

function sqre(number1) {
    let mathz = number1 ** 2;
    return mathz;
}

// alert(sqre((Number(prompt("Number 1"))));

// alert(sumOfNumber(sqre(Number(prompt("Number 1"))), sqre(Number(prompt("Number 2")))))

function sqroot(number1, number2) {
    let mathz = number1 ** 2 + number2 ** 2;
    return (Math.sqrt(mathz));
}

alert(sqroot((Number(prompt("Number 1"))), Number(prompt("Number2"))));