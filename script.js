const API_KEY = "e+n+7RNKfJfrR5EF7RfdKQ==S9YxG7C6i5oOuo6D"; // Replace with your actual API key
let currentRiddle = null;
let wrongAttempts = 0;

// ✅ Curated riddle bank
const curatedRiddles = [
  {
    question: "The more you take, the more you leave behind. What am I?",
    answer: "Footsteps"
  },
  {
    question: "What has a head, a tail, is brown, and has no legs?",
    answer: "A penny"
  },
  {
    question: "Can you name three consecutive days without using the words Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, or Sunday?",
    answer: "Yesterday, today, and tomorrow"
  },
  {
    question: "What has hands but no arms and a face but no eyes?",
    answer: "A clock"
  },
  {
    question: "What comes once in a minute, twice in a moment, but never in a thousand years?",
    answer: "The letter M"
  },
  {
    question: "What begins with T, ends with T, and has T in it?",
    answer: "A teapot"
  },
  {
    question: "You live in a one-story house made entirely of redwood. What color would the stairs be?",
    answer: "There are no stairs"
  },
  {
    question: "What 8-letter word can have a letter taken away and still make a word, until only one letter is left?",
    answer: "Starting"
  },
  {
    question: "What has keys but can't open locks?",
    answer: "A piano"
  },
  {
    question: "What can travel around the world while staying in the same corner?",
    answer: "A stamp"
  }
];

// ✅ Format riddle text
function formatRiddle(text) {
  if (!text || typeof text !== "string") return "";

  let trimmed = text.trim();

  if (trimmed === trimmed.toUpperCase()) {
    trimmed = trimmed.toLowerCase();
  }

  let capitalized = trimmed.charAt(0).toUpperCase() + trimmed.slice(1);

  if (!/[.?!]$/.test(capitalized)) {
    capitalized += ".";
  }

  return capitalized;
}

// ✅ Normalize answers for comparison
function normalizeAnswer(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/^(a|an|the)\s+/i, "") // Remove leading determiners
    .replace(/[^\w\s]/g, "");       // Remove punctuation
}

// ✅ Load daily riddle from local or API
async function fetchDailyRiddle() {
  const today = new Date().toLocaleDateString();
  let archive = JSON.parse(localStorage.getItem("riddleArchive")) || [];

  const alreadySaved = archive.find(r => r.date === today);

  if (alreadySaved) {
    currentRiddle = alreadySaved;
    document.getElementById("riddle-text").textContent = currentRiddle.question;
    return;
  }

  const useAPI = Math.random() < 0.3;

  if (useAPI) {
    try {
      const response = await fetch("https://api.api-ninjas.com/v1/riddles", {
        headers: { "X-Api-Key": API_KEY }
      });
      const data = await response.json();

      if (data && data[0]) {
        currentRiddle = {
          question: formatRiddle(data[0].question),
          answer: data[0].answer.toLowerCase().trim(),
          date: today
        };
      }
    } catch (error) {
      console.warn("API fetch failed, falling back to local.");
    }
  }

  if (!currentRiddle) {
    const random = curatedRiddles[Math.floor(Math.random() * curatedRiddles.length)];
    currentRiddle = {
      question: formatRiddle(random.question),
      answer: random.answer.toLowerCase().trim(),
      date: today
    };
  }

  document.getElementById("riddle-text").textContent = currentRiddle.question;
  archive.push(currentRiddle);
  localStorage.setItem("riddleArchive", JSON.stringify(archive));
}

// ✅ Answer checking logic
function checkAnswer() {
  const userAnswer = document.getElementById("answer").value;
  const feedback = document.getElementById("feedback");
  const showBtn = document.getElementById("show-answer-btn");

  if (normalizeAnswer(userAnswer) === normalizeAnswer(currentRiddle.answer)) {
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

// ✅ Reveal answer
function showAnswer() {
  const feedback = document.getElementById("feedback");
  feedback.textContent = `💡 The answer is: ${currentRiddle.answer}`;
  feedback.style.color = "#333";
}

// ✅ Initialize on page load
window.addEventListener("load", () => {
  fetchDailyRiddle();
  document.getElementById("answer").focus();
});// 🌗 Theme toggle logic
const toggleBtn = document.getElementById("theme-toggle");
const body = document.body;

function applyTheme(theme) {
  body.classList.toggle("dark", theme === "dark");
  toggleBtn.textContent = theme === "dark" ? "🌞" : "🌙";
  localStorage.setItem("theme", theme);
}

toggleBtn.addEventListener("click", () => {
  const newTheme = body.classList.contains("dark") ? "light" : "dark";
  applyTheme(newTheme);
});

window.addEventListener("load", () => {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme) {
    applyTheme(savedTheme);
  } else {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    applyTheme(prefersDark ? "dark" : "light");
  }
});

