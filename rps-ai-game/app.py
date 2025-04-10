from flask import Flask, render_template, request, jsonify
import random

app = Flask(__name__)

# Basic choices
CHOICES = ["rock", "paper", "scissors"]

# Store history (for frequency & pattern)
user_history = []

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/play", methods=["POST"])
def play():
    data = request.json
    user_move = data.get("move")
    difficulty = data.get("difficulty")

    ai_move = get_ai_move(user_move, difficulty)
    result = get_result(user_move, ai_move)

    # Update history for smarter AI
    user_history.append(user_move)

    return jsonify({
        "user_move": user_move,
        "ai_move": ai_move,
        "result": result
    })

def get_ai_move(user_move, difficulty):
    if difficulty == "easy":
        return random.choice(CHOICES)

    elif difficulty == "intermediate":
        # Frequency Analysis
        if not user_history:
            return random.choice(CHOICES)
        most_common = max(set(user_history), key=user_history.count)
        return counter_move(most_common)

    elif difficulty == "pro":
        # Simple Pattern Prediction (based on last move)
        if len(user_history) < 2:
            return random.choice(CHOICES)
        last_move = user_history[-1]
        return counter_move(last_move)

    return random.choice(CHOICES)

def counter_move(move):
    if move == "rock":
        return "paper"
    elif move == "paper":
        return "scissors"
    elif move == "scissors":
        return "rock"

def get_result(user, ai):
    if user == ai:
        return "draw"
    elif (user == "rock" and ai == "scissors") or \
         (user == "paper" and ai == "rock") or \
         (user == "scissors" and ai == "paper"):
        return "win"
    else:
        return "lose"

if __name__ == "__main__":
    app.run(debug=True)
