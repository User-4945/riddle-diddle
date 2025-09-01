const API_KEY = "e+n+7RNKfJfrR5EF7RfdKQ==S9YxG7C6i5oOuo6D"; // Replace with your actual API key
let currentRiddle = null;
let wrongAttempts = 0;

async function fetchDailyRiddle() {
  const today = new Date().toLocaleDateString();
  let archive = JSON.parse(localStorage.getItem("riddleArchive")) || [];

  const alreadySaved = archive.find(r => r.date === today);

  if (alreadySaved) {
    currentRiddle = alreadySaved;
    document.getElementById("riddle-text").textContent = currentRiddle.question;
  } else {
    try {
      const response = await fetch("https://api.api-ninjas.com/v1/riddles", {
        headers: { "X-Api-Key": API_KEY }
      });
      const data = await response.json();
      currentRiddle = {
        question: data[0].question,
        answer: data[0].answer.toLowerCase().trim(),
        date: today
      };
      document.getElementById("riddle-text").textContent = currentRiddle.question;
      archive.push(currentRiddle);
      localStorage.setItem("riddleArchive", JSON.stringify(archive));
    } catch (error) {
      document.getElementById("riddle-text").textContent = "Failed to load riddle.";
    }
  }
}

function checkAnswer() {
  const userAnswer = document.getElementById("answer").value.toLowerCase().trim();
  const feedback = document.getElementById("feedback");
  const showBtn = document.getElementById("show-answer-btn");

  if (userAnswer === currentRiddle.answer) {
    feedback.textContent = "✅ Correct! You're a riddle master.";
    feedback.style.color = "green";
    showBtn.style.display = "none";
    wrongAttempts = 0;
  } else {
    wrongAttempts++;
    feedback.textContent = "❌ Try again!";
    feedback.style.color = "red";
    document.getElementById("answer").classList.add("shake");
    setTimeout(() => {
      document.getElementById("answer").classList.remove("shake");
    }, 300);
    if (wrongAttempts >= 3) {
      showBtn.style.display = "inline-block";
    }
  }
}

function showAnswer() {
  const feedback = document.getElementById("feedback");
  feedback.textContent = `💡 The answer is: ${currentRiddle.answer}`;
  feedback.style.color = "#333";
}

window.addEventListener("load", () => {
  fetchDailyRiddle();
  document.getElementById("answer").focus();
});