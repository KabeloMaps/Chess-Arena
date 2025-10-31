import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { ScrollArea } from "./ui/scroll-area";
import { Badge } from "./ui/badge";

interface MoveHistoryProps {
  moves: string[];
  currentMoveIndex: number;
}

export function MoveHistory({ moves, currentMoveIndex }: MoveHistoryProps) {
  const movePairs: { moveNumber: number; white: string; black?: string }[] = [];

  for (let i = 0; i < moves.length; i += 2) {
    movePairs.push({
      moveNumber: Math.floor(i / 2) + 1,
      white: moves[i],
      black: moves[i + 1],
    });
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Move History</CardTitle>
          <Badge variant="secondary">
            {moves.length} {moves.length === 1 ? "move" : "moves"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[500px] pr-4">
          {movePairs.length === 0 ? (
            <div className="text-center py-8 text-slate-500 dark:text-slate-400">
              <p className="text-sm">No moves yet</p>
              <p className="text-xs mt-1">Start the game to see moves here</p>
            </div>
          ) : (
            <div className="space-y-1">
              {movePairs.map((pair, index) => (
                <div
                  key={index}
                  className="grid grid-cols-[auto_1fr_1fr] gap-3 p-2 rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <span className="text-sm text-slate-500 dark:text-slate-400 tabular-nums">
                    {pair.moveNumber}.
                  </span>
                  <span className="text-sm font-mono">{pair.white}</span>
                  {pair.black && (
                    <span className="text-sm font-mono">{pair.black}</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
