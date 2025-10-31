import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Label } from "./ui/label";
import { Slider } from "./ui/slider";
import { useState } from "react";
import type { Engine } from "../App";

interface EngineSelectorProps {
  whiteEngine: Engine;
  blackEngine: Engine;
  availableEngines: Engine[];
  onWhiteEngineChange: (engine: Engine) => void;
  onBlackEngineChange: (engine: Engine) => void;
  disabled?: boolean;
}

export function EngineSelector({
  whiteEngine,
  blackEngine,
  availableEngines,
  onWhiteEngineChange,
  onBlackEngineChange,
  disabled = false,
}: EngineSelectorProps) {
  const [whiteDifficulty, setWhiteDifficulty] = useState(50);
  const [blackDifficulty, setBlackDifficulty] = useState(50);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Engine Selection</CardTitle>
        <CardDescription>Choose engines for both sides</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* White Engine */}
        <div className="space-y-3 p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50 border-2 border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-2 mb-2">
            <div className="size-3 rounded-full bg-white border-2 border-slate-800" />
            <Label>White</Label>
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="white-engine"
              className="text-xs text-slate-600 dark:text-slate-400"
            >
              Engine
            </Label>
            <Select
              value={whiteEngine.id}
              onValueChange={(value) => {
                const engine = availableEngines.find((e) => e.id === value);
                if (engine) onWhiteEngineChange(engine);
              }}
              disabled={disabled}
            >
              <SelectTrigger id="white-engine">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {availableEngines.map((engine) => (
                  <SelectItem key={engine.id} value={engine.id}>
                    {engine.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <Label
                htmlFor="white-difficulty"
                className="text-xs text-slate-600 dark:text-slate-400"
              >
                Strength
              </Label>
              <span className="text-xs">{whiteDifficulty}%</span>
            </div>
            <Slider
              id="white-difficulty"
              value={[whiteDifficulty]}
              onValueChange={(value) => setWhiteDifficulty(value[0])}
              min={0}
              max={100}
              step={10}
              disabled={disabled}
            />
          </div>
        </div>

        {/* Black Engine */}
        <div className="space-y-3 p-4 rounded-lg bg-slate-800 dark:bg-slate-900/50 border-2 border-slate-700 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-2">
            <div className="size-3 rounded-full bg-slate-900 border-2 border-slate-200" />
            <Label className="text-white">Black</Label>
          </div>

          <div className="space-y-2">
            <Label htmlFor="black-engine" className="text-xs text-slate-400">
              Engine
            </Label>
            <Select
              value={blackEngine.id}
              onValueChange={(value) => {
                const engine = availableEngines.find((e) => e.id === value);
                if (engine) onBlackEngineChange(engine);
              }}
              disabled={disabled}
            >
              <SelectTrigger id="black-engine">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {availableEngines.map((engine) => (
                  <SelectItem key={engine.id} value={engine.id}>
                    {engine.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <Label
                htmlFor="black-difficulty"
                className="text-xs text-slate-400"
              >
                Strength
              </Label>
              <span className="text-xs text-slate-300">{blackDifficulty}%</span>
            </div>
            <Slider
              id="black-difficulty"
              value={[blackDifficulty]}
              onValueChange={(value) => setBlackDifficulty(value[0])}
              min={0}
              max={100}
              step={10}
              disabled={disabled}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
