import words from "./words.js";

// Variable declarations
var wordToGuess;

// Element references
let submitButton = document.getElementById('submit');
let selectedWordArea = document.querySelector('.selected-word');
let guessHistoryPanel = document.querySelector('.guess-history');
let guessList = document.querySelector('.guess-list');

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
    selectedWordArea.innerHTML = '_'.repeat(wordToGuess.length);

    console.log(`Word to guess: ${wordToGuess}`);
}

// Input event listeners
function onSubmitClick() {
    let guess = document.getElementById('guess-textbox').value;
    console.log(`guess: ${guess}`);

    // Make sure guess-history div is visible first
    guessHistoryPanel.style.visibility = 'visible';
    
    var guessItem = document.createElement('li');
    guessItem.append(guess);

    guessList.appendChild(guessItem);

}