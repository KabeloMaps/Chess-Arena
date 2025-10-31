import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";
import { Moon, Sun, Volume2, VolumeX } from "lucide-react";
import { Button } from "./ui/button";

interface SettingsPanelProps {
  soundEnabled: boolean;
  onSoundToggle: (enabled: boolean) => void;
  theme: "light" | "dark";
  onThemeToggle: () => void;
}

export function SettingsPanel({
  soundEnabled,
  onSoundToggle,
  theme,
  onThemeToggle,
}: SettingsPanelProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Settings</CardTitle>
        <CardDescription>Customize your experience</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {soundEnabled ? (
              <Volume2 className="size-4 text-slate-600 dark:text-slate-400" />
            ) : (
              <VolumeX className="size-4 text-slate-600 dark:text-slate-400" />
            )}
            <Label htmlFor="sound-toggle" className="cursor-pointer">
              Sound Effects
            </Label>
          </div>
          <Switch
            id="sound-toggle"
            checked={soundEnabled}
            onCheckedChange={onSoundToggle}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {theme === "dark" ? (
              <Moon className="size-4 text-slate-600 dark:text-slate-400" />
            ) : (
              <Sun className="size-4 text-slate-600 dark:text-slate-400" />
            )}
            <Label>Theme</Label>
          </div>
          <Button variant="outline" size="sm" onClick={onThemeToggle}>
            {theme === "dark" ? "Dark" : "Light"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
