import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  ArrowLeft, 
  Users, 
  TrendingUp, 
  Award, 
  BarChart3,
  Clock,
  RefreshCw
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const mockResults = {
  head_prefect: {
    title: "HEAD PREFECT",
    candidates: [
      { name: "JOHN MUKISA", class: "P5-SUNRISE", votes: 234, percentage: 42.8 },
      { name: "SARAH NAMATOVU", class: "P4-EAGLETS", votes: 198, percentage: 36.2 },
      { name: "DAVID SSEKANJAKO", class: "P5-SKYHIGH", votes: 115, percentage: 21.0 }
    ],
    totalVotes: 547,
    totalEligible: 883
  },
  academic_prefect: {
    title: "ACADEMIC PREFECT", 
    candidates: [
      { name: "MARIA NAKYANZI", class: "P6-RADIANT", votes: 189, percentage: 45.3 },
      { name: "CALVIN MUWANGUZI", class: "P5-SUNSET", votes: 142, percentage: 34.1 },
      { name: "GRACE NAMULI", class: "P6-VIBRANT", votes: 86, percentage: 20.6 }
    ],
    totalVotes: 417,
    totalEligible: 629
  },
  head_monitors: {
    title: "HEAD MONITOR(ES)",
    candidates: [
      { name: "ELIJAH KIMULI", class: "P3-CRANES", votes: 156, percentage: 38.2 },
      { name: "ABIGAIL NAKATO", class: "P4-BUNNIES", votes: 134, percentage: 32.8 },
      { name: "JOSEPH MULANGIRA", class: "P3-PARROTS", votes: 118, percentage: 29.0 }
    ],
    totalVotes: 408,
    totalEligible: 741
  },
  welfare_prefect: {
    title: "WELFARE PREFECT (MESS PREFECT)",
    candidates: [
      { name: "PRECIOUS NAKUNGU", class: "P5-SUNRISE", votes: 167, percentage: 41.2 },
      { name: "JORDAN SSALI", class: "P4-EAGLETS", votes: 128, percentage: 31.6 },
      { name: "BLESSING NABIRYE", class: "P4-BUNNIES", votes: 110, percentage: 27.2 }
    ],
    totalVotes: 405,
    totalEligible: 572
  }
};

export default function LiveResults() {
  const navigate = useNavigate();
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      setLastUpdate(new Date());
    }, 1000);
  };

  const totalVotesCount = Object.values(mockResults).reduce((sum, position) => sum + position.totalVotes, 0);
  const averageParticipation = Object.values(mockResults).reduce((sum, position) => 
    sum + (position.totalVotes / position.totalEligible), 0) / Object.keys(mockResults).length * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/electoral')}
            className="mb-4 hover:bg-primary/10"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Electoral Dashboard
          </Button>
          
          <div className="space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-primary/80 to-secondary bg-clip-text text-transparent">
              Live Election Results
            </h1>
            <p className="text-muted-foreground">
              Real-time voting results • Last updated: {lastUpdate.toLocaleTimeString()}
            </p>
            <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">
              <Clock className="w-3 h-3 mr-1" />
              Voting in Progress
            </Badge>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-6 text-center">
              <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-800">{totalVotesCount}</div>
              <div className="text-sm text-blue-600">Total Votes Cast</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="p-6 text-center">
              <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-800">{averageParticipation.toFixed(1)}%</div>
              <div className="text-sm text-green-600">Average Participation</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="p-6 text-center">
              <Award className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-purple-800">{Object.keys(mockResults).length}</div>
              <div className="text-sm text-purple-600">Active Positions</div>
            </CardContent>
          </Card>
        </div>

        {/* Refresh Button */}
        <div className="flex justify-center">
          <Button 
            onClick={handleRefresh} 
            disabled={refreshing}
            className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Refreshing...' : 'Refresh Results'}
          </Button>
        </div>

        {/* Results by Position */}
        <div className="space-y-8">
          <h2 className="text-2xl font-bold text-center">Results by Position</h2>
          
          {Object.entries(mockResults).map(([key, position]) => (
            <Card key={key} className="overflow-hidden hover:shadow-lg transition-shadow">
              <CardHeader className="bg-gradient-to-r from-muted/50 to-muted/30 pb-4">
                <CardTitle className="flex items-center justify-between">
                  <span className="text-xl">{position.title}</span>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <BarChart3 className="w-4 h-4" />
                    <span>{position.totalVotes} / {position.totalEligible} voted</span>
                    <Badge variant="outline">
                      {((position.totalVotes / position.totalEligible) * 100).toFixed(1)}% turnout
                    </Badge>
                  </div>
                </CardTitle>
              </CardHeader>
              
              <CardContent className="p-6 space-y-4">
                {position.candidates.map((candidate, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-semibold text-lg">{candidate.name}</div>
                        <div className="text-sm text-muted-foreground">{candidate.class}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-primary">{candidate.votes}</div>
                        <div className="text-sm font-medium text-muted-foreground">
                          {candidate.percentage.toFixed(1)}%
                        </div>
                      </div>
                    </div>
                    
                    <Progress 
                      value={candidate.percentage} 
                      className="h-3"
                      style={{
                        '--progress-background': index === 0 ? 'hsl(var(--primary))' : 
                                               index === 1 ? 'hsl(var(--secondary))' : 
                                               'hsl(var(--muted-foreground))'
                      } as any}
                    />
                    
                    {index === 0 && (
                      <Badge className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-yellow-900 border-yellow-300">
                        <Award className="w-3 h-3 mr-1" />
                        Leading
                      </Badge>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Footer */}
        <Card className="bg-gradient-to-r from-muted/20 to-muted/10">
          <CardContent className="p-6 text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              Results are updated in real-time as votes are cast. Final results will be announced after voting closes.
            </p>
            <p className="text-xs text-muted-foreground">
              Voting Period: Monday 9th September - Friday 20th September 2025
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}