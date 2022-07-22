import words from "./words.js";

// Variable declarations
var wordToGuess;

// Element references
let submitButton = document.getElementById('submit');
let selectedWord = document.querySelector('.selected-word');

// Event listeners
submitButton.addEventListener("click", onSubmitClick);

setupGame();

// Debugging
// words.forEach((word) => {console.log(word)});

function setupGame() {
    // Hide person pieces and guess history
    document.querySelectorAll('.pieces > *').forEach((piece) => {
        piece.style.visibility = 'hidden';
    });
    document.querySelector('.guess-history').style.visibility = 'hidden';

    // Select a random word for the player to guess
    wordToGuess = words[Math.floor(Math.random() * words.length)];
    selectedWord.innerHTML = '_'.repeat(wordToGuess.length);
}

// Input event listeners
function onSubmitClick() {
    let guess = document.getElementById('guess-textbox').value;
}