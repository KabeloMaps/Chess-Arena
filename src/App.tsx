import { useState, useEffect } from "react";
import { Chessboard } from "./components/Chessboard";
import { Card } from "./components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@radix-ui/react-tabs";
import { Toaster } from "sonner";
import { EngineSelector } from "./components/EngineSelector";
import { Chess } from "chess.js";
import { GameControls } from "./components/GameControls";
import { MoveHistory } from "./components/MoveHistory";
import { PositionEditor } from "./components/PositionEditor";
import { ReplayControls } from "./components/ReplayControls";
import { SettingsPanel } from "./components/SettingsPanel";
import { StatusDisplay } from "./components/StatusDisplay";
import { EvaluationGraph } from "./components/EvaluationGraph";

export type Engine = {
  id: string;
  name: string;
  difficulty?: number;
};

export type GameStatus = "setup" | "playing" | "paused" | "finished";

const AVAILABLE_ENGINES: Engine[] = [
  { id: "stockfish", name: "Stockfish 16" },
  { id: "leela", name: "Leela Chess Zero" },
  { id: "komodo", name: "Komodo Dragon" },
  { id: "fire", name: "Fire 8" },
];

export default function App() {
  const [game, setGame] = useState(new Chess());
  const [whiteEngine, setWhiteEngine] = useState<Engine>(AVAILABLE_ENGINES[0]);
  const [blackEngine, setBlackEngine] = useState<Engine>(AVAILABLE_ENGINES[1]);
  const [gameStatus, setGameStatus] = useState<GameStatus>("setup");
  const [moveHistory, setMoveHistory] = useState<string[]>([]);
  const [currentMoveIndex, setCurrentMoveIndex] = useState(0);
  const [lastMove, setLastMove] = useState<{ from: string; to: string } | null>(
    null
  );
  const [isFlipped, setIsFlipped] = useState(false);
  const [autoPlaySpeed, setAutoPlaySpeed] = useState(1000); // ms per move
  const [autoPlayInterval, setAutoPlayInterval] =
    useState<NodeJS.Timeout | null>(null);
  const [evaluations, setEvaluations] = useState<number[]>([]);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [theme, setTheme] = useState<"light" | "dark">("light");

  // Replay mode state
  const [isReplayMode, setIsReplayMode] = useState(false);
  const [replayMoveIndex, setReplayMoveIndex] = useState(0);
  const [isReplayPlaying, setIsReplayPlaying] = useState(false);
  const [replaySpeed, setReplaySpeed] = useState(800);
  const [replayInterval, setReplayInterval] = useState<NodeJS.Timeout | null>(
    null
  );

  // Initialize engines
  const [whiteEngineInstance] = useState(
    () => new ChessEngine(ENGINE_CONFIGS[whiteEngine.id])
  );
  const [blackEngineInstance] = useState(
    () => new ChessEngine(ENGINE_CONFIGS[blackEngine.id])
  );

  // Theme management
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
  }, [theme]);

  // Sound management
  useEffect(() => {
    soundEffects.setEnabled(soundEnabled);
  }, [soundEnabled]);

  const handleStartGame = () => {
    if (gameStatus === "setup") {
      setGameStatus("playing");
      soundEffects.playStart();
      startAutoPlay();
    } else if (gameStatus === "paused") {
      setGameStatus("playing");
      startAutoPlay();
    }
  };

  const handlePauseGame = () => {
    setGameStatus("paused");
    if (autoPlayInterval) {
      clearInterval(autoPlayInterval);
      setAutoPlayInterval(null);
    }
  };

  const handleResetGame = () => {
    const newGame = new Chess();
    setGame(newGame);
    setGameStatus("setup");
    setMoveHistory([]);
    setCurrentMoveIndex(0);
    setLastMove(null);
    setEvaluations([]);
    setIsReplayMode(false);
    setReplayMoveIndex(0);
    if (autoPlayInterval) {
      clearInterval(autoPlayInterval);
      setAutoPlayInterval(null);
    }
    if (replayInterval) {
      clearInterval(replayInterval);
      setReplayInterval(null);
    }
  };

  const startAutoPlay = () => {
    if (autoPlayInterval) {
      clearInterval(autoPlayInterval);
    }

    const interval = setInterval(() => {
      setGame((prevGame) => {
        const gameCopy = new Chess(prevGame.fen());

        if (gameCopy.isGameOver()) {
          setGameStatus("finished");
          soundEffects.playGameEnd();
          if (autoPlayInterval) {
            clearInterval(autoPlayInterval);
            setAutoPlayInterval(null);
          }
          // Enable replay mode after game finishes
          setTimeout(() => {
            setIsReplayMode(true);
          }, 1000);
          return prevGame;
        }

        // Use the engine to get the best move
        const currentEngine =
          gameCopy.turn() === "w" ? whiteEngineInstance : blackEngineInstance;
        const bestMove = currentEngine.getBestMove(gameCopy);

        if (!bestMove) return prevGame;

        try {
          const wasCapture = gameCopy.get(bestMove.to) !== null;
          const result = gameCopy.move(bestMove);

          if (result) {
            setLastMove({ from: result.from, to: result.to });
            setMoveHistory((prev) => [...prev, result.san]);
            setCurrentMoveIndex((prev) => prev + 1);

            // Get evaluation after move
            const evaluation = currentEngine.getEvaluation(gameCopy);
            setEvaluations((prev) => [...prev, evaluation]);

            // Play sounds
            if (gameCopy.isCheck()) {
              soundEffects.playCheck();
            } else if (wasCapture) {
              soundEffects.playCapture();
            } else {
              soundEffects.playMove();
            }
          }
          return gameCopy;
        } catch (e) {
          return prevGame;
        }
      });
    }, autoPlaySpeed);

    setAutoPlayInterval(interval);
  };

  const handleStepForward = () => {
    // This would step through a recorded game
    // For now, make a single move
    if (gameStatus === "paused" || gameStatus === "playing") {
      const gameCopy = new Chess(game.fen());
      const currentEngine =
        gameCopy.turn() === "w" ? whiteEngineInstance : blackEngineInstance;
      const bestMove = currentEngine.getBestMove(gameCopy);

      if (bestMove) {
        try {
          const wasCapture = gameCopy.get(bestMove.to) !== null;
          const result = gameCopy.move(bestMove);

          if (result) {
            setLastMove({ from: result.from, to: result.to });
            setMoveHistory((prev) => [...prev, result.san]);
            setCurrentMoveIndex((prev) => prev + 1);
            setGame(gameCopy);

            // Get evaluation
            const evaluation = currentEngine.getEvaluation(gameCopy);
            setEvaluations((prev) => [...prev, evaluation]);

            // Play sounds
            if (gameCopy.isCheck()) {
              soundEffects.playCheck();
            } else if (wasCapture) {
              soundEffects.playCapture();
            } else {
              soundEffects.playMove();
            }
          }
        } catch (e) {
          // Error making move
        }
      }
    }
  };

  const handleStepBackward = () => {
    if (moveHistory.length > 0) {
      const newGame = new Chess();
      const newHistory = [...moveHistory];
      newHistory.pop();

      // Replay all moves except the last one
      for (const moveStr of newHistory) {
        try {
          newGame.move(moveStr);
        } catch (e) {
          // Error replaying move
        }
      }

      setGame(newGame);
      setMoveHistory(newHistory);
      setCurrentMoveIndex((prev) => Math.max(0, prev - 1));
      setLastMove(null);
      setEvaluations((prev) => prev.slice(0, -1));
    }
  };

  const handleApplyPosition = (fen: string) => {
    try {
      const newGame = new Chess(fen);
      setGame(newGame);
      setMoveHistory([]);
      setCurrentMoveIndex(0);
      setLastMove(null);
      setEvaluations([]);
      setGameStatus("setup");
      setIsReplayMode(false);
    } catch (e) {
      // Invalid FEN
    }
  };

  // Replay mode functions
  const handleReplayPlay = () => {
    setIsReplayPlaying(true);

    const interval = setInterval(() => {
      setReplayMoveIndex((prev) => {
        if (prev >= moveHistory.length - 1) {
          setIsReplayPlaying(false);
          if (replayInterval) {
            clearInterval(replayInterval);
            setReplayInterval(null);
          }
          return prev;
        }

        // Apply the next move
        const nextIndex = prev + 1;
        replayToMove(nextIndex);
        return nextIndex;
      });
    }, replaySpeed);

    setReplayInterval(interval);
  };

  const handleReplayPause = () => {
    setIsReplayPlaying(false);
    if (replayInterval) {
      clearInterval(replayInterval);
      setReplayInterval(null);
    }
  };

  const handleReplayReset = () => {
    setReplayMoveIndex(0);
    replayToMove(0);
    setIsReplayPlaying(false);
    if (replayInterval) {
      clearInterval(replayInterval);
      setReplayInterval(null);
    }
  };

  const handleReplayNext = () => {
    if (replayMoveIndex < moveHistory.length - 1) {
      const nextIndex = replayMoveIndex + 1;
      setReplayMoveIndex(nextIndex);
      replayToMove(nextIndex);
    }
  };

  const handleReplayPrevious = () => {
    if (replayMoveIndex > 0) {
      const prevIndex = replayMoveIndex - 1;
      setReplayMoveIndex(prevIndex);
      replayToMove(prevIndex);
    }
  };

  const handleReplaySeek = (moveIndex: number) => {
    setReplayMoveIndex(moveIndex);
    replayToMove(moveIndex);
  };

  const replayToMove = (moveIndex: number) => {
    const newGame = new Chess();

    for (let i = 0; i < moveIndex; i++) {
      try {
        newGame.move(moveHistory[i]);
      } catch (e) {
        // Error replaying move
      }
    }

    setGame(newGame);

    // Set last move highlight
    if (moveIndex > 0) {
      const tempGame = new Chess();
      for (let i = 0; i < moveIndex - 1; i++) {
        tempGame.move(moveHistory[i]);
      }
      const lastMoveObj = tempGame.move(moveHistory[moveIndex - 1]);
      if (lastMoveObj) {
        setLastMove({ from: lastMoveObj.from, to: lastMoveObj.to });
      }
    } else {
      setLastMove(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4 md:p-8">
      <Toaster />
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="mb-2">Chess Engine Arena</h1>
          <p className="text-slate-600 dark:text-slate-400">
            Watch automated matches between powerful chess engines
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Panel - Engine Selection & Controls */}
          <div className="lg:col-span-3 space-y-6">
            {!isReplayMode ? (
              <>
                <EngineSelector
                  whiteEngine={whiteEngine}
                  blackEngine={blackEngine}
                  availableEngines={AVAILABLE_ENGINES}
                  onWhiteEngineChange={setWhiteEngine}
                  onBlackEngineChange={setBlackEngine}
                  disabled={gameStatus === "playing"}
                />

                <GameControls
                  gameStatus={gameStatus}
                  onStart={handleStartGame}
                  onPause={handlePauseGame}
                  onReset={handleResetGame}
                  onStepForward={handleStepForward}
                  onStepBackward={handleStepBackward}
                  autoPlaySpeed={autoPlaySpeed}
                  onSpeedChange={setAutoPlaySpeed}
                  canStepBack={moveHistory.length > 0}
                />
              </>
            ) : (
              <ReplayControls
                isPlaying={isReplayPlaying}
                currentMove={replayMoveIndex}
                totalMoves={moveHistory.length}
                speed={replaySpeed}
                onPlay={handleReplayPlay}
                onPause={handleReplayPause}
                onReset={handleReplayReset}
                onNext={handleReplayNext}
                onPrevious={handleReplayPrevious}
                onSeek={handleReplaySeek}
                onSpeedChange={setReplaySpeed}
              />
            )}

            <StatusDisplay
              game={game}
              gameStatus={gameStatus}
              moveNumber={Math.floor(replayMoveIndex / 2) + 1}
              currentEngine={game.turn() === "w" ? whiteEngine : blackEngine}
            />

            <SettingsPanel
              soundEnabled={soundEnabled}
              onSoundToggle={setSoundEnabled}
              theme={theme}
              onThemeToggle={() =>
                setTheme(theme === "light" ? "dark" : "light")
              }
            />
          </div>

          {/* Center Panel - Chessboard */}
          <div className="lg:col-span-6">
            <Card className="p-6">
              <Tabs defaultValue="game" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-4">
                  <TabsTrigger value="game">Game View</TabsTrigger>
                  <TabsTrigger value="editor">Position Editor</TabsTrigger>
                </TabsList>

                <TabsContent value="game" className="space-y-4">
                  <Chessboard
                    position={game.fen()}
                    lastMove={lastMove}
                    isFlipped={isFlipped}
                    onFlip={() => setIsFlipped(!isFlipped)}
                  />
                </TabsContent>

                <TabsContent value="editor">
                  <PositionEditor
                    currentFen={game.fen()}
                    onApplyPosition={handleApplyPosition}
                  />
                </TabsContent>
              </Tabs>
            </Card>
          </div>

          {/* Right Panel - Move History & Evaluation */}
          <div className="lg:col-span-3 space-y-6">
            <MoveHistory
              moves={moveHistory}
              currentMoveIndex={currentMoveIndex}
            />

            <EvaluationGraph evaluations={evaluations} />
          </div>
        </div>
      </div>
    </div>
  );
}
