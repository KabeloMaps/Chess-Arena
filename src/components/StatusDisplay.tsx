import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { CheckCircle2, Clock, Trophy, Settings } from "lucide-react";
import type { Chess } from "chess.js";
import type { Engine, GameStatus } from "../App";

interface StatusDisplayProps {
  game: Chess;
  gameStatus: GameStatus;
  moveNumber: number;
  currentEngine: Engine;
}

export function StatusDisplay({
  game,
  gameStatus,
  moveNumber,
  currentEngine,
}: StatusDisplayProps) {
  const getStatusInfo = () => {
    if (game.isCheckmate()) {
      return {
        icon: Trophy,
        label: "Checkmate",
        variant: "default" as const,
        color: "text-green-600 dark:text-green-400",
      };
    }
    if (game.isDraw()) {
      return {
        icon: CheckCircle2,
        label: "Draw",
        variant: "secondary" as const,
        color: "text-blue-600 dark:text-blue-400",
      };
    }
    if (gameStatus === "setup") {
      return {
        icon: Settings,
        label: "Setup",
        variant: "outline" as const,
        color: "text-slate-600 dark:text-slate-400",
      };
    }
    if (gameStatus === "paused") {
      return {
        icon: Clock,
        label: "Paused",
        variant: "secondary" as const,
        color: "text-orange-600 dark:text-orange-400",
      };
    }
    if (gameStatus === "playing") {
      return {
        icon: Clock,
        label: "In Progress",
        variant: "default" as const,
        color: "text-green-600 dark:text-green-400",
      };
    }
    return {
      icon: CheckCircle2,
      label: "Finished",
      variant: "secondary" as const,
      color: "text-slate-600 dark:text-slate-400",
    };
  };

  const statusInfo = getStatusInfo();
  const StatusIcon = statusInfo.icon;
  const turn = game.turn() === "w" ? "White" : "Black";

  return (
    <Card>
      <CardHeader>
        <CardTitle>Game Status</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-600 dark:text-slate-400">
              Status
            </span>
            <Badge variant={statusInfo.variant} className="gap-1">
              <StatusIcon className="size-3" />
              {statusInfo.label}
            </Badge>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-600 dark:text-slate-400">
              Move
            </span>
            <span>{moveNumber}</span>
          </div>

          {!game.isGameOver() && (
            <>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600 dark:text-slate-400">
                  To Move
                </span>
                <Badge variant="outline">{turn}</Badge>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600 dark:text-slate-400">
                  Engine
                </span>
                <span className="text-sm">{currentEngine.name}</span>
              </div>
            </>
          )}

          {game.isCheck() && !game.isCheckmate() && (
            <div className="flex items-center justify-center p-2 bg-red-100 dark:bg-red-900/20 rounded-md">
              <span className="text-sm text-red-700 dark:text-red-400">
                Check!
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
