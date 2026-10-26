/* =========================================================
   DevMode — script.js
   Sections:
   1. Data: personalities
   2. Data: questions
   3. Quiz state
   4. DOM references
   5. Screen helpers
   6. Quiz rendering & navigation
   7. Scoring
   8. Result rendering
   9. Copy & share
   10. Event listeners
   ========================================================= */

/* ---------- 1. Data: personalities ----------
   Each personality has a key (used in scoring) and everything
   needed to fill the result screen. Stat "value" is 0–100 and
   controls the bar width; "display" is the funny label shown. */
const PERSONALITIES = {
  ai: {
    icon: "🤖",
    name: "The AI-Powered Coder",
    tagline: "Why write code when you can write prompts?",
    description:
      "You don't write code — you negotiate with it. Your editor has three AI extensions, your terminal has an AI, and you're fairly sure your toaster has been fine-tuned on your commit history. You ship fast, and when someone asks how it works, you confidently say “it's a transformer thing.”",
    command: "$ ai --fix-everything --no-questions",
    warnings: 7,
    strengths: [
      "Ships features at a terrifying speed",
      "Writes prompts with the precision of a poet",
      "Never fears a blank file",
    ],
    weaknesses: [
      "Panics when the Wi-Fi drops",
      "Has not read most of the code they merged",
      "Calls autocomplete “my colleague”",
    ],
    stats: [
      { label: "Prompt Engineering", value: 98, display: "98 / 100" },
      { label: "Code Written Personally", value: 12, display: "~12%" },
      { label: "Trust in AI Output", value: 92, display: "dangerously high" },
      { label: "Coffee Intake", value: 50, display: "3 cups/day" },
      { label: "Chat History Length", value: 85, display: "400+ messages" },
    ],
  },

  debugger: {
    icon: "🐛",
    name: "The Debugging Legend",
    tagline: "No bug survives first contact with you.",
    description:
      "Where others see a cryptic stack trace, you see a story. You've fixed bugs by staring at them. You've fixed bugs in your sleep. Rumour has it you once fixed a race condition just by walking past the server rack. console.log is your love language.",
    command: "$ git bisect start   # it's personal now",
    warnings: 0,
    strengths: [
      "Reads stack traces like bedtime stories",
      "Infinite patience with flaky tests",
      "Finds root causes, not just symptoms",
    ],
    weaknesses: [
      "Gets suspicious when everything works",
      "Has 200 forgotten console.logs in production",
      "Can't watch a movie without spotting plot bugs",
    ],
    stats: [
      { label: "Bug Detection", value: 99, display: "99 / 100" },
      { label: "Patience", value: 92, display: "monk-level" },
      { label: "Breakpoints per Session", value: 78, display: "~37" },
      { label: "Coffee Intake", value: 65, display: "4 cups/day" },
      { label: "Features Shipped", value: 38, display: "few, but flawless" },
    ],
  },

  stackoverflow: {
    icon: "📚",
    name: "The Stack Overflow Warrior",
    tagline: "Copy. Paste. Pray. Ship.",
    description:
      "You know the answer is always out there — usually in a thread from 2011 with a green checkmark. You can find a solution to anything in under 30 seconds, even if you don't fully understand it. Ctrl+C and Ctrl+V are the most worn-out keys on your keyboard.",
    command: "$ copy --from=stackoverflow --paste=prod",
    warnings: 12,
    strengths: [
      "Elite-level search skills",
      "Knows the accepted answer is wrong and the second one is right",
      "Can solve anything with enough tabs open",
    ],
    weaknesses: [
      "Codebase has six different naming styles",
      "Completely lost when the site is down",
      "Credits “some guy from 2013” in code reviews",
    ],
    stats: [
      { label: "Search-Fu", value: 97, display: "97 / 100" },
      { label: "Browser Tabs Open", value: 94, display: "47 and counting" },
      { label: "Original Code", value: 22, display: "citation needed" },
      { label: "Copy-Paste Accuracy", value: 88, display: "surgical" },
      { label: "Panic When Site Is Down", value: 100, display: "maximum" },
    ],
  },

  sleepless: {
    icon: "☕",
    name: "The Sleep-Deprived Engineer",
    tagline: "Sleep is just a deprecated feature.",
    description:
      "Your best code is written between 1 AM and 4 AM. So is your worst code. You've seen more sunrises from your desk than from your bed, your body is roughly 70% coffee, and your commit history looks like a seismograph.",
    command: "$ while true; do code; coffee++; done",
    warnings: 23,
    strengths: [
      "Unmatched focus once the world goes quiet",
      "Ships hotfixes before anyone else wakes up",
      "Superhuman caffeine tolerance",
    ],
    weaknesses: [
      "Commit messages are just “fix” and “asdf”",
      "Forgets what they wrote six hours ago",
      "Has a complicated relationship with daylight",
    ],
    stats: [
      { label: "Coffee Intake", value: 100, display: "7 cups/day" },
      { label: "Hours of Sleep", value: 10, display: "4.5 hrs (avg)" },
      { label: "Commits After Midnight", value: 94, display: "94%" },
      { label: "Productivity at 3 AM", value: 88, display: "unreasonably high" },
      { label: "Energy Level", value: 35, display: "buffering…" },
    ],
  },

  overengineer: {
    icon: "🏗️",
    name: "The Overengineering Specialist",
    tagline: "Why use one file when you can use forty?",
    description:
      "You were asked for a to-do list, so you built a distributed, event-driven, microservice-based task orchestration platform with a plugin system. It has 99.999% uptime and zero users. Your architecture diagrams are works of art, and your README is longer than most novels.",
    command: "$ kubectl apply -f hello-world-cluster.yaml",
    warnings: 42,
    strengths: [
      "Builds systems that could survive the apocalypse",
      "Beautiful, well-documented architecture",
      "Thinks about scale from day one (and day minus one)",
    ],
    weaknesses: [
      "“Hello World” takes three sprints",
      "Adds a design pattern to every function",
      "Says “let's abstract that” in casual conversation",
    ],
    stats: [
      { label: "Abstraction Layers", value: 96, display: "11 deep" },
      { label: "Design Patterns Used", value: 90, display: "all 23" },
      { label: "Config Files", value: 85, display: "yes" },
      { label: "Time to MVP", value: 15, display: "6–8 business months" },
      { label: "Actual Users", value: 4, display: "0 (but scalable)" },
    ],
  },

  founder: {
    icon: "🚀",
    name: "The Future Tech Founder",
    tagline: "It's like Uber, but for… everything.",
    description:
      "Every bug is a business opportunity and every side project is a potential unicorn. You've bought 30 domain names this year and launched zero products — but the landing pages look incredible. You speak fluent pitch deck, and your LinkedIn headline says “Visionary.”",
    command: "$ npx create-unicorn --valuation=1B",
    warnings: 3,
    strengths: [
      "Turns any idea into a pitch in 30 seconds",
      "Sees the big picture (and the IPO)",
      "Brilliant at building hype and momentum",
    ],
    weaknesses: [
      "Owns more domains than finished projects",
      "Says “synergy” without irony",
      "Pivots before the MVP compiles",
    ],
    stats: [
      { label: "Ideas per Day", value: 97, display: "~14" },
      { label: "Pitch Confidence", value: 100, display: "unlimited" },
      { label: "Domains Owned", value: 80, display: "31" },
      { label: "Products Shipped", value: 18, display: "1 (landing page)" },
      { label: "Hours of Sleep", value: 30, display: "investors don't sleep" },
    ],
  },
};

