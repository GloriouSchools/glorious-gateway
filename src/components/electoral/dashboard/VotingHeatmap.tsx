import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface HeatmapData {
  hour: number;
  votes: number;
}

interface VotingHeatmapProps {
  data: HeatmapData[];
}

export function VotingHeatmap({ data }: VotingHeatmapProps) {
  const maxVotes = Math.max(...data.map(d => d.votes), 1);

  const getIntensity = (votes: number) => {
    const percentage = (votes / maxVotes) * 100;
    if (percentage === 0) return "bg-slate-100 dark:bg-slate-800";
    if (percentage < 25) return "bg-blue-200 dark:bg-blue-900";
    if (percentage < 50) return "bg-blue-400 dark:bg-blue-700";
    if (percentage < 75) return "bg-blue-600 dark:bg-blue-500";
    return "bg-blue-800 dark:bg-blue-400";
  };

  return (
    <Card className="rounded-xl border-0 shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Voting Activity Heatmap</CardTitle>
          <span className="text-xs text-muted-foreground">24-hour view</span>
        </div>
      </CardHeader>
      <CardContent>
        <TooltipProvider>
          <div className="flex gap-1 h-20">
            {data.map((item) => (
              <Tooltip key={item.hour}>
                <TooltipTrigger asChild>
                  <div
                    className={cn(
                      "flex-1 rounded-sm transition-all cursor-pointer hover:scale-y-110 hover:shadow-md",
                      getIntensity(item.votes)
                    )}
                  />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="font-semibold">{String(item.hour).padStart(2, '0')}:00</p>
                  <p className="text-xs">{item.votes} votes</p>
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
        </TooltipProvider>
        <div className="flex justify-between mt-3 text-xs text-muted-foreground font-medium">
          <span>00:00</span>
          <span>06:00</span>
          <span>12:00</span>
          <span>18:00</span>
          <span>23:59</span>
        </div>
        <div className="flex items-center justify-center gap-4 mt-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-slate-100 dark:bg-slate-800 border" />
            <span className="text-muted-foreground">No activity</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-blue-400 dark:bg-blue-700" />
            <span className="text-muted-foreground">Moderate</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-blue-800 dark:bg-blue-400" />
            <span className="text-muted-foreground">High activity</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
