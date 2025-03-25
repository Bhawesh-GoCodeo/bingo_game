import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { 
  BoardSize, 
  BingoBoard, 
  GameState, 
  GameModeConfig, 
  GameSettings, 
  PowerUpType,
  PowerUp
} from '../utils/types';
import { 
  generateBoard, 
  initializeGameState, 
  markCell, 
  shuffleBoard, 
  revealCells, 
  applyWildcard,
  getInitialPowerUps,
  usePowerUp
} from '../utils/gameLogic';
import { 
  playClick, 
  playSuccess, 
  playPowerUp, 
  vibrate, 
  initAudio 
} from '../utils/SensoryFeedback';

interface GameModesState {
  board: BingoBoard;
  boardSize: BoardSize;
  gameState: GameState;
  gameMode: GameModeConfig;
  timeLeft: number | null;
  isGameActive: boolean;
  powerUps: PowerUp[];
  settings: GameSettings;
  isWildcardActive: boolean;
}

type GameModesAction =
  | { type: 'START_GAME'; payload: { size: BoardSize; mode: GameModeConfig } }
  | { type: 'RESET_GAME' }
  | { type: 'MARK_CELL'; payload: { row: number; col: number } }
  | { type: 'UPDATE_BOARD'; payload: { board: BingoBoard } }
  | { type: 'USE_POWER_UP'; payload: { type: PowerUpType; params?: any } }
  | { type: 'UPDATE_TIMER'; payload: { timeLeft: number } }
  | { type: 'TOGGLE_SETTING'; payload: { setting: keyof GameSettings } }
  | { type: 'UPDATE_GAME_STATE'; payload: { gameState: GameState } }
  | { type: 'SET_WILDCARD_ACTIVE'; payload: { active: boolean } };

interface GameModesContextType {
  state: GameModesState;
  dispatch: React.Dispatch<GameModesAction>;
  markCellAction: (row: number, col: number) => void;
  usePowerUpAction: (type: PowerUpType, params?: any) => void;
  toggleSetting: (setting: keyof GameSettings) => void;
  startGame: (size: BoardSize, mode: GameModeConfig) => void;
  resetGame: () => void;
}

const initialSettings: GameSettings = {
  soundEnabled: true,
  vibrationEnabled: true,
  darkMode: false,
  animationsEnabled: true,
  tooltipsEnabled: true
};

const initialState: GameModesState = {
  board: generateBoard(5),
  boardSize: 5,
  gameState: initializeGameState(),
  gameMode: { mode: 'classic' },
  timeLeft: null,
  isGameActive: false,
  powerUps: getInitialPowerUps(),
  settings: initialSettings,
  isWildcardActive: false
};

const gameModesReducer = (state: GameModesState, action: GameModesAction): GameModesState => {
  switch (action.type) {
    case 'START_GAME':
      return {
        ...state,
        board: generateBoard(action.payload.size),
        boardSize: action.payload.size,
        gameState: initializeGameState(),
        gameMode: action.payload.mode,
        timeLeft: action.payload.mode.timeLimit || null,
        isGameActive: true,
        powerUps: getInitialPowerUps(),
        isWildcardActive: false
      };
      
    case 'RESET_GAME':
      return {
        ...state,
        board: generateBoard(state.boardSize),
        gameState: initializeGameState(),
        timeLeft: state.gameMode.timeLimit || null,
        isGameActive: true,
        powerUps: getInitialPowerUps(),
        isWildcardActive: false
      };
      
    case 'MARK_CELL':
      return {
        ...state,
        board: markCell(state.board, action.payload.row, action.payload.col)
      };
      
    case 'UPDATE_BOARD':
      return {
        ...state,
        board: action.payload.board
      };
      
    case 'USE_POWER_UP': {
      let updatedBoard = [...state.board];
      
      switch (action.payload.type) {
        case 'shuffle':
          updatedBoard = shuffleBoard(state.board);
          break;
        case 'reveal':
          updatedBoard = revealCells(state.board, 3);
          break;
        case 'wildcard':
          return {
            ...state,
            isWildcardActive: true,
            powerUps: usePowerUp(state.powerUps, action.payload.type)
          };
        case 'freeze':
          if (state.timeLeft !== null) {
            return {
              ...state,
              timeLeft: state.timeLeft + 30,
              powerUps: usePowerUp(state.powerUps, action.payload.type)
            };
          }
          return state;
        default:
          break;
      }
      
      return {
        ...state,
        board: updatedBoard,
        powerUps: usePowerUp(state.powerUps, action.payload.type)
      };
    }
      
    case 'UPDATE_TIMER':
      return {
        ...state,
        timeLeft: action.payload.timeLeft
      };
      
    case 'TOGGLE_SETTING':
      return {
        ...state,
        settings: {
          ...state.settings,
          [action.payload.setting]: !state.settings[action.payload.setting]
        }
      };
      
    case 'UPDATE_GAME_STATE':
      return {
        ...state,
        gameState: action.payload.gameState
      };
      
    case 'SET_WILDCARD_ACTIVE':
      return {
        ...state,
        isWildcardActive: action.payload.active
      };
      
    default:
      return state;
  }
};