// The order personalities appear in the breakdown chart
const PERSONALITY_KEYS = Object.keys(PERSONALITIES);

/* ---------- 2. Data: questions ----------
   Every answer has a main "type" (worth MAIN_POINTS) and can
   optionally give a smaller "bonus" to a second type. */
const MAIN_POINTS = 2;
const BONUS_POINTS = 1;

const QUESTIONS = [
  {
    question: "It's 9 AM. What's the first thing you open?",
    options: [
      { text: "My AI assistant — we pair program now", type: "ai" },
      { text: "The error logs from last night's deploy", type: "debugger", bonus: "sleepless" },
      { text: "My pitch deck. Again.", type: "founder" },
      { text: "Nothing. I never closed the laptop last night.", type: "sleepless" },
    ],
  },
  {
    question: "Your code throws an error you've never seen before. You…",
    options: [
      { text: "Paste it straight into Stack Overflow search", type: "stackoverflow" },
      { text: "Set 14 breakpoints and go full detective", type: "debugger" },
      { text: "Ask the AI, accept the first answer, and pray", type: "ai", bonus: "stackoverflow" },
      { text: "Rewrite the module with a cleaner abstraction layer", type: "overengineer" },
    ],
  },
  {
    question: "Pick your ideal weekend project:",
    options: [
      { text: "A to-do app with microservices, Kubernetes and an event bus", type: "overengineer" },
      { text: "An AI wrapper that will definitely be worth $1B", type: "founder", bonus: "ai" },
      { text: "Finally fixing that one bug that's haunted me for weeks", type: "debugger" },
      { text: "Whatever it is, I'll start it at 2 AM on Saturday", type: "sleepless" },
    ],
  },
  {
    question: "How many browser tabs do you have open right now?",
    options: [
      { text: "Three. I am in control.", type: "debugger" },
      { text: "47, and 30 of them are Stack Overflow", type: "stackoverflow" },
      { text: "Each tab is a different startup idea", type: "founder" },
      { text: "Just one: an AI chat that's 400 messages deep", type: "ai" },
    ],
  },
  {
    question: "What's your relationship with coffee?",
    options: [
      { text: "It's not a beverage, it's a dependency", type: "sleepless" },
      { text: "I drink oat-milk lattes at founder breakfasts", type: "founder" },
      { text: "Coffee is in my system architecture diagram", type: "overengineer" },
      { text: "I asked an AI to optimise my caffeine schedule", type: "ai" },
    ],
  },
  {
    question: "A teammate asks how your code works. You say:",
    options: [
      { text: "“Honestly? The AI wrote it. It works though.”", type: "ai" },
      { text: "“Let me draw you a six-layer diagram first.”", type: "overengineer" },
      { text: "“I found it in a 2013 answer with 4,000 upvotes.”", type: "stackoverflow" },
      { text: "“It works because I traced every line at 3 AM.”", type: "debugger", bonus: "sleepless" },
    ],
  },
  {
    question: "Which commit message sounds most like you?",
    options: [
      { text: "fix", type: "sleepless" },
      { text: "refactor: introduce AbstractFactoryProviderManager", type: "overengineer" },
      { text: "fix race condition in token refresh (root cause: clock skew)", type: "debugger" },
      { text: "MVP done 🚀 shipping to investors", type: "founder" },
    ],
  },
  {
    question: "Production goes down at midnight. You…",
    options: [
      { text: "Are already awake. Obviously.", type: "sleepless", bonus: "debugger" },
      { text: "Calmly read the logs and find the bug in five minutes", type: "debugger" },
      { text: "Search the exact error message in quotes", type: "stackoverflow" },
      { text: "Post “this is why we're hiring” on LinkedIn", type: "founder" },
    ],
  },
  {
    question: "What's your secret programming superpower?",
    options: [
      { text: "Prompt engineering", type: "ai" },
      { text: "Copy-pasting with surgical precision", type: "stackoverflow" },
      { text: "Turning 10 lines into a “scalable framework”", type: "overengineer" },
      { text: "Turning side projects into business plans", type: "founder" },
    ],
  },
  {
    question: "Where do you see yourself in five years?",
    options: [
      { text: "Managing a team of AI agents that do my job", type: "ai", bonus: "founder" },
      { text: "Top answerer on Stack Overflow, gold badges everywhere", type: "stackoverflow" },
      { text: "Still migrating the architecture to v3", type: "overengineer" },
      { text: "Asleep. Hopefully.", type: "sleepless" },
    ],
  },
];

