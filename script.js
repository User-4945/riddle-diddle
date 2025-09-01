let wrongAttempts = 0;

function checkAnswer() {
  const userAnswer = document.getElementById("answer").value.toLowerCase().trim();
  const feedback = document.getElementById("feedback");
  const showBtn = document.getElementById("show-answer-btn");

  if (userAnswer === "echo") {
    feedback.textContent = "✅ Correct! You're a riddle master.";
    feedback.style.color = "green";

    const userName = prompt("✅ Enter your name for the leaderboard:") || "Anonymous";
    const avatar = getRandomAvatar();
    const timestamp = new Date().toLocaleString();
    const difficulty = "Easy";

    saveScore({ name: userName, avatar, timestamp, difficulty });

    showBtn.style.display = "none";
    wrongAttempts = 0;
  } else {
    wrongAttempts++;
    feedback.textContent = "❌ Try again!";
    feedback.style.color = "red";

    if (wrongAttempts >= 3) {
      showBtn.style.display = "inline-block";
    }
  }
}

function showAnswer() {
  const feedback = document.getElementById("feedback");
  feedback.textContent = "💡 The answer is: Echo";
  feedback.style.color = "#333";
}

function saveScore(entry) {
  let scores = JSON.parse(localStorage.getItem("riddleScores")) || [];
  scores.push(entry);
  localStorage.setItem("riddleScores", JSON.stringify(scores));
}

function showLeaderboard() {
  const section = document.getElementById("leaderboard");
  const list = document.getElementById("leaderboard-list");
  section.style.display = "block";
  list.innerHTML = "";

  const scores = JSON.parse(localStorage.getItem("riddleScores")) || [];
  scores.slice(-5).reverse().forEach(score => {
    const li = document.createElement("li");
    li.innerHTML = `${score.avatar} <strong>${score.name}</strong> — <em>${score.difficulty}</em><br><small>${score.timestamp}</small>`;
    list.appendChild(li);
  });
}

function getRandomAvatar() {
  const avatars = ["🦉", "🧠", "🐉", "🦊", "🪄", "🐱", "🧙‍♂️", "🧩", "🌟", "🎩"];
  return avatars[Math.floor(Math.random() * avatars.length)];
}
