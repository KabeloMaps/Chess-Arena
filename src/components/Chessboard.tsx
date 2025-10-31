import { motion } from "framer-motion";
import { RotateCcw } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
console.log("Chessboard component loaded");

interface ChessboardProps {
  position: string;
  lastMove: { from: string; to: string } | null;
  isFlipped: boolean;
  onFlip: () => void;
}

const FILES = ["a", "b", "c", "d", "e", "f", "g", "h"];
const RANKS = ["8", "7", "6", "5", "4", "3", "2", "1"];

const PIECE_SYMBOLS: Record<string, string> = {
  K: "♔",
  Q: "♕",
  R: "♖",
  B: "♗",
  N: "♘",
  P: "♙",
  k: "♚",
  q: "♛",
  r: "♜",
  b: "♝",
  n: "♞",
  p: "♟",
};

export function Chessboard({
  position,
  lastMove,
  isFlipped,
  onFlip,
}: ChessboardProps) {
  const parseFen = (fen: string): (string | null)[][] => {
    const board: (string | null)[][] = [];
    const rows = fen.split(" ")[0].split("/");

    for (const row of rows) {
      const boardRow: (string | null)[] = [];
      for (const char of row) {
        if (char >= "1" && char <= "8") {
          const emptySquares = parseInt(char);
          for (let i = 0; i < emptySquares; i++) {
            boardRow.push(null);
          }
        } else {
          boardRow.push(char);
        }
      }
      board.push(boardRow);
    }

    return board;
  };

  const getSquareNotation = (rank: number, file: number): string => {
    const actualRank = isFlipped ? rank : 7 - rank;
    const actualFile = isFlipped ? 7 - file : file;
    return `${FILES[actualFile]}${RANKS[actualRank]}`;
  };

  const isHighlighted = (square: string): boolean => {
    if (!lastMove) return false;
    return square === lastMove.from || square === lastMove.to;
  };

  const board = parseFen(position);
  const displayBoard = isFlipped
    ? [...board].reverse().map((row) => [...row].reverse())
    : board;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Badge variant="secondary">
          {isFlipped ? "Black's View" : "White's View"}
        </Badge>
        <Button variant="outline" size="sm" onClick={onFlip}>
          <RotateCcw className="size-4 mr-2" />
          Flip Board
        </Button>
      </div>

      <div className="relative aspect-square w-full max-w-[600px] mx-auto">
        <div className="absolute inset-0 grid grid-cols-8 grid-rows-8 border-2 border-slate-800 dark:border-slate-200 rounded-lg overflow-hidden shadow-2xl">
          {displayBoard.map((row, rankIndex) =>
            row.map((piece, fileIndex) => {
              const isLight = (rankIndex + fileIndex) % 2 === 0;
              const square = getSquareNotation(rankIndex, fileIndex);
              const highlighted = isHighlighted(square);

              return (
                <motion.div
                  key={`${rankIndex}-${fileIndex}`}
                  className={`relative flex items-center justify-center ${
                    isLight
                      ? highlighted
                        ? "bg-amber-200 dark:bg-amber-600"
                        : "bg-amber-100 dark:bg-amber-700"
                      : highlighted
                      ? "bg-amber-400 dark:bg-amber-800"
                      : "bg-amber-600 dark:bg-amber-900"
                  }`}
                  initial={false}
                  animate={{
                    scale: highlighted ? [1, 1.05, 1] : 1,
                  }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Coordinate labels */}
                  {fileIndex === 0 && (
                    <span className="absolute left-1 top-1 text-xs opacity-50">
                      {isFlipped ? RANKS[7 - rankIndex] : RANKS[rankIndex]}
                    </span>
                  )}
                  {rankIndex === 7 && (
                    <span className="absolute right-1 bottom-1 text-xs opacity-50">
                      {isFlipped ? FILES[7 - fileIndex] : FILES[fileIndex]}
                    </span>
                  )}

                  {/* Piece */}
                  {piece && (
                    <motion.div
                      key={`${square}-${piece}`}
                      className={`text-4xl md:text-5xl lg:text-6xl select-none ${
                        piece === piece.toUpperCase()
                          ? "text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]"
                          : "text-slate-900 drop-shadow-[0_1px_1px_rgba(255,255,255,0.3)]"
                      }`}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 20,
                      }}
                    >
                      {PIECE_SYMBOLS[piece]}
                    </motion.div>
                  )}
                </motion.div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

export default Chessboard;