/* ---------- 3. Quiz state ----------
   answers[i] holds the index of the option chosen for question i
   (or undefined if the question hasn't been answered yet). */
let currentQuestion = 0;
let answers = [];
let isAnimating = false;
let lastResultText = "";

/* ---------- 4. DOM references ---------- */
const screens = {
  start: document.getElementById("screen-start"),
  quiz: document.getElementById("screen-quiz"),
  result: document.getElementById("screen-result"),
};

const startBtn = document.getElementById("start-btn");
const backBtn = document.getElementById("back-btn");
const nextBtn = document.getElementById("next-btn");
const retakeBtn = document.getElementById("retake-btn");
const copyBtn = document.getElementById("copy-btn");
const shareBtn = document.getElementById("share-btn");
const brandLink = document.getElementById("brand-link");

const questionCard = document.getElementById("question-card");
const questionEyebrow = document.getElementById("question-eyebrow");
const questionText = document.getElementById("question-text");
const optionsContainer = document.getElementById("options");

const progressLabel = document.getElementById("progress-label");
const progressPercent = document.getElementById("progress-percent");
const progressBar = document.getElementById("progress-bar");
const progressFill = document.getElementById("progress-fill");

const toast = document.getElementById("toast");

/* ---------- 5. Screen helpers ---------- */
function showScreen(name) {
  Object.values(screens).forEach((screen) => screen.classList.remove("is-active"));
  screens[name].classList.add("is-active");
  window.scrollTo({ top: 0 });
}

