// import { BoardSize, BingoBoard, BingoCellData, WinningLine, GameState, PowerUpType } from './types';

// Generate a random board with numbers in the appropriate range
import { BoardSize, BingoBoard, BingoCellData, WinningLine, GameState } from './types';

export const generateBoard = (size: BoardSize): BingoBoard => {
  const board: BingoBoard = [];
  const usedNumbers = new Set<number>();
  const maxNumber = size * size;
  
  for (let row = 0; row < size; row++) {
    const newRow: BingoCellData[] = [];
    for (let col = 0; col < size; col++) {
      let randomNum;
      do {
        randomNum = Math.floor(Math.random() * maxNumber) + 1;
      } while (usedNumbers.has(randomNum));
      
      usedNumbers.add(randomNum);
      
      newRow.push({
        value: randomNum,
        isMarked: false,
        isFreeSpace: false,
        isWinningCell: false,
        winningLineIndices: [],
        isRevealed: false,
      });
    }
    board.push(newRow);
  }
  
  return board;
};

export const checkForWinningLines = (board: BingoBoard): WinningLine[] => {
  const size = board.length;
  const winningLines: WinningLine[] = [];
  
  // Check rows
  for (let row = 0; row < size; row++) {
    const isRowComplete = board[row].every(cell => cell.isMarked);
    if (isRowComplete) {
      const cells: [number, number][] = [];
      for (let col = 0; col < size; col++) {
        cells.push([row, col]);
      }
      winningLines.push({ type: 'row', index: row, cells });
    }
  }
  
  // Check columns
  for (let col = 0; col < size; col++) {
    const isColumnComplete = board.every(row => row[col].isMarked);
    if (isColumnComplete) {
      const cells: [number, number][] = [];
      for (let row = 0; row < size; row++) {
        cells.push([row, col]);
      }
      winningLines.push({ type: 'column', index: col, cells });
    }
  }
  
  // Check main diagonal
  const isMainDiagonalComplete = board.every((row, i) => row[i].isMarked);
  if (isMainDiagonalComplete) {
    const cells: [number, number][] = [];
    for (let i = 0; i < size; i++) {
      cells.push([i, i]);
    }
    winningLines.push({ type: 'diagonal', index: 0, cells });
  }
  
  // Check anti-diagonal
  const isAntiDiagonalComplete = board.every((row, i) => row[size - 1 - i].isMarked);
  if (isAntiDiagonalComplete) {
    const cells: [number, number][] = [];
    for (let i = 0; i < size; i++) {
      cells.push([i, size - 1 - i]);
    }
    winningLines.push({ type: 'diagonal', index: 1, cells });
  }
  
  return winningLines;
};

export const markCell = (board: BingoBoard, row: number, col: number): BingoBoard => {
  const newBoard = JSON.parse(JSON.stringify(board)) as BingoBoard;
  newBoard[row][col].isMarked = !newBoard[row][col].isMarked;
  return newBoard;
};

export const markWinningCells = (board: BingoBoard, winningLines: WinningLine[]): BingoBoard => {
  const newBoard = JSON.parse(JSON.stringify(board)) as BingoBoard;
  
  // Reset winning cell states
  for (let row = 0; row < newBoard.length; row++) {
    for (let col = 0; col < newBoard[row].length; col++) {
      newBoard[row][col].isWinningCell = false;
      newBoard[row][col].winningLineIndices = [];
    }
  }
  
  // Mark winning cells and track line indices
  winningLines.forEach((line, lineIndex) => {
    line.cells.forEach(([row, col]) => {
      newBoard[row][col].isWinningCell = true;
      if (!newBoard[row][col].winningLineIndices.includes(lineIndex)) {
        newBoard[row][col].winningLineIndices.push(lineIndex);
      }
    });
  });
  
  return newBoard;
};

export const updateGameState = (currentState: GameState, newLines: WinningLine[]): GameState => {
  const existingLineKeys = new Set(
    currentState.completedLines.map(line => `${line.type}-${line.index}`)
  );
  
  const uniqueNewLines = newLines.filter(line => {
    const lineKey = `${line.type}-${line.index}`;
    return !existingLineKeys.has(lineKey);
  });
  
  if (uniqueNewLines.length === 0) {
    return currentState;
  }
  
  return {
    ...currentState,
    completedLines: [...currentState.completedLines, ...uniqueNewLines]
  };
};

// export const isGameWon = (gameState: GameState): boolean => {
//   return gameState.completedLines.length >= gameState.requiredLinesToWin;
// };

export const resetBoard = (size: BoardSize): BingoBoard => {
  return generateBoard(size);
};

export const initializeGameState = (): GameState => {
  return {
    completedLines: [],
    requiredLinesToWin: 5
  };
};
// Check if the game is won
export const isGameWon = (gameState: GameState): boolean => {
  return gameState.completedLines.length >= gameState.requiredLinesToWin;
};

