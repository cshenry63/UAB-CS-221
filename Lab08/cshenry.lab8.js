const choices = ["rock", "paper", "scissors"];
const result = document.getElementById("result");

function playGame(userChoice) {
    const computerChoice = choices[Math.floor(Math.random() * choices.length)];
    let outcome;

    if (userChoice === computerChoice) {
        outcome = "It's a tie!";
    } else if (
        (userChoice === "rock" && computerChoice === "scissors") ||
        (userChoice === "paper" && computerChoice === "rock") ||
        (userChoice === "scissors" && computerChoice === "paper")
    ) {
        outcome = "You win!";
    } else {
        outcome = "Computer wins!";
    }

    result.textContent = `You chose ${userChoice}, Computer chose ${computerChoice}. ${outcome}`;
}

choices.forEach(choice => {
    document.getElementById(choice).addEventListener("click", () => playGame(choice));
});