function startQuiz() {
  currentQuestion = 0;
  answers = [];
  isAnimating = false;
  questionCard.classList.remove("is-leaving", "is-entering");
  renderQuestion();
  showScreen("quiz");
}

function goHome() {
  answers = [];
  currentQuestion = 0;
  showScreen("start");
}

/* ---------- 6. Quiz rendering & navigation ---------- */
function renderQuestion() {
  const q = QUESTIONS[currentQuestion];
  const number = currentQuestion + 1;

  questionEyebrow.textContent = `// question_${String(number).padStart(2, "0")}`;
  questionText.textContent = q.question;

  // Build one button per answer option
  optionsContainer.innerHTML = "";
  q.options.forEach((option, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "option";
    button.setAttribute("aria-pressed", "false");
    button.innerHTML = `<span class="option-key">${index + 1}</span><span class="option-text"></span>`;
    button.querySelector(".option-text").textContent = option.text;

    if (answers[currentQuestion] === index) {
      button.classList.add("is-selected");
      button.setAttribute("aria-pressed", "true");
    }

    button.addEventListener("click", () => selectOption(index));
    optionsContainer.appendChild(button);
  });

  updateProgress();
  updateNavButtons();
}

function selectOption(index) {
  if (isAnimating) return;
  answers[currentQuestion] = index;

  // Highlight only the chosen option
  optionsContainer.querySelectorAll(".option").forEach((button, i) => {
    const selected = i === index;
    button.classList.toggle("is-selected", selected);
    button.setAttribute("aria-pressed", String(selected));
  });

  updateProgress();
  updateNavButtons();
  // Move focus to "Next" so pressing Enter continues the quiz
  nextBtn.focus({ preventScroll: true });
}

function updateProgress() {
  const answeredCount = answers.filter((a) => a !== undefined).length;
  const percent = Math.round((answeredCount / QUESTIONS.length) * 100);

  progressLabel.textContent = `Question ${currentQuestion + 1} / ${QUESTIONS.length}`;
  progressPercent.textContent = `${percent}%`;
  progressFill.style.width = `${percent}%`;
  progressBar.setAttribute("aria-valuenow", String(answeredCount));
}

function updateNavButtons() {
  const isLast = currentQuestion === QUESTIONS.length - 1;
  backBtn.disabled = currentQuestion === 0;
  nextBtn.disabled = answers[currentQuestion] === undefined;
  nextBtn.innerHTML = isLast
    ? 'See my result <span aria-hidden="true">✓</span>'
    : 'Next <span aria-hidden="true">→</span>';
}

