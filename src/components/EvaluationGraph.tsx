import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { Badge } from "./ui/badge";

interface EvaluationGraphProps {
  evaluations: number[];
}

export function EvaluationGraph({ evaluations }: EvaluationGraphProps) {
  const data = evaluations.map((eval_, index) => ({
    move: index + 1,
    evaluation: eval_,
  }));

  const currentEval = evaluations[evaluations.length - 1] || 0;
  const evalText =
    currentEval > 0 ? `+${currentEval.toFixed(1)}` : currentEval.toFixed(1);

  const getEvalColor = (eval_: number) => {
    if (eval_ > 2) return "text-green-600 dark:text-green-400";
    if (eval_ > 0.5) return "text-green-700 dark:text-green-500";
    if (eval_ < -2) return "text-red-600 dark:text-red-400";
    if (eval_ < -0.5) return "text-red-700 dark:text-red-500";
    return "text-slate-600 dark:text-slate-400";
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Position Evaluation</CardTitle>
            <CardDescription>Engine assessment over time</CardDescription>
          </div>
          {evaluations.length > 0 && (
            <Badge variant="outline" className={getEvalColor(currentEval)}>
              {evalText}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {evaluations.length === 0 ? (
          <div className="text-center py-12 text-slate-500 dark:text-slate-400">
            <p className="text-sm">No evaluation data yet</p>
            <p className="text-xs mt-1">
              Start the game to see the evaluation graph
            </p>
          </div>
        ) : (
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={data}
                margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  className="stroke-slate-200 dark:stroke-slate-700"
                />
                <XAxis
                  dataKey="move"
                  className="text-xs"
                  tick={{ fill: "currentColor" }}
                  label={{
                    value: "Move",
                    position: "insideBottom",
                    offset: -5,
                    className: "text-xs fill-slate-600 dark:fill-slate-400",
                  }}
                />
                <YAxis
                  className="text-xs"
                  tick={{ fill: "currentColor" }}
                  domain={[-5, 5]}
                  label={{
                    value: "Eval",
                    angle: -90,
                    position: "insideLeft",
                    className: "text-xs fill-slate-600 dark:fill-slate-400",
                  }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--background))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "6px",
                  }}
                  formatter={(value: number) => [
                    value > 0 ? `+${value.toFixed(2)}` : value.toFixed(2),
                    "Evaluation",
                  ]}
                  labelFormatter={(label) => `Move ${label}`}
                />
                <ReferenceLine
                  y={0}
                  stroke="hsl(var(--border))"
                  strokeDasharray="3 3"
                />
                <Line
                  type="monotone"
                  dataKey="evaluation"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        <div className="mt-4 pt-4 border-t space-y-2">
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-slate-600 dark:text-slate-400">
                White Advantage:{" "}
              </span>
              <span className="text-green-600 dark:text-green-400">
                +1.0 or more
              </span>
            </div>
            <div>
              <span className="text-slate-600 dark:text-slate-400">
                Black Advantage:{" "}
              </span>
              <span className="text-red-600 dark:text-red-400">
                -1.0 or less
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
