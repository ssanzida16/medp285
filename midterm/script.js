const questions = [
    { question: "What planet is known as the Red Planet?", answers: ["Earth", "Mars", "Jupiter", "Saturn"], correct: 1 },
    { question: "What is the closest star to Earth?", answers: ["Proxima Centauri", "Sirius", "Alpha Centauri", "Betelgeuse"], correct: 0 },
    { question: "How many planets are in our solar system?", answers: ["7", "8", "9", "10"], correct: 1 },
    { question: "What is the largest planet in our solar system?", answers: ["Earth", "Jupiter", "Saturn", "Neptune"], correct: 1 },
    { question: "Which planet is known for its rings?", answers: ["Venus", "Saturn", "Uranus", "Mercury"], correct: 1 },
    { question: "What celestial body is known as the 'Morning Star'?", answers: ["Mars", "Venus", "Jupiter", "Mercury"], correct: 1 },
    { question: "What is the name of our galaxy?", answers: ["Andromeda", "Milky Way", "Whirlpool", "Sombrero"], correct: 1 },
    { question: "Which planet is closest to the sun?", answers: ["Venus", "Mercury", "Mars", "Earth"], correct: 1 },
    { question: "What is the name of the first human to travel into space?", answers: ["Yuri Gagarin", "Neil Armstrong", "Buzz Aldrin", "John Glenn"], correct: 0 },
    { question: "What do we call a group of stars that form a recognizable pattern?", answers: ["Galaxy", "Constellation", "Nebula", "Cluster"], correct: 1 },
];

let currentQuestion = 0;
let score = 0;
let username = "";
let highScores = JSON.parse(localStorage.getItem("highScores")) || [];

// Start quiz and store the username
function startQuiz() {
    localStorage.removeItem("userScore"); // Clear previous score
    username = document.getElementById("username").value;
    if (username === "") {
        alert("Please enter your name!");
        return;
    }
    window.location.href = 'trivia.html';
}

// Load a question
function loadQuestion() {
    const questionElement = document.getElementById("question");
    const answersElement = document.getElementById("answers");
    const nextButton = document.getElementById("next");

    // Display question and clear previous answers
    questionElement.textContent = questions[currentQuestion].question;
    answersElement.innerHTML = ""; // Reset answers

    // Create answer buttons
    questions[currentQuestion].answers.forEach((answer, index) => {
        const button = document.createElement("button");
        button.textContent = answer;
        button.classList.add("answer-button");
        button.onclick = () => checkAnswer(index, button);
        answersElement.appendChild(button);
    });

    nextButton.style.display = "none"; // Hide next button
}

// Check the answer and give feedback
function checkAnswer(selected, button) {
    const correctAnswer = questions[currentQuestion].correct;
    
    if (selected === correctAnswer) {
        score++;
        button.classList.add("correct");
    } else {
        button.classList.add("wrong");
    }

    // Disable all answer buttons
    const buttons = document.querySelectorAll("#answers button");
    buttons.forEach(btn => btn.disabled = true);

    // Show the "Next" button
    document.getElementById("next").style.display = "block";
}

// Save the score in local storage
function saveScore() {
    highScores.push({ name: username, score: score });
    highScores.sort((a, b) => b.score - a.score);
    highScores = highScores.slice(0, 5);
    localStorage.setItem("highScores", JSON.stringify(highScores));
    localStorage.setItem("userScore", score); // Store user's score
}

// Handle "Next" button click
function nextQuestion() {
    currentQuestion++;
    if (currentQuestion < questions.length) {
        loadQuestion();
    } else {
        saveScore(); // Save score and redirect to results
        window.location.href = 'results.html';
    }
}

// Display results on the results page
window.onload = function() {
    const storedScore = localStorage.getItem("userScore");
    if (document.getElementById("score")) {
        document.getElementById("score").textContent = `Your score: ${storedScore} out of ${questions.length}`;
        
        const highScoresList = document.getElementById("high-scores");
        highScores.forEach(entry => {
            const li = document.createElement("li");
            li.textContent = `${entry.name}: ${entry.score}`;
            highScoresList.appendChild(li);
        });
    }
};

// Load the first question when the page loads
document.addEventListener("DOMContentLoaded", loadQuestion);

// Event listener for "Next" button
document.getElementById("next").addEventListener("click", nextQuestion);
