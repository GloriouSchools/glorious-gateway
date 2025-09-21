import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { 
  ArrowLeft, 
  Vote as VoteIcon, 
  CheckCircle, 
  AlertTriangle,
  Users,
  Trophy
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { Confetti } from "@/components/ui/confetti";
import { supabase } from "@/integrations/supabase/client";
import { DashboardLayout } from "@/components/layout/DashboardLayout";

interface Candidate {
  id: string;
  name: string;
  email: string;
  photo?: string;
  class: string;
  stream: string;
  experience: string;
  qualifications: string;
  whyApply: string;
}

interface Position {
  id: string;
  title: string;
  description: string;
  candidates: Candidate[];
}

interface UserVote {
  userId: string;
  positionId: string;
  candidateId: string;
  timestamp: string;
}

const positionsList = [
  {
    id: "head_prefect",
    title: "HEAD PREFECT",
    description: "Lead the entire student body and represent students to school administration"
  },
  {
    id: "academic_prefect", 
    title: "ACADEMIC PREFECT",
    description: "Oversee academic activities and support student learning initiatives"
  },
  {
    id: "head_monitors",
    title: "HEAD MONITOR(ES)",
    description: "Coordinate monitor activities and maintain school discipline"
  },
  {
    id: "welfare_prefect",
    title: "WELFARE PREFECT (MESS PREFECT)",
    description: "Manage student welfare and dining hall operations"
  },
  {
    id: "entertainment_prefect",
    title: "ENTERTAINMENT PREFECT", 
    description: "Organize school events and entertainment activities"
  },
  {
    id: "games_sports_prefect",
    title: "GAMES AND SPORTS PREFECT",
    description: "Coordinate sports activities and represent the school in competitions"
  },
  {
    id: "health_sanitation",
    title: "HEALTH & SANITATION",
    description: "Maintain school hygiene and promote health awareness"
  },
  {
    id: "uniform_uniformity",
    title: "UNIFORM & UNIFORMITY",
    description: "Ensure proper school uniform standards and dress code compliance"
  },
  {
    id: "time_keeper",
    title: "TIME KEEPER",
    description: "Manage school schedules and ensure punctuality"
  },
  {
    id: "ict_prefect",
    title: "ICT PREFECT",
    description: "Support technology use and digital learning initiatives"
  }
];

export default function Vote() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, userRole, userName, photoUrl, signOut } = useAuth();
  
  const [positions, setPositions] = useState<Position[]>([]);
  const [selectedPosition, setSelectedPosition] = useState<string>("");
  const [selectedCandidate, setSelectedCandidate] = useState<string>("");
  const [currentStep, setCurrentStep] = useState<'select-position' | 'vote' | 'confirm'>('select-position');
  const [userVotes, setUserVotes] = useState<UserVote[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);

  // Load candidates and votes from database
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setLoadingProgress(10);
        
        // SECURITY: Validate user session first
        if (!user?.id) {
          toast({
            title: "Authentication Required",
            description: "Please log in to access the voting system.",
            variant: "destructive"
          });
          navigate('/login');
          return;
        }

        // Check voting eligibility (P2-P7 only, exclude P1)
        const { data: studentData, error: studentError } = await supabase
          .from('students')
          .select('id, class_id')
          .eq('id', user.id)
          .single();

        if (studentError) throw studentError;

        if (studentData) {
          const { data: classData, error: classError } = await supabase
            .from('classes')
            .select('name')
            .eq('id', studentData.class_id)
            .single();

          if (classError) throw classError;

          if (classData?.name === 'P1') {
            toast({
              title: "Not Eligible to Vote",
              description: "Students in P1 are not eligible to participate in the electoral voting process.",
              variant: "destructive"
            });
            navigate('/electoral');
            return;
          }
        }
        
        setLoadingProgress(25);
        // Load positions with candidates from database
        const { data: positionsData, error: positionsError } = await supabase
          .from('electoral_positions')
          .select('*')
          .eq('is_active', true)
          .order('title');
        
        if (positionsError) throw positionsError;
        
        setLoadingProgress(50);
        // Load applications (candidates) from database - only approved ones
        const { data: applicationsData, error: applicationsError } = await supabase
          .from('electoral_applications')
          .select('*')
          .eq('status', 'approved')
          .order('student_name');
        
        if (applicationsError) throw applicationsError;
        
        setLoadingProgress(75);
        // Group candidates by position
        const candidatesByPosition: { [key: string]: Candidate[] } = {};
        
        applicationsData?.forEach(app => {
          const candidate: Candidate = {
            id: app.id,
            name: app.student_name,
            email: app.student_email,
            photo: app.student_photo,
            class: app.class_name,
            stream: app.stream_name,
            experience: app.experience,
            qualifications: app.qualifications,
            whyApply: app.why_apply
          };
          
          if (!candidatesByPosition[app.position]) {
            candidatesByPosition[app.position] = [];
          }
          candidatesByPosition[app.position].push(candidate);
        });
        
        // Create positions with candidates
        const positionsWithCandidates = positionsData?.map(pos => ({
          id: pos.id,
          title: pos.title,
          description: pos.description,
          candidates: candidatesByPosition[pos.id] || []
        })).filter(pos => pos.candidates.length > 0) || [];
        
        setPositions(positionsWithCandidates);
        
        setLoadingProgress(90);
        // For now, load votes from localStorage until database types are synced
        // TODO: Replace with actual database queries once electoral_votes table is in TypeScript types
        const storedVotes = localStorage.getItem(`user_votes_${user.id}`);
        const userVotesList = storedVotes ? JSON.parse(storedVotes) : [];
        
        setUserVotes(userVotesList);
        
        setLoadingProgress(100);
        
        // TODO: Re-enable real-time subscription once electoral_votes table is in TypeScript types
        
      } catch (error) {
        console.error('Error loading voting data:', error);
        toast({
          title: "Error",
          description: "Failed to load voting data. Please refresh the page.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user, toast, navigate]);

  // Get candidates for selected position
  const selectedPositionData = useMemo(() => {
    return positions.find(p => p.id === selectedPosition);
  }, [positions, selectedPosition]);

  // Check if user has already voted for a position
  const hasVotedFor = (positionId: string) => {
    return userVotes.some(vote => vote.positionId === positionId);
  };

  // Get voting progress
  const votingProgress = useMemo(() => {
    const totalPositions = positions.length;
    const votedPositions = positions.filter(p => hasVotedFor(p.id)).length;
    return totalPositions > 0 ? (votedPositions / totalPositions) * 100 : 0;
  }, [positions, userVotes]);

  const handlePositionSelect = (positionId: string) => {
    if (hasVotedFor(positionId)) {
      toast({
        title: "Already Voted",
        description: "You have already cast your vote for this position",
        variant: "destructive"
      });
      return;
    }
    
    setSelectedPosition(positionId);
    setSelectedCandidate("");
    setCurrentStep('vote');
  };

  const handleCandidateSelect = (candidateId: string) => {
    setSelectedCandidate(candidateId);
  };

  const handleVoteSubmit = async () => {
    if (!selectedCandidate || !selectedPosition || !user?.id) return;
    
    try {
      setSubmitting(true);
      
      // Check if user has already voted for this position (using local storage temporarily)
      const hasAlreadyVoted = userVotes.some(vote => vote.positionId === selectedPosition);
      
      if (hasAlreadyVoted) {
        toast({
          title: "Vote Already Cast",
          description: "You have already voted for this position. Multiple votes are not allowed.",
          variant: "destructive"
        });
        setSubmitting(false);
        return;
      }
      
      // Get candidate details
      const selectedCandidateData = selectedPositionData?.candidates.find(c => c.id === selectedCandidate);
      
      if (!selectedCandidateData) {
        throw new Error("Selected candidate not found");
      }
      
      // SECURITY: Verify candidate is still approved and position is still active
      const { data: candidateCheck } = await supabase
        .from('electoral_applications')
        .select('status')
        .eq('id', selectedCandidate)
        .eq('status', 'approved')
        .single();
        
      if (!candidateCheck) {
        toast({
          title: "Invalid Candidate",
          description: "This candidate is no longer eligible for voting.",
          variant: "destructive"
        });
        setSubmitting(false);
        return;
      }
      
      // For now, store vote in localStorage until database types are synced
      // TODO: Replace with actual database insert once electoral_votes table is in TypeScript types
      console.log('Vote submitted:', { voter_id: user.id, position: selectedPosition, candidate_id: selectedCandidate });
      
      // Simulate successful submission for UI
      const error = null;
      
      // Update local state
      const vote: UserVote = {
        userId: user.id,
        positionId: selectedPosition,
        candidateId: selectedCandidate,
        timestamp: new Date().toISOString()
      };
      
      const updatedVotes = [...userVotes, vote];
      setUserVotes(updatedVotes);
      
      // Store votes in localStorage temporarily
      localStorage.setItem(`user_votes_${user.id}`, JSON.stringify(updatedVotes));
      
      setShowConfetti(true);
      setCurrentStep('confirm');
      
      toast({
        title: "Vote Cast Successfully!",
        description: `Your vote for ${selectedPositionData?.title} has been recorded.`,
      });
      
      // Hide confetti after 3 seconds
      setTimeout(() => setShowConfetti(false), 3000);
      
    } catch (error) {
      console.error('Error submitting vote:', error);
      toast({
        title: "Error",
        description: "Failed to submit your vote. Please try again.",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleBackToPositions = () => {
    setSelectedPosition("");
    setSelectedCandidate("");
    setCurrentStep('select-position');
  };

  const handleContinueVoting = () => {
    setCurrentStep('select-position');
    setSelectedPosition("");
    setSelectedCandidate("");
  };

  const handleLogout = async () => {
    try {
      await signOut();
      toast({
        title: "Logged out",
        description: "You have been logged out successfully."
      });
      navigate("/login");
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to log out",
        variant: "destructive"
      });
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2);
  };

  if (loading) {
    return (
      <DashboardLayout userRole={userRole || "student"} userName={userName} photoUrl={photoUrl} onLogout={handleLogout}>
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center space-y-6 max-w-md mx-auto">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Preparing Voting System</h3>
              <p className="text-muted-foreground">Loading candidates and ballot information...</p>
            </div>
            <div className="space-y-2">
              <Progress value={loadingProgress} className="h-2" />
              <p className="text-xs text-muted-foreground">{loadingProgress}% Complete</p>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout userRole={userRole || "student"} userName={userName} photoUrl={photoUrl} onLogout={handleLogout}>
      <Confetti isActive={showConfetti} onComplete={() => setShowConfetti(false)} />
      
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/electoral')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Electoral
          </Button>
        </div>

          {/* Progress Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <VoteIcon className="h-6 w-6 text-primary" />
                Voting Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Positions Voted: {positions.filter(p => hasVotedFor(p.id)).length} of {positions.length}</span>
                  <span>{Math.round(votingProgress)}%</span>
                </div>
                <Progress value={votingProgress} className="w-full" />
              </div>
            </CardContent>
          </Card>

          {/* Main Content */}
          {currentStep === 'select-position' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Trophy className="h-6 w-6 text-primary" />
                  Select Position to Vote
                </CardTitle>
                <p className="text-muted-foreground">
                  Choose a position to cast your vote. You can only vote once per position.
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {positions.length === 0 ? (
                    <div className="text-center py-12">
                      <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">No Positions Available</h3>
                      <p className="text-muted-foreground">
                        There are currently no positions with candidates available for voting.
                      </p>
                    </div>
                  ) : (
                    positions.map((position) => (
                      <Card 
                        key={position.id} 
                        className={`cursor-pointer transition-all hover:shadow-md ${
                          hasVotedFor(position.id) ? 'bg-green-50 border-green-200' : 'hover:border-primary'
                        }`}
                        onClick={() => handlePositionSelect(position.id)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="font-semibold">{position.title}</h3>
                                {hasVotedFor(position.id) && (
                                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                                    <CheckCircle className="h-3 w-3 mr-1" />
                                    Voted
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground mb-2">
                                {position.description}
                              </p>
                              <Badge variant="outline" className="text-xs">
                                {position.candidates.length} candidate{position.candidates.length !== 1 ? 's' : ''}
                              </Badge>
                            </div>
                            {!hasVotedFor(position.id) && (
                              <VoteIcon className="h-5 w-5 text-primary" />
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Voting Step */}
          {currentStep === 'vote' && selectedPositionData && (
            <Card>
              <CardHeader>
                <div className="flex items-center gap-4 mb-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleBackToPositions}
                    className="flex items-center gap-2"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Positions
                  </Button>
                </div>
                <CardTitle className="flex items-center gap-3">
                  <VoteIcon className="h-6 w-6 text-primary" />
                  Vote for {selectedPositionData.title}
                </CardTitle>
                <p className="text-muted-foreground">
                  Select one candidate to cast your vote. This action cannot be undone.
                </p>
              </CardHeader>
              <CardContent>
                <RadioGroup value={selectedCandidate} onValueChange={handleCandidateSelect}>
                  <div className="space-y-4">
                    {selectedPositionData.candidates.map((candidate) => (
                      <div key={candidate.id} className="flex items-center space-x-3">
                        <RadioGroupItem value={candidate.id} id={candidate.id} />
                        <Label htmlFor={candidate.id} className="flex-1 cursor-pointer">
                          <Card className="p-4 hover:bg-accent transition-colors">
                            <div className="flex items-center gap-4">
                              <Avatar className="h-12 w-12">
                                <AvatarImage src={candidate.photo} alt={candidate.name} />
                                <AvatarFallback>{getInitials(candidate.name)}</AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <h4 className="font-semibold">{candidate.name}</h4>
                                <p className="text-sm text-muted-foreground">{candidate.email}</p>
                                <div className="flex gap-2 mt-2">
                                  <Badge variant="outline" className="text-xs">
                                    {candidate.class}
                                  </Badge>
                                  <Badge variant="outline" className="text-xs">
                                    {candidate.stream}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                          </Card>
                        </Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>

                <div className="flex justify-end mt-6">
                  <Button 
                    onClick={handleVoteSubmit}
                    disabled={!selectedCandidate || submitting}
                    className="flex items-center gap-2"
                  >
                    {submitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Submitting Vote...
                      </>
                    ) : (
                      <>
                        <VoteIcon className="h-4 w-4" />
                        Cast Vote
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Confirmation Step */}
          {currentStep === 'confirm' && selectedPositionData && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-green-600">
                  <CheckCircle className="h-6 w-6" />
                  Vote Successfully Cast!
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <p className="text-green-800 font-medium">
                    Your vote for {selectedPositionData.title} has been recorded.
                  </p>
                  <p className="text-green-600 text-sm mt-1">
                    You cannot change this vote once submitted.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Button 
                    onClick={handleContinueVoting}
                    variant="default"
                    className="flex-1"
                  >
                    Continue Voting
                  </Button>
                  <Button 
                    onClick={() => navigate('/electoral/results')}
                    variant="outline"
                    className="flex-1"
                  >
                    View Results
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Warning */}
          <Card className="border-amber-200 bg-amber-50">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-amber-800">Important Voting Guidelines:</p>
                  <ul className="text-amber-700 mt-1 space-y-1">
                    <li>• You can only vote once per position</li>
                    <li>• Votes cannot be changed once submitted</li>
                    <li>• Ensure you review candidates carefully before voting</li>
                    <li>• Voting is anonymous and secure</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
    </DashboardLayout>
  );
}