const choices = document.querySelectorAll('.choice');
const difficultySelect = document.getElementById('difficulty');
const userScoreEl = document.getElementById('user-score');
const aiScoreEl = document.getElementById('ai-score');
const resultEl = document.getElementById('game-result');
const playerMoveEl = document.getElementById('player-move');
const aiMoveEl = document.getElementById('ai-move');
const battleEl = document.getElementById('battle');

let userScore = 0;
let aiScore = 0;
let moveHistory = [];

const emojiMap = {
  rock: "👊🏻",
  paper: "🖐🏻",
  scissors: "✌🏻"
};

function getAIMove(userHistory, difficulty) {
  const randomMove = () => {
    const moves = ["rock", "paper", "scissors"];
    return moves[Math.floor(Math.random() * 3)];
  };

  if (difficulty === 'easy' || userHistory.length === 0) {
    return randomMove();
  }

  if (difficulty === 'intermediate') {
    const count = { rock: 0, paper: 0, scissors: 0 };
    userHistory.forEach(move => count[move]++);
    const mostFreq = Object.keys(count).reduce((a, b) => count[a] > count[b] ? a : b);
    if (mostFreq === 'rock') return 'paper';
    if (mostFreq === 'paper') return 'scissors';
    return 'rock';
  }

  if (difficulty === 'pro') {
    const lastMove = userHistory[userHistory.length - 1];
    if (lastMove === 'rock') return 'paper';
    if (lastMove === 'paper') return 'scissors';
    if (lastMove === 'scissors') return 'rock';
    return randomMove();
  }

  return randomMove();
}

function getResult(player, ai) {
  if (player === ai) return "draw";
  if (
    (player === "rock" && ai === "scissors") ||
    (player === "paper" && ai === "rock") ||
    (player === "scissors" && ai === "paper")
  ) return "win";
  return "lose";
}

function playRound(playerMove) {
  const difficulty = difficultySelect.value;
  const aiMove = getAIMove(moveHistory, difficulty);

  // Show animation
  playerMoveEl.classList.remove("animate-player");
  aiMoveEl.classList.remove("animate-ai");
  
  playerMoveEl.textContent = "❔";
  aiMoveEl.textContent = "❔";
  battleEl.classList.add("active");
  
  setTimeout(() => {
    playerMoveEl.textContent = emojiMap[playerMove];
    aiMoveEl.textContent = emojiMap[aiMove];
  
    playerMoveEl.classList.add("animate-player");
    aiMoveEl.classList.add("animate-ai");
  

    const result = getResult(playerMove, aiMove);

    if (result === "win") {
      userScore++;
      resultEl.textContent = "🎉 You win this round!";
    } else if (result === "lose") {
      aiScore++;
      resultEl.textContent = "💀 AI wins this round!";
    } else {
      resultEl.textContent = "⚖️ It's a draw!";
    }

    userScoreEl.textContent = userScore;
    aiScoreEl.textContent = aiScore;

    if (userScore === 10 || aiScore === 10) {
      resultEl.textContent = userScore === 10 ? "🏆 You won the game!" : "🤖 AI wins the game!";
      userScore = 0;
      aiScore = 0;
    }

    moveHistory.push(playerMove);
    if (moveHistory.length > 20) moveHistory.shift(); // limit history

  }, 600);
}

choices.forEach(btn => {
  btn.addEventListener('click', () => {
    const move = btn.getAttribute('data-move');
    playRound(move);
  });
});
