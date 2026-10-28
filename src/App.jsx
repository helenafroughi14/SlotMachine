import { useState, useEffect, useRef } from "react";
import "./App.css";
import Reels from "./Reels";
import {
  ROWS,
  COLS,
  SYMBOLS_COUNT,
  SYMBOLS_VALUES,
  spin,
  getWinnings,
  invalidBetAmount,
  invalidBetLines,
} from "./gameLogic";

const symbols = Object.keys(SYMBOLS_COUNT);
const BALANCE_KEY = "SlotMachine:balance";

function InputComponent({
  label,
  value,
  onInputChange,
  onInputKeyDown,
  disabledCondition,
  onInputClick,
  buttonText,
}) {
  return (
    <label>
      {label}
      <input
        value={value}
        onChange={onInputChange}
        onKeyDown={onInputKeyDown}
      />
      <button disabled={disabledCondition} onClick={onInputClick}>
        {buttonText}
      </button>
    </label>
  );
}

export default function App() {
  const [currentReels, setCurrentReels] = useState(() =>
    Array.from({ length: ROWS }, () =>
      Array.from(
        { length: COLS },
        () => symbols[Math.floor(Math.random() * symbols.length)],
      ),
    ),
  );

  const [currentDeposit, setCurrentDeposit] = useState("");
  const [currentBalance, setCurrentBalance] = useState(() => {
    const loadBalance = parseFloat(localStorage.getItem(BALANCE_KEY)); //even if its null this will always return Nan.

    if (isNaN(loadBalance)) {
      return 0;
    }
    return loadBalance;
  });

  const [currentBet, setCurrentBet] = useState("");
  const [finalBet, setFinalBet] = useState(0);

  const [currentLines, setCurrentLines] = useState("");
  const [finalLines, setFinalLines] = useState(0);

  const [winAmount, setWinAmount] = useState(0);

  const depositInt = parseFloat(currentDeposit);
  const betLinesInt = parseFloat(currentLines);
  const betInt = parseFloat(currentBet);

  const winTimer = useRef(null);

  useEffect(() => {
    return () => {
      clearTimeout(winTimer.current);
    };
  }, []);

  useEffect(() => {
    //
    localStorage.setItem(BALANCE_KEY, JSON.stringify(currentBalance));
  }, [currentBalance]);

  function handleDeposit() {
    if (isNaN(depositInt) || depositInt <= 0) {
      return;
    }
    setCurrentBalance((prev) => prev + depositInt);
  }

  function handleBetLines() {
    //invalid lines: negative or zero, max lines,
    if (invalidBetLines(betLinesInt)) {
      return;
    }

    setFinalLines(betLinesInt);
  }

  function handleBet() {
    //Invalid bets: Bet amount or balance amount
    if (invalidBetAmount(currentBalance, betInt, finalLines)) {
      return;
    }

    setFinalBet(betInt);
  }

  const totalBet = finalBet * finalLines;
  const canSpin = totalBet <= currentBalance && 0 < totalBet;

  function updateSpin() {
    //checks for: balance, lines, totalBet
    if (!canSpin) {
      return;
    }
    //check for winnings
    //update balance based on winnings
    const nextReels = spin();
    const winnings = getWinnings(nextReels, finalBet, finalLines);

    clearTimeout(winTimer.current);
    setWinAmount(winnings);

    if (winnings > 0) {
      winTimer.current = setTimeout(() => setWinAmount(0), 2000);
    }

    setCurrentReels(nextReels);
    setWinAmount(winnings);
    setCurrentBalance((prev) => prev - totalBet + winnings);
  }

  return (
    <>
      <h1>Slot Machine</h1>
      <h2>Game menu:</h2>

      <InputComponent
        label="Deposit: "
        value={currentDeposit}
        onInputChange={(e) => setCurrentDeposit(e.target.value)}
        onInputKeyDown={(e) => {
          if (e.key === "Enter") handleDeposit();
        }}
        disabledCondition={isNaN(depositInt) || depositInt <= 0}
        onInputClick={handleDeposit}
        buttonText={"Deposit"}
      />
      <div>Balance:{currentBalance}</div>

      <InputComponent
        label="Bet Lines: "
        value={currentLines}
        onInputChange={(e) => setCurrentLines(e.target.value)}
        onInputKeyDown={(e) => {
          if (e.key === "Enter") handleBetLines();
        }}
        disabledCondition={invalidBetLines(betLinesInt)}
        onInputClick={handleBetLines}
        buttonText={"Final Lines"}
      ></InputComponent>
      <p>Lines Total: {finalLines}</p>
      <p>Bet Total: {totalBet}</p>
      {totalBet > currentBalance && (
        <p>Bet Total exceeds your balance. Lower your bet or lines.</p>
      )}

      <InputComponent
        label={"Bet amount: "}
        value={currentBet}
        onInputChange={(e) => setCurrentBet(e.target.value)}
        onInputKeyDown={(e) => {
          if (e.key === "Enter") handleBet();
        }}
        disabledCondition={invalidBetAmount(currentBalance, betInt, finalLines)}
        onInputClick={handleBet}
        buttonText={"Place Bet"}
      ></InputComponent>

      <div className="board-row">
        <Reels reels={currentReels} />
        <button disabled={!canSpin} onClick={() => updateSpin()}>
          Spin
        </button>
      </div>

      <div>{winAmount > 0 && `You have won: ${winAmount}!`}</div>
    </>
  );
}
