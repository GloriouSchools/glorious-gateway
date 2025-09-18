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
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { DashboardLayout } from "@/components/layout/DashboardLayout";

interface ResultCandidate {
  name: string;
  class: string;
  votes: number;
  percentage: number;
}

interface PositionResult {
  title: string;
  candidates: ResultCandidate[];
  totalVotes: number;
  totalEligible: number;
}

export default function LiveResults() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, userRole, userName, photoUrl, signOut } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [results, setResults] = useState<Record<string, PositionResult>>({});
  const [loading, setLoading] = useState(true);

  const loadResults = async () => {
    try {
      setLoading(true);
      
      // Load positions
      const { data: positions, error: positionsError } = await supabase
        .from('electoral_positions')
        .select('*')
        .eq('is_active', true);
      
      if (positionsError) throw positionsError;
      
      // For now, use dummy data until database types are synced
      // TODO: Replace with actual database queries once electoral_votes table is in TypeScript types
      const votes = [
        { position: 'head_prefect', candidate_id: 'candidate1', electoral_applications: { student_name: 'John Doe', class_name: 'P7', stream_name: 'A' } },
        { position: 'head_prefect', candidate_id: 'candidate2', electoral_applications: { student_name: 'Jane Smith', class_name: 'P6', stream_name: 'B' } },
      ];
      
      // Count total eligible voters (exclude P1 students - they cannot vote)
      const { data: eligibleStudents } = await supabase
        .from('students')
        .select('id', { count: 'exact' })
        .neq('class_id', 'P1'); // Exclude P1 students
      
      const totalEligible = eligibleStudents?.length || 0;
      
      // Calculate results for each position
      const calculatedResults: Record<string, PositionResult> = {};
      
      positions?.forEach(position => {
        const positionVotes = votes?.filter(vote => vote.position === position.id) || [];
        const voteCounts: Record<string, { count: number; candidateInfo: any }> = {};
        
        // Count votes per candidate
        positionVotes.forEach(vote => {
          if (!voteCounts[vote.candidate_id]) {
            voteCounts[vote.candidate_id] = {
              count: 0,
              candidateInfo: vote.electoral_applications
            };
          }
          voteCounts[vote.candidate_id].count++;
        });
        
        const totalPositionVotes = positionVotes.length;
        
        // Create candidate results sorted by vote count
        const candidates: ResultCandidate[] = Object.entries(voteCounts)
          .map(([candidateId, data]) => ({
            name: data.candidateInfo?.student_name || 'Unknown',
            class: `${data.candidateInfo?.class_name || ''}-${data.candidateInfo?.stream_name || ''}`,
            votes: data.count,
            percentage: totalPositionVotes > 0 ? (data.count / totalPositionVotes) * 100 : 0
          }))
          .sort((a, b) => b.votes - a.votes);
        
        calculatedResults[position.id] = {
          title: position.title,
          candidates,
          totalVotes: totalPositionVotes,
          totalEligible
        };
      });
      
      setResults(calculatedResults);
      setLastUpdate(new Date());
      
    } catch (error) {
      console.error('Error loading results:', error);
      toast({
        title: "Error",
        description: "Failed to load election results",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadResults();
    setRefreshing(false);
  };

  useEffect(() => {
    loadResults();
  }, []);

  const totalVotesCount = Object.values(results).reduce((sum, position) => sum + position.totalVotes, 0);
  const averageParticipation = Object.keys(results).length > 0 ? 
    Object.values(results).reduce((sum, position) => 
      sum + (position.totalVotes / position.totalEligible), 0) / Object.keys(results).length * 100 : 0;

  if (!user || !userRole) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-muted-foreground mb-4">Please log in to view election results.</p>
          <Button onClick={() => navigate('/login')}>Login</Button>
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout 
      userRole={userRole} 
      userName={userName} 
      photoUrl={photoUrl} 
      onLogout={signOut}
    >
      <div className="space-y-8">
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
            <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800">
              <Clock className="w-3 h-3 mr-1" />
              Voting in Progress
            </Badge>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/50 dark:to-blue-900/30 border-blue-200 dark:border-blue-800">
            <CardContent className="p-6 text-center">
              <Users className="w-8 h-8 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-800 dark:text-blue-300">{totalVotesCount}</div>
              <div className="text-sm text-blue-600 dark:text-blue-400">Total Votes Cast</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/50 dark:to-green-900/30 border-green-200 dark:border-green-800">
            <CardContent className="p-6 text-center">
              <TrendingUp className="w-8 h-8 text-green-600 dark:text-green-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-800 dark:text-green-300">{averageParticipation.toFixed(1)}%</div>
              <div className="text-sm text-green-600 dark:text-green-400">Average Participation</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/50 dark:to-purple-900/30 border-purple-200 dark:border-purple-800">
            <CardContent className="p-6 text-center">
              <Award className="w-8 h-8 text-purple-600 dark:text-purple-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-purple-800 dark:text-purple-300">{Object.keys(results).length}</div>
              <div className="text-sm text-purple-600 dark:text-purple-400">Active Positions</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950/50 dark:to-orange-900/30 border-orange-200 dark:border-orange-800">
            <CardContent className="p-6 text-center">
              <Users className="w-8 h-8 text-orange-600 dark:text-orange-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-orange-800 dark:text-orange-300">
                {Object.keys(results).length > 0 ? Object.values(results)[0].totalEligible : 0}
              </div>
              <div className="text-sm text-orange-600 dark:text-orange-400">Eligible Voters</div>
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
          
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading results...</p>
            </div>
          ) : Object.keys(results).length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No Results Available</h3>
              <p className="text-muted-foreground">No votes have been cast yet or no positions are active.</p>
            </div>
          ) : (
            Object.entries(results).map(([key, position]) => (
            <Card key={key} className="overflow-hidden hover:shadow-lg transition-all duration-200 hover:shadow-primary/5">
              <CardHeader className="bg-gradient-to-r from-muted/50 to-muted/30 pb-4">
                <CardTitle className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                  <span className="text-xl font-semibold">{position.title}</span>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <BarChart3 className="w-4 h-4" />
                    <span>{position.totalVotes} / {position.totalEligible} voted</span>
                    <Badge variant="outline" className="hidden sm:inline-flex">
                      {position.totalEligible > 0 ? ((position.totalVotes / position.totalEligible) * 100).toFixed(1) : '0'}% turnout
                    </Badge>
                  </div>
                </CardTitle>
                <Badge variant="outline" className="sm:hidden w-fit">
                  {position.totalEligible > 0 ? ((position.totalVotes / position.totalEligible) * 100).toFixed(1) : '0'}% turnout
                </Badge>
              </CardHeader>
              
              <CardContent className="p-6 space-y-4">
                {position.candidates.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Award className="h-8 w-8 mx-auto mb-2" />
                    <p>No candidates have received votes yet</p>
                  </div>
                ) : (
                  position.candidates.map((candidate, index) => (
                    <div key={index} className="space-y-3 p-4 rounded-lg border bg-card/50">
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
                      />
                      
                      {index === 0 && (
                        <Badge className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-yellow-900 border-yellow-300 dark:from-yellow-600 dark:to-yellow-700 dark:text-yellow-100">
                          <Award className="w-3 h-3 mr-1" />
                          Currently Leading
                        </Badge>
                      )}
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          )))}
        </div>

        {/* Footer Information */}
        <Card className="bg-gradient-to-r from-muted/20 to-muted/10">
          <CardContent className="p-6 text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              Results are updated in real-time as votes are cast. Final results will be announced after voting closes.
            </p>
            <p className="text-xs text-muted-foreground">
              Voting Period: Monday 9th September - Friday 20th September 2025
            </p>
            <p className="text-xs text-muted-foreground">
              Only students from P2-P7 are eligible to vote. P1 students are excluded from the voting process.
            </p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}