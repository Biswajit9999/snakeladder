import { useState } from "react";
import "./App.css";

const LADDERS = { 4: 14, 9: 31, 20: 38, 28: 84, 40: 59, 63: 81, 71: 91 };
const SNAKES = { 17: 7, 54: 34, 62: 19, 64: 60, 87: 24, 93: 73, 95: 75, 99: 78 };

// Rows go bottom to top; odd rows run right to left (zig-zag), as in the design
const buildBoard = () => {
  const rows = [];
  for (let r = 9; r >= 0; r--) {
    const nums = Array.from({ length: 10 }, (_, i) => r * 10 + i + 1);
    rows.push(r % 2 === 1 ? nums.reverse() : nums);
  }
  return rows.flat();
};

const BOARD = buildBoard();

function App() {
  const [positions, setPositions] = useState({ 1: 1, 2: 1 });
  const [turn, setTurn] = useState(1);
  const [dice, setDice] = useState(null);
  const [winner, setWinner] = useState(null);

  const gameOver = winner !== null;

  const rollDice = () => {
    if (gameOver) return;

    const roll = Math.floor(Math.random() * 6) + 1;
    setDice(roll);

    let next = positions[turn] + roll;

    if (next > 100) {
      // overshoot: stay where you are
      next = positions[turn];
    } else if (LADDERS[next]) {
      next = LADDERS[next];
    } else if (SNAKES[next]) {
      next = SNAKES[next];
    }

    setPositions({ ...positions, [turn]: next });

    if (next === 100) {
      setWinner(turn);
    } else {
      setTurn(turn === 1 ? 2 : 1);
    }
  };

  const reset = () => {
    setPositions({ 1: 1, 2: 1 });
    setTurn(1);
    setDice(null);
    setWinner(null);
  };

  const diceLabel = gameOver ? " (0)" : dice ? ` (${dice})` : "";

  return (
    <div className="page">
      <div className="card">
        <h1>Snake &amp; Ladders</h1>

        <div className="topbar">
          <div className="status">
            {gameOver ? (
              <>
                <span className="win">
                  <span aria-hidden="true">🏆</span> Player {winner} wins!
                </span>
                <span className="lose">
                  <span aria-hidden="true">💥</span> Player{" "}
                  {winner === 1 ? 2 : 1} loses
                </span>
              </>
            ) : (
              <div className="turn">
                <span>Turn:</span> <span className={`pill p${turn}`}>P{turn}</span>
              </div>
            )}
          </div>

          <div className="legend">
            <span className="legend-item">
              <i className="dot p1" /> P1
            </span>
            <span className="legend-item">
              <i className="dot p2" /> P2
            </span>
          </div>
        </div>

        <div className="board">
          {BOARD.map((n) => (
            <div className="cell" key={n}>
              <div className="cell-head">
                <span className="num">{n}</span>
                {LADDERS[n] && <span className="badge ladder">L→{LADDERS[n]}</span>}
                {SNAKES[n] && <span className="badge snake">S→{SNAKES[n]}</span>}
              </div>
              <div className="tokens">
                {positions[1] === n && <span className="token p1">P1</span>}
                {positions[2] === n && <span className="token p2">P2</span>}
              </div>
            </div>
          ))}
        </div>

        <div className="actions">
          <button
            type="button"
            className="btn roll"
            onClick={rollDice}
            disabled={gameOver}
          >
            <span aria-hidden="true">🎲</span> Roll Dice{diceLabel}
          </button>
          <button type="button" className="btn reset" onClick={reset}>
            Reset
          </button>
        </div>

        <p className="rules">
          Exact 100 is required to win. Land on a <strong>ladder</strong> to
          climb up, a <strong>snake</strong> to slide down.
        </p>
      </div>
    </div>
  );
}

export default App;