import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Slider } from "./ui/slider";
import {
  Play,
  Pause,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import type { GameStatus } from "../App";

interface GameControlsProps {
  gameStatus: GameStatus;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  onStepForward: () => void;
  onStepBackward: () => void;
  autoPlaySpeed: number;
  onSpeedChange: (speed: number) => void;
  canStepBack: boolean;
}

export function GameControls({
  gameStatus,
  onStart,
  onPause,
  onReset,
  onStepForward,
  onStepBackward,
  autoPlaySpeed,
  onSpeedChange,
  canStepBack,
}: GameControlsProps) {
  const speedToLabel = (speed: number): string => {
    if (speed <= 500) return "Fast";
    if (speed <= 1000) return "Normal";
    if (speed <= 2000) return "Slow";
    return "Very Slow";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Game Controls</CardTitle>
        <CardDescription>Control match playback</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Primary Controls */}
        <div className="flex gap-2">
          {gameStatus === "playing" ? (
            <Button onClick={onPause} className="flex-1">
              <Pause className="size-4 mr-2" />
              Pause
            </Button>
          ) : (
            <Button onClick={onStart} className="flex-1">
              <Play className="size-4 mr-2" />
              {gameStatus === "setup" ? "Start" : "Resume"}
            </Button>
          )}

          <Button onClick={onReset} variant="outline">
            <RotateCcw className="size-4" />
          </Button>
        </div>

        {/* Step Controls */}
        <div className="flex gap-2">
          <Button
            onClick={onStepBackward}
            variant="outline"
            className="flex-1"
            disabled={!canStepBack}
          >
            <ChevronLeft className="size-4 mr-2" />
            Step Back
          </Button>
          <Button
            onClick={onStepForward}
            variant="outline"
            className="flex-1"
            disabled={gameStatus === "finished"}
          >
            Step Forward
            <ChevronRight className="size-4 ml-2" />
          </Button>
        </div>

        {/* Speed Control */}
        <div className="space-y-2 pt-2">
          <div className="flex justify-between">
            <Label htmlFor="speed" className="text-xs">
              Playback Speed
            </Label>
            <span className="text-xs">{speedToLabel(autoPlaySpeed)}</span>
          </div>
          <Slider
            id="speed"
            value={[autoPlaySpeed]}
            onValueChange={(value) => onSpeedChange(value[0])}
            min={300}
            max={3000}
            step={100}
          />
        </div>
      </CardContent>
    </Card>
  );
}
