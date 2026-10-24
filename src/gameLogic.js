export const ROWS = 3;
export const COLS = 3;

export const SYMBOLS_COUNT= {
    "🍒":2, "🍋":4, "🔔":6, "💎":8 
};
export const SYMBOLS_VALUES= {
    "🍒":5, "🍋":4, "🔔":3, "💎":2 
};


export function spin() {
  const symbols = []; //hold all the symbols inside, however many they are/appera

  for (const [symbol,count] of Object.entries(SYMBOLS_COUNT)) {
    for (let i = 0; i < count; i++){
      symbols.push(symbol);
    }
  }

  const reels = [];

  for (let i=0; i < ROWS;i++){
    reels.push([]); 
    const reelSymbols = [...symbols];

    for (let j=0; j<COLS; j++) {
      
      const randomIndex= Math.floor(Math.random() * reelSymbols.length);
      const randomSymbol = reelSymbols[randomIndex];
      reels[i].push(randomSymbol);
      reelSymbols.splice(randomIndex,1);
    }
  }
    return reels;
}

export function getWinnings(reels,bet,lines) {
  
  let winnings = 0;

  for ( let i = 0; i < lines; i++) {
    const symbolsWinningCheck = reels[i]; //unpack the array, one inner array at a time

    let allSame=true;

    for (let j = 1; j <symbolsWinningCheck.length; j++) {

      if (symbolsWinningCheck[0] !== symbolsWinningCheck[j]) {
        allSame = false;
        break;
      }

    }

    if (allSame){
      winnings += bet * (SYMBOLS_VALUES[symbolsWinningCheck[0]]);
    }
  }
    return winnings;

}

export function invalidBetLines(lines){
  if (isNaN(lines) || lines <= 0 || ROWS < lines)
      {
        return true;
      }
  return false;
}

export function invalidBetAmount (balance, betPerLine, lines) {
  if (balance < (betPerLine*lines) || isNaN(betPerLine) || betPerLine <= 0 ){
      return true; 
    }
  return false;
}