// Slide the current card out, swap the content, slide the new one in
function goToQuestion(newIndex) {
  if (isAnimating) return;
  isAnimating = true;
  questionCard.classList.add("is-leaving");

  setTimeout(() => {
    currentQuestion = newIndex;
    renderQuestion();

    questionCard.classList.remove("is-leaving");
    questionCard.classList.add("is-entering");
    void questionCard.offsetWidth; // force the browser to apply the start position
    questionCard.classList.remove("is-entering");
    isAnimating = false;
  }, 250);
}

function nextQuestion() {
  if (isAnimating || answers[currentQuestion] === undefined) return;

  if (currentQuestion < QUESTIONS.length - 1) {
    goToQuestion(currentQuestion + 1);
  } else {
    showResult();
  }
}

function previousQuestion() {
  if (currentQuestion > 0) goToQuestion(currentQuestion - 1);
}

/* ---------- 7. Scoring ---------- */

// Adds up points for every personality based on the chosen answers
function calculateScores(answerList) {
  const scores = {};
  PERSONALITY_KEYS.forEach((key) => (scores[key] = 0));

  answerList.forEach((optionIndex, questionIndex) => {
    const option = QUESTIONS[questionIndex].options[optionIndex];
    scores[option.type] += MAIN_POINTS;
    if (option.bonus) scores[option.bonus] += BONUS_POINTS;
  });

  return scores;
}

// Picks the personality with the most points.
// Tie-breaker: the tied personality the user picked most recently wins.
function getWinner(scores, answerList) {
  const highest = Math.max(...Object.values(scores));
  const tied = PERSONALITY_KEYS.filter((key) => scores[key] === highest);
  if (tied.length === 1) return tied[0];

  for (let i = answerList.length - 1; i >= 0; i--) {
    const chosenType = QUESTIONS[i].options[answerList[i]].type;
    if (tied.includes(chosenType)) return chosenType;
  }
  return tied[0];
}

// Turns raw scores into percentages that add up to roughly 100
function getPercentages(scores) {
  const total = Object.values(scores).reduce((sum, value) => sum + value, 0) || 1;
  const percentages = {};
  PERSONALITY_KEYS.forEach((key) => {
    percentages[key] = Math.round((scores[key] / total) * 100);
  });
  return percentages;
}

/* ---------- 8. Result rendering ---------- */
function showResult() {
  const scores = calculateScores(answers);
  const winnerKey = getWinner(scores, answers);
  const percentages = getPercentages(scores);
  const p = PERSONALITIES[winnerKey];

  document.getElementById("result-icon").textContent = p.icon;
  document.getElementById("result-name").textContent = p.name;
  document.getElementById("result-tagline").textContent = `“${p.tagline}”`;
  document.getElementById("result-description").textContent = p.description;
  document.getElementById("result-command").textContent = p.command;
  document.getElementById("result-warnings").textContent = p.warnings;

  fillList("result-strengths", p.strengths);
  fillList("result-weaknesses", p.weaknesses);

  // Stat sheet
  const statsEl = document.getElementById("result-stats");
  statsEl.innerHTML = "";
  p.stats.forEach((stat) => statsEl.appendChild(createBarRow(stat.label, stat.display, stat.value)));

  // Breakdown of all six types, highest first
  const breakdownEl = document.getElementById("result-breakdown");
  breakdownEl.innerHTML = "";
  const sortedKeys = [...PERSONALITY_KEYS].sort((a, b) => percentages[b] - percentages[a]);
  sortedKeys.forEach((key) => {
    const row = createBarRow(PERSONALITIES[key].name, `${percentages[key]}%`, percentages[key]);
    if (key === winnerKey) row.classList.add("is-top");
    breakdownEl.appendChild(row);
  });

  lastResultText = buildShareText(p, sortedKeys, percentages);
  showScreen("result");

  // Animate the bars after the screen is visible
  setTimeout(() => {
    document.querySelectorAll("#screen-result .bar-fill").forEach((bar) => {
      bar.style.width = bar.dataset.width;
    });
  }, 100);
}