const GameModesContext = createContext<GameModesContextType | undefined>(undefined);

export const GameModesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(gameModesReducer, initialState);
  
  // Initialize audio on first user interaction
  useEffect(() => {
    const handleUserInteraction = () => {
      initAudio();
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('touchstart', handleUserInteraction);
    };
    
    document.addEventListener('click', handleUserInteraction);
    document.addEventListener('touchstart', handleUserInteraction);
    
    return () => {
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('touchstart', handleUserInteraction);
    };
  }, []);
  
  // Timer logic for timed mode
  useEffect(() => {
    let timerId: number | undefined;
    
    if (state.isGameActive && state.gameMode.mode === 'timed' && state.timeLeft !== null && state.timeLeft > 0) {
      timerId = window.setInterval(() => {
        dispatch({ type: 'UPDATE_TIMER', payload: { timeLeft: state.timeLeft! - 1 } });
      }, 1000);
    }
    
    return () => {
      if (timerId !== undefined) {
        clearInterval(timerId);
      }
    };
  }, [state.isGameActive, state.gameMode.mode, state.timeLeft]);
  
  // Actions
  const markCellAction = (row: number, col: number) => {
    if (state.isWildcardActive) {
      const updatedBoard = applyWildcard(state.board, row, col);
      dispatch({ type: 'UPDATE_BOARD', payload: { board: updatedBoard } });
      dispatch({ type: 'SET_WILDCARD_ACTIVE', payload: { active: false } });
      
      if (state.settings.soundEnabled) {
        playPowerUp(state.settings.soundEnabled);
      }
      if (state.settings.vibrationEnabled) {
        vibrate([30, 20, 30], state.settings.vibrationEnabled);
      }
    } else {
      dispatch({ type: 'MARK_CELL', payload: { row, col } });
      
      if (state.settings.soundEnabled) {
        playClick(state.settings.soundEnabled);
      }
      if (state.settings.vibrationEnabled) {
        vibrate(20, state.settings.vibrationEnabled);
      }
    }
  };
  
  const usePowerUpAction = (type: PowerUpType, params?: any) => {
    dispatch({ type: 'USE_POWER_UP', payload: { type, params } });
    
    if (state.settings.soundEnabled) {
      playPowerUp(state.settings.soundEnabled);
    }
    if (state.settings.vibrationEnabled) {
      vibrate([50, 30, 50], state.settings.vibrationEnabled);
    }
  };
  
  const toggleSetting = (setting: keyof GameSettings) => {
    dispatch({ type: 'TOGGLE_SETTING', payload: { setting } });
  };
  
  const startGame = (size: BoardSize, mode: GameModeConfig) => {
    dispatch({ type: 'START_GAME', payload: { size, mode } });
  };
  
  const resetGame = () => {
    dispatch({ type: 'RESET_GAME' });
  };
  
  return (
    <GameModesContext.Provider
      value={{
        state,
        dispatch,
        markCellAction,
        usePowerUpAction,
        toggleSetting,
        startGame,
        resetGame
      }}
    >
      {children}
    </GameModesContext.Provider>
  );
};

export const useGameModes = () => {
  const context = useContext(GameModesContext);
  if (context === undefined) {
    throw new Error('useGameModes must be used within a GameModesProvider');
  }
  return context;
};
