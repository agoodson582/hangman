import words from "./words.js";

// Regular expressions for validating inputs
const hasDigit = /\d/;

// Variable declarations
var wordToGuess;

// Element references
let guessTextBox = document.getElementById('guess-textbox');
let submitButton = document.getElementById('submit');
let selectedWordArea = document.querySelector('.selected-word');
let guessHistoryPanel = document.querySelector('.guess-history');
let guessList = document.querySelector('.guess-list');

// Event listeners
submitButton.addEventListener('click', onSubmitClick);
guessTextBox.addEventListener('keydown', onEnterPressed);

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

function isValidInput(value) {
    return !hasDigit.test(value);
}

/**
 * Search the location(s) of a guessed letter in the selected word.
 * 
 * @param {string} letter The letter to locate in the word
 * @param {string} word The word to search for the letter inside
 * @returns {number[]} The location(s) of the letter
 */
function locateLetters(letter, word) {
    let locations = [];
    let cursor = 0;

    while ((cursor = word.indexOf(letter, cursor)) != -1) {
        locations.push(cursor);
        cursor++;
    }

    return locations;
}

/**
 * Replaces the appropriate dashes with letters when a letter is guessed correctly.
 * 
 * @param {string} string The current value in the selected word area
 * @param {number[]} locations The location(s) of the correct letter
 * @param {string} letter The correctly guessed letter
 * @returns {string} The new value for the selected word area
 */
function replaceLetters(string, locations, letter) {
    let newString = '';
    for (const i in string) {
        if (locations.includes(parseInt(i))) {
            newString += letter;
        } else {
            newString += string[i];
        }
    }
    return newString;
}

function win() {
    // TODO: Complete win() function
    console.log('KAZUYA MISHIMA WINS');
}

function wrong() {
    // TODO: Complete wrong() function
    console.warn('WRONG!');
}

// Input event listeners
function onSubmitClick() {
    let guess = guessTextBox.value;
    console.log(`guess: ${guess}`);

    // Make sure guess-history div is visible first
    guessHistoryPanel.style.visibility = 'visible';
    
    var guessItem = document.createElement('li');
    guessItem.append(guess);
    guessList.appendChild(guessItem);

    if (guess.length == 1) {
        if (wordToGuess.includes(guess)) {
            let locations = locateLetters(guess, wordToGuess);
            selectedWordArea.textContent = replaceLetters(selectedWordArea.textContent, locations, guess);
            if (selectedWordArea.textContent === wordToGuess) {
                win();
            }
        } else {
            wrong();
        }
    } else {
        if (guess === wordToGuess) win();
        else wrong();
    }
    guessTextBox.value = '';
}

function onEnterPressed(keyEvent) {
    if (keyEvent.keyCode === 13) {
        submitButton.click();
    }
}