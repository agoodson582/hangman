// HTML content templates
const winContent = '<h1 id="win">Congratulations! You win!</h1>';
const loseContent = '<h1 id="lose">You lost...</h1>'

// Regular expressions for assigning dashes and validating inputs
const hasLetter = /[A-Z]|[a-z]/;
const hasDigit = /\d/;

// Variable declarations
/**
 * @type {string}
 */
var wordToGuess;

// Element references
let pieces = document.querySelector('.pieces').getElementsByClassName('shape');
let guessTextBox = document.getElementById('guess-textbox');
let submitButton = document.getElementById('submit');
let selectedWordArea = document.querySelector('.selected-word');
let guessHistoryPanel = document.querySelector('.guess-history');
let guessList = document.querySelector('.guess-list');

// Event listeners
submitButton.addEventListener('click', onSubmitClick);
guessTextBox.addEventListener('keydown', onEnterPress);

setupGame();

// Debugging
// words.forEach((word) => {console.log(word)});

function setupGame() {
    // Hide person pieces and guess history
    Array.prototype.forEach.call(pieces, (piece) => {
        piece.style.visibility = 'hidden'
    })
    guessHistoryPanel.style.visibility = 'hidden';

    // Select a random word for the player to guess
    wordToGuess = words[Math.floor(Math.random() * words.length)];
    selectedWordArea.innerHTML = setupDashes(wordToGuess);

    console.log(`Word to guess: ${wordToGuess}`);
}

function resetGame() {
    guessTextBox.removeAttribute('disabled');
    submitButton.removeAttribute('disabled');
    document.querySelector('label').style.display = 'block';
    document.getElementById('play-again').remove();
    guessList.innerHTML = '';

    try {
        document.getElementById('win').remove();
    } catch (e) {
        if (e instanceof TypeError) {
            document.getElementById('lose').remove();
            document.getElementById('correct-word').remove();
        }
    }

    setupGame();
}

function setupDashes(word) {
    let selectedWordString = '';
    for (const char of word) {
        selectedWordString += hasLetter.test(char) ? '_' : char;
    }

    return selectedWordString;
}

function isValidInput(value) {
    if (!value.length) return false;
    if (value.length === 1) {
        return hasLetter.test(value);
    } else {
        return !hasDigit.test(value);
    }
}

function isUniqueInput(value) {
    if (value.length == 1 && selectedWordArea.textContent.includes(value)) {
        return false;
    }
    for (prevGuess of guessList.children) {
        if (prevGuess.textContent === value) {
            return false;
        }
    }

    return true;
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

function wrong() {
    console.warn('WRONG!');

    for (const piece of pieces) {
        if (piece.style.visibility === 'hidden') {
            piece.style.visibility = 'visible';
            break;
        }
    }
    
    if (Array.prototype.every.call(pieces, allRevealed)) {
        endGame(false);
    }
}

/**
 * End the game and change the UI depending on whether the player wins or loses.
 * 
 * @param {boolean} playerWin Did the player win or lose?
 */
function endGame(playerWin) {
    if (playerWin) {
        console.log('KAZUYA MISHIMA WINS');
        selectedWordArea.insertAdjacentHTML('afterend', winContent);
    } else { // player lost
        selectedWordArea.insertAdjacentHTML('afterend', loseContent);
        document.getElementById('lose').insertAdjacentHTML('afterend',
        `<p id="correct-word">The word you were trying to guess was <strong>${wordToGuess}</strong>.</p>`
        );
    }

    guessTextBox.setAttribute('disabled', '');
    submitButton.setAttribute('disabled', '');
    document.querySelector('label').style.display = 'none';
    document.querySelector('.guess-prompt').insertAdjacentHTML('beforebegin',
        '<button type="button" id="play-again">Play Again!</button>'
    );
    document.getElementById('play-again').addEventListener('click', resetGame);
}

function allRevealed(piece) {
    return piece.style.visibility === 'visible';
}

// Input event listeners
function onSubmitClick() {
    let guess = guessTextBox.value.toLowerCase().trim();
    console.log(`guess: ${guess}`);

    try {
        document.getElementById('invalid-input').remove();
    } catch {}

    if (!isValidInput(guess)) {
        let invalidContent = guess.length === 1 ?
            'Make sure your single-letter guess is only a letter (from a-z).' :
            'Make sure your word guess has no numbers.';
        invalidContent = !guess.length ? 'Please type a letter or try to guess the whole word.' : invalidContent;
        submitButton.insertAdjacentHTML('afterend',
            `<p id="invalid-input">${invalidContent} Please try again.</p>`
        );
        return;
    }

    if (!isUniqueInput(guess)) {
        submitButton.insertAdjacentHTML('afterend',
            '<p id="invalid-input">You already submitted that letter/word. Please guess something else.</p>'
        );
        return;
    }

    // Make sure guess-history div is visible first
    guessHistoryPanel.style.visibility = 'visible';
    
    let guessItem = document.createElement('li');
    guessItem.append(guess);
    guessList.appendChild(guessItem);

    if (guess.length == 1) {
        if (wordToGuess.includes(guess)) {
            let locations = locateLetters(guess, wordToGuess);
            selectedWordArea.textContent = replaceLetters(selectedWordArea.textContent, locations, guess);
            if (selectedWordArea.textContent === wordToGuess) {
                endGame(true);
            }
        } else {
            wrong();
        }
    } else {
        // If a whole word is guessed
        if (guess === wordToGuess) {
            selectedWordArea.textContent = guess;
            endGame(true);
        } else wrong();
    }
    guessTextBox.value = '';
}

function onEnterPress(keyEvent) {
    if (keyEvent.keyCode === 13) {
        submitButton.click();
    }
}