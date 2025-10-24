import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

interface TimelineData {
  time: string;
  votes: number;
}

interface TimelineChartProps {
  data: TimelineData[];
}

export function TimelineChart({ data }: TimelineChartProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ 
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
    >
      <Card className="rounded-xl border-0 shadow-lg">
        <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Voting Activity Timeline</CardTitle>
          <Badge variant="outline" className="border-green-500 text-green-600 gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            LIVE
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorVotes" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(221 83% 53%)" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="hsl(221 83% 53%)" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
            <XAxis 
              dataKey="time" 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
            />
            <YAxis 
              stroke="hsl(var(--muted-foreground))" 
              fontSize={12}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: "hsl(var(--background))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "0.5rem",
                fontSize: "12px"
              }}
            />
            <Area 
              type="monotone" 
              dataKey="votes" 
              stroke="hsl(221 83% 53%)" 
              strokeWidth={2}
              fill="url(#colorVotes)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
    </motion.div>
  );
}