// Update game state with new winning lines
// export const updateGameState = (
//   gameState: GameState, 
//   newWinningLines: WinningLine[]
// ): GameState => {
//   // Filter out any winning lines that are already in the game state
//   const existingLineKeys = new Set(
//     gameState.completedLines.map(line => `${line.type}-${line.index}`)
//   );
  
//   const uniqueNewLines = newWinningLines.filter(
//     line => !existingLineKeys.has(`${line.type}-${line.index}`)
//   );
  
//   return {
//     ...gameState,
//     completedLines: [...gameState.completedLines, ...uniqueNewLines]
//   };
// };

// Shuffle the board (power-up)
export const shuffleBoard = (board: BingoBoard): BingoBoard => {
  const size = board.length;
  const newBoard = JSON.parse(JSON.stringify(board)) as BingoBoard;
  const unmarkedCells: [number, number, number][] = []; // [row, col, value]
  
  // Collect all unmarked cells
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      if (!newBoard[row][col].isMarked && !newBoard[row][col].isFreeSpace) {
        unmarkedCells.push([row, col, newBoard[row][col].value]);
      }
    }
  }
  
  // Shuffle the values
  for (let i = unmarkedCells.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [unmarkedCells[i][2], unmarkedCells[j][2]] = [unmarkedCells[j][2], unmarkedCells[i][2]];
  }
  
  // Reassign the shuffled values
  for (const [row, col, value] of unmarkedCells) {
    newBoard[row][col].value = value;
  }
  
  return newBoard;
};

// Reveal random cells (power-up)
export const revealCells = (board: BingoBoard, count: number): BingoBoard => {
  const size = board.length;
  const newBoard = JSON.parse(JSON.stringify(board)) as BingoBoard;
  const unmarkedCells: [number, number][] = []; // [row, col]
  
  // Collect all unmarked and unrevealed cells
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      if (!newBoard[row][col].isMarked && !newBoard[row][col].isRevealed && !newBoard[row][col].isFreeSpace) {
        unmarkedCells.push([row, col]);
      }
    }
  }
  
  // Shuffle the unmarked cells
  for (let i = unmarkedCells.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [unmarkedCells[i], unmarkedCells[j]] = [unmarkedCells[j], unmarkedCells[i]];
  }
  
  // Reveal the first 'count' cells
  const cellsToReveal = unmarkedCells.slice(0, Math.min(count, unmarkedCells.length));
  for (const [row, col] of cellsToReveal) {
    newBoard[row][col].isRevealed = true;
  }
  
  return newBoard;
};

// Apply wildcard (power-up)
export const applyWildcard = (board: BingoBoard, row: number, col: number): BingoBoard => {
  const newBoard = JSON.parse(JSON.stringify(board)) as BingoBoard;
  
  // Mark the cell and all adjacent cells
  const size = board.length;
  const directions = [
    [-1, -1], [-1, 0], [-1, 1],
    [0, -1],           [0, 1],
    [1, -1],  [1, 0],  [1, 1]
  ];
  
  newBoard[row][col].isMarked = true;
  
  for (const [dr, dc] of directions) {
    const newRow = row + dr;
    const newCol = col + dc;
    
    if (newRow >= 0 && newRow < size && newCol >= 0 && newCol < size) {
      newBoard[newRow][newCol].isMarked = true;
    }
  }
  
  return newBoard;
};

// Get initial power-ups
export const getInitialPowerUps = () => {
  return [
    {
      type: 'reveal',
      name: 'Reveal',
      description: 'Reveals 3 random numbers on the board',
      icon: '👁️',
      usesLeft: 2,
      cooldown: 30000, // 30 seconds
      lastUsed: null
    },
    {
      type: 'shuffle',
      name: 'Shuffle',
      description: 'Shuffles all unmarked numbers on the board',
      icon: '🔄',
      usesLeft: 1,
      cooldown: 60000, // 60 seconds
      lastUsed: null
    },
    {
      type: 'wildcard',
      name: 'Wildcard',
      description: 'Marks a cell and all adjacent cells',
      icon: '⭐',
      usesLeft: 1,
      cooldown: 90000, // 90 seconds
      lastUsed: null
    },
    {
      type: 'freeze',
      name: 'Freeze',
      description: 'Adds 30 seconds to the timer in timed mode',
      icon: '❄️',
      usesLeft: 1,
      cooldown: 120000, // 120 seconds
      lastUsed: null
    }
  ];
};

// Check if a power-up is available
export const isPowerUpAvailable = (powerUp: any) => {
  if (powerUp.usesLeft <= 0) return false;
  
  if (powerUp.lastUsed === null) return true;
  
  const now = Date.now();
  return now - powerUp.lastUsed >= powerUp.cooldown;
};

// Use a power-up
export const usePowerUp = (powerUps: any[], type: PowerUpType) => {
  return powerUps.map(powerUp => {
    if (powerUp.type === type) {
      return {
        ...powerUp,
        usesLeft: powerUp.usesLeft - 1,
        lastUsed: Date.now()
      };
    }
    return powerUp;
  });
};
