import { useState } from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Alert, AlertDescription } from "./ui/alert";
import { CheckCircle2, XCircle } from "lucide-react";
import { toast } from "sonner";

interface PositionEditorProps {
  currentFen: string;
  onApplyPosition: (fen: string) => void;
}

const STARTING_POSITION =
  "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
const COMMON_POSITIONS = [
  {
    name: "Starting Position",
    fen: STARTING_POSITION,
  },
  {
    name: "Sicilian Defense",
    fen: "rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR w KQkq c6 0 2",
  },
  {
    name: "French Defense",
    fen: "rnbqkbnr/pppp1ppp/4p3/8/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2",
  },
  {
    name: "Queen's Gambit",
    fen: "rnbqkbnr/ppp1pppp/8/3p4/2PP4/8/PP2PPPP/RNBQKBNR b KQkq c3 0 2",
  },
  {
    name: "Endgame Practice (K+Q vs K)",
    fen: "4k3/8/8/8/8/8/8/4K2Q w - - 0 1",
  },
];

export function PositionEditor({
  currentFen,
  onApplyPosition,
}: PositionEditorProps) {
  const [fenInput, setFenInput] = useState(currentFen);
  const [isValid, setIsValid] = useState(true);

  const validateFen = (fen: string): boolean => {
    try {
      // Basic FEN validation
      const parts = fen.trim().split(" ");
      if (parts.length < 4) return false;

      const rows = parts[0].split("/");
      if (rows.length !== 8) return false;

      for (const row of rows) {
        let count = 0;
        for (const char of row) {
          if (char >= "1" && char <= "8") {
            count += parseInt(char);
          } else if ("prnbqkPRNBQK".includes(char)) {
            count += 1;
          } else {
            return false;
          }
        }
        if (count !== 8) return false;
      }

      return true;
    } catch {
      return false;
    }
  };

  const handleFenChange = (value: string) => {
    setFenInput(value);
    setIsValid(validateFen(value));
  };

  const handleApply = () => {
    if (isValid) {
      onApplyPosition(fenInput);
      toast.success("Position applied successfully");
    } else {
      toast.error("Invalid FEN notation");
    }
  };

  const handleLoadPosition = (fen: string) => {
    setFenInput(fen);
    setIsValid(true);
    onApplyPosition(fen);
    toast.success("Position loaded");
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="fen-input">FEN Notation</Label>
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Input
              id="fen-input"
              value={fenInput}
              onChange={(e) => handleFenChange(e.target.value)}
              placeholder="Enter FEN notation..."
              className={`font-mono text-sm pr-10 ${
                !isValid ? "border-red-500 focus-visible:ring-red-500" : ""
              }`}
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              {isValid ? (
                <CheckCircle2 className="size-4 text-green-500" />
              ) : (
                <XCircle className="size-4 text-red-500" />
              )}
            </div>
          </div>
        </div>

        {!isValid && (
          <Alert variant="destructive">
            <AlertDescription className="text-sm">
              Invalid FEN notation. Please check your input.
            </AlertDescription>
          </Alert>
        )}
      </div>

      <div className="flex gap-2">
        <Button onClick={handleApply} disabled={!isValid} className="flex-1">
          Apply Position
        </Button>
        <Button
          onClick={() => handleLoadPosition(STARTING_POSITION)}
          variant="outline"
        >
          Reset
        </Button>
      </div>

      <div className="space-y-2">
        <Label>Common Positions</Label>
        <div className="space-y-2">
          {COMMON_POSITIONS.map((position) => (
            <Button
              key={position.name}
              onClick={() => handleLoadPosition(position.fen)}
              variant="outline"
              className="w-full justify-start text-sm"
              size="sm"
            >
              {position.name}
            </Button>
          ))}
        </div>
      </div>

      <div className="space-y-2 pt-4 border-t">
        <Label>Instructions</Label>
        <div className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
          <p>• Enter a valid FEN string to set up a custom position</p>
          <p>• Use the common positions above as starting points</p>
          <p>• Click "Apply Position" to load the position on the board</p>
          <p>• Switch back to "Game View" tab to see the position</p>
        </div>
      </div>
    </div>
  );
}
