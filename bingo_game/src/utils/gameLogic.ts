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

export const isGameWon = (gameState: GameState): boolean => {
  return gameState.completedLines.length >= gameState.requiredLinesToWin;
};

export const resetBoard = (size: BoardSize): BingoBoard => {
  return generateBoard(size);
};

export const initializeGameState = (): GameState => {
  return {
    completedLines: [],
    requiredLinesToWin: 5
  };
};
