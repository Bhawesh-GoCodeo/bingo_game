import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import BingoBoard from './components/BingoBoard';
import BoardSizeSelector from './components/BoardSizeSelector';
import GameControls from './components/GameControls';
import WinnerModal from './components/WinnerModal';
import PowerUps from './components/PowerUps';
import TimedMode from './components/TimedMode';
import GameSettings from './components/GameSettings';
import GameModeSelector from './components/GameModeSelector';
import { BoardSize, BingoBoard as BingoBoardType, GameState, GameModeConfig } from './utils/types';
import { generateBoard, resetBoard, initializeGameState } from './utils/gameLogic';
import { GameModesProvider, useGameModes } from './context/GameModesContext';

const AppContent: React.FC = () => {
  const { 
    state, 
    dispatch, 
    resetGame, 
    usePowerUpAction, 
    startGame 
  } = useGameModes();
  
  const { 
    board, 
    boardSize, 
    gameState, 
    gameMode, 
    powerUps, 
    settings 
  } = state;
  
  const [showWinModal, setShowWinModal] = useState(false);
  
  // Handle board size change
  const handleSizeChange = (size: BoardSize) => {
    startGame(size, gameMode);
  };
  
  // Handle game mode change
  const handleModeChange = (mode: GameModeConfig) => {
    startGame(boardSize, mode);
  };
  
  // Handle board reset
  const handleReset = () => {
    resetGame();
    setShowWinModal(false);
  };
  
  // Handle win
  const handleWin = () => {
    setShowWinModal(true);
  };
  
  // Handle power-up use
  const handleUsePowerUp = (type: any) => {
    usePowerUpAction(type);
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-gray-100 py-4 px-2 sm:py-8 sm:px-4 overflow-hidden">
      <motion.div 
        className="max-w-4xl mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <header className="text-center mb-4 sm:mb-6">
          <motion.h1 
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-primary mb-1 sm:mb-2 text-shadow"
            initial={{ y: -50 }}
            animate={{ y: 0 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            Bingo Game
          </motion.h1>
          <p className="text-gray-600 text-sm sm:text-base px-2">
            Click on numbers as they are called to mark them. Complete 5 lines to win!
          </p>
        </header>
        
        <GameSettings />
        
        <GameModeSelector 
          onSelectMode={handleModeChange}
          currentMode={gameMode}
        />
        
        <BoardSizeSelector 
          currentSize={boardSize} 
          onSizeChange={handleSizeChange} 
        />
        
        <PowerUps 
          powerUps={powerUps}
          onUsePowerUp={handleUsePowerUp}
        />
        
        <TimedMode />
        
        <div className="bg-white rounded-xl shadow-lg p-2 sm:p-4 md:p-6 mx-auto max-w-full">
          <BingoBoard 
            board={board} 
            size={boardSize} 
            gameState={gameState}
            onBoardChange={(newBoard) => dispatch({ type: 'UPDATE_BOARD', payload: { board: newBoard } })}
            onGameStateChange={(newGameState) => dispatch({ type: 'UPDATE_GAME_STATE', payload: { gameState: newGameState } })}
            onWin={handleWin}
          />
        </div>
        
        <GameControls 
          onReset={handleReset}
          gameState={gameState}
          hasWon={gameState.completedLines.length >= gameState.requiredLinesToWin}
        />
        
        <WinnerModal 
          isOpen={showWinModal}
          gameState={gameState}
          onClose={() => setShowWinModal(false)}
          onNewGame={handleReset}
        />
      </motion.div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <GameModesProvider>
      <AppContent />
    </GameModesProvider>
  );
};

export default App;