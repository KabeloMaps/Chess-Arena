import { Chess, Move } from "chess.js";

// Piece values for evaluation
const PIECE_VALUES: Record<string, number> = {
  p: 1,
  n: 3,
  b: 3,
  r: 5,
  q: 9,
  k: 0,
};

// Position bonuses for piece placement
const PAWN_TABLE = [
  [0, 0, 0, 0, 0, 0, 0, 0],
  [50, 50, 50, 50, 50, 50, 50, 50],
  [10, 10, 20, 30, 30, 20, 10, 10],
  [5, 5, 10, 25, 25, 10, 5, 5],
  [0, 0, 0, 20, 20, 0, 0, 0],
  [5, -5, -10, 0, 0, -10, -5, 5],
  [5, 10, 10, -20, -20, 10, 10, 5],
  [0, 0, 0, 0, 0, 0, 0, 0],
];

const KNIGHT_TABLE = [
  [-50, -40, -30, -30, -30, -30, -40, -50],
  [-40, -20, 0, 0, 0, 0, -20, -40],
  [-30, 0, 10, 15, 15, 10, 0, -30],
  [-30, 5, 15, 20, 20, 15, 5, -30],
  [-30, 0, 15, 20, 20, 15, 0, -30],
  [-30, 5, 10, 15, 15, 10, 5, -30],
  [-40, -20, 0, 5, 5, 0, -20, -40],
  [-50, -40, -30, -30, -30, -30, -40, -50],
];

export interface EngineConfig {
  depth: number;
  randomness: number; // 0-100, higher = more random
  aggression: number; // 0-100, affects position evaluation
}

export class ChessEngine {
  private config: EngineConfig;

  constructor(
    config: EngineConfig = { depth: 2, randomness: 30, aggression: 50 }
  ) {
    this.config = config;
  }

  // Evaluate the current position
  evaluatePosition(game: Chess): number {
    if (game.isCheckmate()) {
      return game.turn() === "w" ? -1000 : 1000;
    }

    if (game.isDraw()) {
      return 0;
    }

    let score = 0;
    const board = game.board();

    // Material and positional evaluation
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        const piece = board[i][j];
        if (piece) {
          const value = PIECE_VALUES[piece.type.toLowerCase()];
          const positionalBonus = this.getPositionalBonus(
            piece.type,
            i,
            j,
            piece.color
          );

          if (piece.color === "w") {
            score += value * 100 + positionalBonus;
          } else {
            score -= value * 100 + positionalBonus;
          }
        }
      }
    }

    // Mobility bonus
    const moves = game.moves().length;
    const mobilityBonus = moves * 2;
    score += game.turn() === "w" ? mobilityBonus : -mobilityBonus;

    // Center control bonus (based on aggression)
    const centerBonus =
      this.evaluateCenterControl(game) * (this.config.aggression / 50);
    score += centerBonus;

    return score;
  }

  private getPositionalBonus(
    pieceType: string,
    row: number,
    col: number,
    color: string
  ): number {
    const isWhite = color === "w";
    const r = isWhite ? row : 7 - row;

    switch (pieceType.toLowerCase()) {
      case "p":
        return PAWN_TABLE[r][col] / 10;
      case "n":
        return KNIGHT_TABLE[r][col] / 10;
      default:
        return 0;
    }
  }

  private evaluateCenterControl(game: Chess): number {
    let score = 0;
    const board = game.board();
    const centerSquares = [
      [3, 3],
      [3, 4],
      [4, 3],
      [4, 4], // d4, e4, d5, e5
      [2, 3],
      [2, 4],
      [3, 2],
      [3, 5],
      [4, 2],
      [4, 5],
      [5, 3],
      [5, 4], // extended center
    ];

    for (const [row, col] of centerSquares) {
      const piece = board[row][col];
      if (piece) {
        const bonus = [3, 3, 4, 4].some(
          (r) => r === row && [3, 4].includes(col)
        )
          ? 10
          : 5;
        score += piece.color === "w" ? bonus : -bonus;
      }
    }

    return score;
  }

  // Minimax with alpha-beta pruning
  private minimax(
    game: Chess,
    depth: number,
    alpha: number,
    beta: number,
    maximizingPlayer: boolean
  ): number {
    if (depth === 0 || game.isGameOver()) {
      return this.evaluatePosition(game);
    }

    const moves = game.moves({ verbose: true });

    if (maximizingPlayer) {
      let maxEval = -Infinity;
      for (const move of moves) {
        game.move(move);
        const eval_ = this.minimax(game, depth - 1, alpha, beta, false);
        game.undo();
        maxEval = Math.max(maxEval, eval_);
        alpha = Math.max(alpha, eval_);
        if (beta <= alpha) break;
      }
      return maxEval;
    } else {
      let minEval = Infinity;
      for (const move of moves) {
        game.move(move);
        const eval_ = this.minimax(game, depth - 1, alpha, beta, true);
        game.undo();
        minEval = Math.min(minEval, eval_);
        beta = Math.min(beta, eval_);
        if (beta <= alpha) break;
      }
      return minEval;
    }
  }

  // Get the best move for the current position
  getBestMove(game: Chess): Move | null {
    const moves = game.moves({ verbose: true });
    if (moves.length === 0) return null;

    const isWhite = game.turn() === "w";
    let bestMove = moves[0];
    let bestEval = isWhite ? -Infinity : Infinity;

    // Evaluate each move
    const moveEvaluations: { move: Move; eval: number }[] = [];

    for (const move of moves) {
      game.move(move);
      const eval_ = this.minimax(
        game,
        this.config.depth - 1,
        -Infinity,
        Infinity,
        !isWhite
      );
      game.undo();

      moveEvaluations.push({ move, eval: eval_ });

      if (isWhite) {
        if (eval_ > bestEval) {
          bestEval = eval_;
          bestMove = move;
        }
      } else {
        if (eval_ < bestEval) {
          bestEval = eval_;
          bestMove = move;
        }
      }
    }

    // Add randomness based on config
    if (
      this.config.randomness > 0 &&
      Math.random() * 100 < this.config.randomness
    ) {
      // Sort moves by evaluation
      moveEvaluations.sort((a, b) =>
        isWhite ? b.eval - a.eval : a.eval - b.eval
      );

      // Pick from top moves randomly
      const topMoves = moveEvaluations.slice(
        0,
        Math.max(3, Math.floor(moves.length / 3))
      );
      bestMove = topMoves[Math.floor(Math.random() * topMoves.length)].move;
    }

    return bestMove;
  }

  // Quick evaluation for display (centipawn score)
  getEvaluation(game: Chess): number {
    return this.evaluatePosition(game) / 100;
  }
}

// Predefined engine configurations
export const ENGINE_CONFIGS: Record<string, EngineConfig> = {
  stockfish: { depth: 3, randomness: 5, aggression: 60 },
  leela: { depth: 2, randomness: 15, aggression: 55 },
  komodo: { depth: 3, randomness: 10, aggression: 50 },
  fire: { depth: 2, randomness: 20, aggression: 70 },
};