function fillList(elementId, items) {
  const list = document.getElementById(elementId);
  list.innerHTML = "";
  items.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    list.appendChild(li);
  });
}

function createBarRow(label, displayValue, percent) {
  const row = document.createElement("div");
  row.className = "stat-row";
  row.innerHTML = `
    <div class="stat-row-top">
      <span class="stat-label"></span>
      <span class="stat-value"></span>
    </div>
    <div class="bar"><div class="bar-fill"></div></div>`;
  row.querySelector(".stat-label").textContent = label;
  row.querySelector(".stat-value").textContent = displayValue;
  row.querySelector(".bar-fill").dataset.width = `${percent}%`;
  return row;
}

/* ---------- 9. Copy & share ---------- */
function getPageUrl() {
  // Only include a link when the site is actually hosted (not opened as a local file)
  return location.protocol.startsWith("http") ? location.href.split("#")[0] : "";
}

function buildShareText(personality, sortedKeys, percentages) {
  const topThree = sortedKeys
    .slice(0, 3)
    .map((key) => `${PERSONALITIES[key].name.replace("The ", "")} ${percentages[key]}%`)
    .join(" · ");

  const lines = [
    `${personality.icon} I'm ${personality.name}!`,
    `“${personality.tagline}”`,
    "",
    `Top matches: ${topThree}`,
    "",
    "Find your developer personality on DevMode.",
  ];
  const url = getPageUrl();
  if (url) lines.push(url);
  return lines.join("\n");
}

async function copyResults() {
  const success = await copyToClipboard(lastResultText);
  showToast(success ? "✓ Results copied to clipboard" : "✗ Couldn't copy — try again");
  if (success) {
    copyBtn.textContent = "Copied!";
    setTimeout(() => (copyBtn.textContent = "Copy results"), 2000);
  }
}

async function copyToClipboard(text) {
  // Modern method (needs https or localhost)
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch (error) {
    // Fall through to the older method below
  }

  // Older fallback that also works when opening index.html directly
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();
  let ok = false;
  try {
    ok = document.execCommand("copy");
  } catch (error) {
    ok = false;
  }
  textarea.remove();
  return ok;
}

async function shareResults() {
  // Use the phone/OS share sheet when available
  if (navigator.share) {
    try {
      const data = { title: "DevMode — My Developer Personality", text: lastResultText };
      await navigator.share(data);
      return;
    } catch (error) {
      if (error.name === "AbortError") return; // user closed the share sheet
    }
  }
  // Otherwise open a pre-filled post on X (Twitter) in a new tab
  const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(lastResultText)}`;
  window.open(shareUrl, "_blank", "noopener");
}

let toastTimer;
function showToast(message) {
  toast.textContent = message;
  toast.classList.add("is-visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("is-visible"), 2200);
}

/* ---------- 10. Event listeners ---------- */
startBtn.addEventListener("click", startQuiz);
nextBtn.addEventListener("click", nextQuestion);
backBtn.addEventListener("click", previousQuestion);
retakeBtn.addEventListener("click", startQuiz);
copyBtn.addEventListener("click", copyResults);
shareBtn.addEventListener("click", shareResults);

brandLink.addEventListener("click", (event) => {
  event.preventDefault();
  goHome();
});

// Keyboard shortcuts on the quiz screen: 1–4 to pick, Enter for next, ← for back
document.addEventListener("keydown", (event) => {
  if (!screens.quiz.classList.contains("is-active")) return;
  if (event.ctrlKey || event.metaKey || event.altKey) return;

  const number = parseInt(event.key, 10);
  if (number >= 1 && number <= QUESTIONS[currentQuestion].options.length) {
    selectOption(number - 1);
  } else if (event.key === "Enter" && document.activeElement === document.body) {
    nextQuestion();
  } else if (event.key === "ArrowLeft") {
    previousQuestion();
  }
});
