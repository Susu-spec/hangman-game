const categories = {
    animals: {
        words: ['mamba', 'penguin', 'peacocks', 'cat', 'leopard', 'cheetah', 'hippopotamus', 'iguana', 'whale', 'butterfly', 'eagle', 'periwinkle'],
        hint: 'guess the animal'
    },
    countries: {
        words: ['canada', 'nigeria', 'senegal', 'ghana', 'nicaragua', 'honduras', 'cameroon', 'malawi', 'Australia', 'benin', 'rwanda'],
        hint: 'guess the country'
    },
    fruits: {
        words: ['apple', 'soursop', 'kiwi', 'avocado', 'watermelon', 'pineapple', 'date', 'orange', 'strawberry', 'tangerine', 'mango'],
        hint: 'guess the fruit'
    },
    sports: {
        words: ['soccer', 'javelin', 'discus', 'shortput', 'tennis', 'archery', 'basketball', 'volleyball', 'polevault', 'fencing', 'baseball', 'swimming'],
        hint: 'guess the sport'
    },
}


let currentWord = ''
let guessedLetters = []
let score = 0
let maxTries = 8
let wrongGuesses = 0


const wordDisplay = document.getElementById('word-display')
const keyboard = document.getElementById('keyboard')
const messageElement = document.getElementById('message')
const newGameBtn = document.getElementById('new-game-btn')
const triesLeft = document.getElementById('tries-left')
const scoreElement = document.getElementById('score')
const hintElement = document.getElementById('hint')
const categorySelect = document.getElementById('category-select')
const hangmanParts = document.querySelectorAll('.hangman-part')

const clickSound = new Audio('./assets/click.mp3')
const winSound = new Audio('./assets/win.mp3');
// const themeToggle = document.getElementById('theme-toggle');


// themeToggle.addEventListener('click', () => {
//     document.body.classList.toggle('dark-mode');
// });

function gamePlay() {
    guessedLetters = []
    wrongGuesses = 0


    triesLeft.textContent = maxTries
    messageElement.textContent = ''

    const category = categorySelect.value;
    hintElement.textContent = categories[category].hint;


    const words = categories[category].words
    currentWord = words[Math.floor(Math.random() * words.length)];

    console.log(currentWord)

    createWordDisplay();


    createKeyboard();


    resetHangman();
}


function createWordDisplay() {
    wordDisplay.innerHTML = ''
    for (let i = 0; i < currentWord.length; i++) {
        const letterBox = document.createElement('div')
        letterBox.className = 'letter-box'
        letterBox.dataset.letter = currentWord[i]
        wordDisplay.appendChild(letterBox)
    }
}


function createKeyboard() {
    keyboard.innerHTML = '';
    const letters = 'abcdefghijklmnopqrstuvwxyz'
    for (let i = 0; i < letters.length; i ++) {
        const key = document.createElement('button');
        key.className = 'key'
        key.textContent = letters[i]
        key.addEventListener('click', () => handleGuess(letters[i]))
        keyboard.appendChild(key)
    }
}


function resetHangman() {
    hangmanParts.forEach((part, index) => {
        if(index < 2) {
            part.style.display = 'block'
        } else {
            part.style.display = 'none'
        }
    })
    messageElement.classList.remove('message');
    messageElement.textContent = '';
}


function handleGuess(letter) {
    if(guessedLetters.includes(letter) || wrongGuesses >= maxTries || isWordComplete()) return;
    
    guessedLetters.push(letter)

    const key = [...keyboard.children].find(key => key.textContent === letter);

    clickSound.play();
    key.classList.add('used')

    if(currentWord.includes(letter)) {
        key.classList.add('correct')
        updateWordDisplay(letter)
        score += 10

    } else {
        key.classList.add('wrong')
        wrongGuesses++
        triesLeft.textContent = maxTries - wrongGuesses;
        updateHangman()
        score = score > 0 ? score - 5 : 0;
    }
    scoreElement.textContent = score

    if (isWordComplete()) {
        handleWin();
    }
}

function updateWordDisplay(letter) {
    const letterBoxes = wordDisplay.children;
    for (let i = 0; i < letterBoxes.length; i++) {
        if(letterBoxes[i].dataset.letter === letter) {
            letterBoxes[i].textContent = letter;
        }
    }
}

function updateHangman() {
    if (wrongGuesses + 1 < hangmanParts.length) {
        hangmanParts[wrongGuesses + 1].style.display = 'block';
        hangmanParts[wrongGuesses + 1].classList.add('fade-in');
    }
}

function isWordComplete() {
    const letterBoxes = wordDisplay.children;
    for (let i = 0; i < letterBoxes.length; i++) {
        const letter = letterBoxes[i].dataset.letter;
        if (!guessedLetters.includes(letter)) {
            return false;
        }
    }
   
    return true;
}



// what happens when you win
function handleWin() {
    score += 50;
    scoreElement.textContent = score;
    
    messageElement.className = 'message'; 
    let countdown = 10;

    messageElement.innerHTML = `
        <span style="
            color: #32CD32; 
            font-weight: bold; 
            font-size: 36px;
            text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.7);">🎉 You Won! 🎉</span>
        <b>You scored ${score} points!</b>
        <p>New game starts in <span id="countdown">${countdown}</span>s</p>
    `;

    // Disable keyboard
    [...keyboard.children].forEach(key => key.disabled = true);
    
    winSound.play();
    const timer = setInterval(() => {
        countdown--;
        document.getElementById('countdown').textContent = countdown;

        if (countdown <= 0) {
            clearInterval(timer);
            gamePlay(); 
        }
    }, 1000);
}



categorySelect.addEventListener('change', gamePlay)
newGameBtn.addEventListener('click', () => {
    clickSound.play()
    gamePlay()
})

gamePlay();