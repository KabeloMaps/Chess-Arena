import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Slider } from "./ui/slider";
import { Label } from "./ui/label";
import { Play, Pause, SkipBack, SkipForward, RotateCcw } from "lucide-react";
import { Badge } from "./ui/badge";

interface ReplayControlsProps {
  isPlaying: boolean;
  currentMove: number;
  totalMoves: number;
  speed: number;
  onPlay: () => void;
  onPause: () => void;
  onReset: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onSeek: (move: number) => void;
  onSpeedChange: (speed: number) => void;
}

export function ReplayControls({
  isPlaying,
  currentMove,
  totalMoves,
  speed,
  onPlay,
  onPause,
  onReset,
  onNext,
  onPrevious,
  onSeek,
  onSpeedChange,
}: ReplayControlsProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Replay Mode</CardTitle>
            <CardDescription>Review the completed game</CardDescription>
          </div>
          <Badge variant="secondary">
            {currentMove} / {totalMoves}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Timeline Slider */}
        <div className="space-y-2">
          <Label>Position</Label>
          <Slider
            value={[currentMove]}
            onValueChange={(value) => onSeek(value[0])}
            min={0}
            max={totalMoves}
            step={1}
            className="w-full"
          />
        </div>

        {/* Playback Controls */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onPrevious}
            disabled={currentMove === 0}
          >
            <SkipBack className="size-4" />
          </Button>

          {isPlaying ? (
            <Button onClick={onPause} className="flex-1">
              <Pause className="size-4 mr-2" />
              Pause
            </Button>
          ) : (
            <Button
              onClick={onPlay}
              className="flex-1"
              disabled={currentMove >= totalMoves}
            >
              <Play className="size-4 mr-2" />
              Play
            </Button>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={onNext}
            disabled={currentMove >= totalMoves}
          >
            <SkipForward className="size-4" />
          </Button>
        </div>

        <Button variant="outline" onClick={onReset} className="w-full">
          <RotateCcw className="size-4 mr-2" />
          Reset to Start
        </Button>

        {/* Speed Control */}
        <div className="space-y-2 pt-2 border-t">
          <div className="flex justify-between">
            <Label htmlFor="replay-speed" className="text-xs">
              Replay Speed
            </Label>
            <span className="text-xs">{speed}ms</span>
          </div>
          <Slider
            id="replay-speed"
            value={[speed]}
            onValueChange={(value) => onSpeedChange(value[0])}
            min={200}
            max={2000}
            step={100}
          />
        </div>
      </CardContent>
    </Card>
  );
}
