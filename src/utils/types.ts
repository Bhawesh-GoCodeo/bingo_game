export type BoardSize = 5 | 8 | 10;

export interface BingoCellData {
  value: number;
  isMarked: boolean;
  isFreeSpace: boolean;
  isWinningCell: boolean;
  winningLineIndices: number[];
  isRevealed?: boolean; // For reveal power-up
}

export type BingoBoard = BingoCellData[][];

export interface WinningLine {
  type: 'row' | 'column' | 'diagonal';
  index: number;
  cells: [number, number][];
}

export interface GameState {
  completedLines: WinningLine[];
  requiredLinesToWin: number;
}

export type PowerUpType = 'reveal' | 'shuffle' | 'wildcard' | 'freeze';

export interface PowerUp {
  type: PowerUpType;
  name: string;
  description: string;
  icon: string;
  usesLeft: number;
  cooldown: number;
  lastUsed: number | null;
}

export type GameMode = 'classic' | 'timed' | 'challenge';

export interface GameModeConfig {
  mode: GameMode;
  timeLimit?: number; // in seconds, for timed mode
  targetLines?: number; // for challenge mode
  difficulty?: 'easy' | 'medium' | 'hard';
}

export interface GameSettings {
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  darkMode: boolean;
  animationsEnabled: boolean;
  tooltipsEnabled: boolean;
}

export type GameAction =
  | { type: 'START_GAME'; payload: { size: BoardSize; mode: GameModeConfig } }
  | { type: 'RESET_GAME' }
  | { type: 'MARK_CELL'; payload: { row: number; col: number } }
  | { type: 'UPDATE_BOARD'; payload: { board: BingoBoard } }
  | { type: 'USE_POWER_UP'; payload: { type: PowerUpType; params?: any } }
  | { type: 'UPDATE_TIMER'; payload: { timeLeft: number } }
  | { type: 'TOGGLE_SETTING'; payload: { setting: keyof GameSettings } }
  | { type: 'UPDATE_GAME_STATE'; payload: { gameState: GameState } };
