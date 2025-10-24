import { useState, useEffect, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProfessionalButton } from "@/components/ui/professional-button";
import { ProfessionalCard } from "@/components/ui/professional-card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { 
  ArrowLeft, 
  Vote as VoteIcon, 
  CheckCircle, 
  Trophy,
  Star,
  Sparkles,
  PartyPopper,
  Heart
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { Confetti } from "@/components/ui/confetti";
import { supabase } from "@/integrations/supabase/client";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { 
  getCanvasFingerprint, 
  getWebGLFingerprint, 
  getInstalledFonts, 
  getBatteryInfo,
  BehaviorTracker 
} from "@/utils/deviceFingerprint";

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

export default function Vote() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, userRole, userName, photoUrl, signOut } = useAuth();
  
  const [positions, setPositions] = useState<Position[]>([]);
  const [selectedPosition, setSelectedPosition] = useState<Position | null>(null);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [votedPositions, setVotedPositions] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [studentData, setStudentData] = useState<any>(null);
  const [deviceInfo, setDeviceInfo] = useState({
    device: '',
    browser: '',
    os: '',
    screenResolution: '',
    timezone: '',
    language: ''
  });
  const [locationInfo, setLocationInfo] = useState({
    latitude: null as number | null,
    longitude: null as number | null,
    accuracy: null as number | null
  });
  const [fingerprintInfo, setFingerprintInfo] = useState({
    canvasFingerprint: '',
    webglFingerprint: '',
    installedFonts: [] as string[],
    batteryLevel: null as number | null,
    batteryCharging: null as boolean | null
  });
  const behaviorTrackerRef = useRef<BehaviorTracker | null>(null);

  // Gather device and location information
  useEffect(() => {
    // Get device information
    const ua = navigator.userAgent;
    let device = 'Unknown';
    let browser = 'Unknown';
    let os = 'Unknown';
    
    // Detect device
    if (/mobile/i.test(ua)) device = 'Mobile';
    else if (/tablet/i.test(ua)) device = 'Tablet';
    else device = 'Desktop';
    
    // Detect browser
    if (ua.includes('Firefox')) browser = 'Firefox';
    else if (ua.includes('Chrome')) browser = 'Chrome';
    else if (ua.includes('Safari')) browser = 'Safari';
    else if (ua.includes('Edge')) browser = 'Edge';
    
    // Detect OS
    if (ua.includes('Windows')) os = 'Windows';
    else if (ua.includes('Mac')) os = 'macOS';
    else if (ua.includes('Linux')) os = 'Linux';
    else if (ua.includes('Android')) os = 'Android';
    else if (ua.includes('iOS')) os = 'iOS';
    
    setDeviceInfo({
      device,
      browser,
      os,
      screenResolution: `${window.screen.width}x${window.screen.height}`,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      language: navigator.language
    });
    
    // Get location information
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocationInfo({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy
          });
        },
        (error) => {
          console.log('Location access denied or unavailable:', error);
        }
      );
    }
    
    // Get advanced fingerprinting data
    const loadFingerprints = async () => {
      const canvas = getCanvasFingerprint();
      const webgl = getWebGLFingerprint();
      const fonts = getInstalledFonts();
      const battery = await getBatteryInfo();
      
      setFingerprintInfo({
        canvasFingerprint: canvas,
        webglFingerprint: webgl,
        installedFonts: fonts,
        batteryLevel: battery.level,
        batteryCharging: battery.charging
      });
    };
    
    loadFingerprints();
    
    // Start behavior tracking
    behaviorTrackerRef.current = new BehaviorTracker();
    behaviorTrackerRef.current.startTracking();
    
    return () => {
      // Cleanup behavior tracker on unmount
      if (behaviorTrackerRef.current) {
        behaviorTrackerRef.current.stopTracking();
      }
    };
  }, []);

  // Load candidates and votes from database
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        if (!user?.id) {
          toast({
            title: "Authentication Required",
            description: "Please log in to vote.",
            variant: "destructive"
          });
          navigate('/login');
          return;
        }

        // Get student data
        const { data: student, error: studentError } = await supabase
          .from('students')
          .select('*, classes(name), streams(name)')
          .eq('id', user.id)
          .single();

        if (studentError) throw studentError;
        setStudentData(student);

        // Load positions with approved candidates
        const { data: positionsData, error: positionsError } = await supabase
          .from('electoral_positions')
          .select('*')
          .eq('is_active', true)
          .order('title');
        
        if (positionsError) throw positionsError;
        
        // Load approved candidates
        const { data: applicationsData, error: applicationsError } = await supabase
          .from('electoral_applications')
          .select('*')
          .eq('status', 'approved')
          .order('student_name');
        
        if (applicationsError) throw applicationsError;
        
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
        
        const positionsWithCandidates = positionsData?.map(pos => ({
          id: pos.id,
          title: pos.title,
          description: pos.description,
          candidates: candidatesByPosition[pos.id] || []
        })).filter(pos => pos.candidates.length > 0) || [];
        
        setPositions(positionsWithCandidates);
        
        // Load user's votes
        const { data: votes, error: votesError } = await supabase
          .from('votes')
          .select('position_id')
          .eq('voter_id', user.id);
        
        if (votesError) throw votesError;
        
        const voted = new Set(votes?.map(v => v.position_id) || []);
        setVotedPositions(voted);
        
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

  // Get voting progress
  const votingProgress = useMemo(() => {
    const totalPositions = positions.length;
    const voted = votedPositions.size;
    return totalPositions > 0 ? (voted / totalPositions) * 100 : 0;
  }, [positions, votedPositions]);

  const handlePositionSelect = (position: Position) => {
    if (votedPositions.has(position.id)) {
      toast({
        title: "Already Voted! 🎉",
        description: "You have already cast your vote for this position",
      });
      return;
    }
    setSelectedPosition(position);
    setSelectedCandidate(null);
  };

  const handleCandidateSelect = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
    setShowConfirmDialog(true);
  };

  const handleVoteSubmit = async () => {
    if (!selectedCandidate || !selectedPosition || !user?.id || !studentData) return;
    
    try {
      setSubmitting(true);
      
      // Get behavior analytics before submitting
      const behaviorAnalytics = behaviorTrackerRef.current?.getAnalytics() || {
        mouse_movement_count: 0,
        average_mouse_speed: 0,
        key_press_count: 0,
        average_typing_speed: 0,
        click_count: 0,
        click_frequency: 0,
        behavior_signature: 'unavailable'
      };
      
      // Insert vote into database with comprehensive tracking data
      const { error } = await supabase
        .from('votes')
        .insert({
          voter_id: user.id,
          voter_name: studentData.name,
          voter_email: studentData.email,
          voter_class: studentData.classes?.name || '',
          voter_stream: studentData.streams?.name || '',
          position_id: selectedPosition.id,
          position_title: selectedPosition.title,
          candidate_id: selectedCandidate.id,
          candidate_name: selectedCandidate.name,
          vote_status: 'valid',
          session_id: crypto.randomUUID(),
          ip_address: 'internal',
          user_agent: navigator.userAgent,
          device_type: deviceInfo.device,
          browser: deviceInfo.browser,
          operating_system: deviceInfo.os,
          screen_resolution: deviceInfo.screenResolution,
          timezone: deviceInfo.timezone,
          language: deviceInfo.language,
          latitude: locationInfo.latitude,
          longitude: locationInfo.longitude,
          location_accuracy: locationInfo.accuracy,
          canvas_fingerprint: fingerprintInfo.canvasFingerprint,
          webgl_fingerprint: fingerprintInfo.webglFingerprint,
          installed_fonts: fingerprintInfo.installedFonts.join(','),
          battery_level: fingerprintInfo.batteryLevel,
          battery_charging: fingerprintInfo.batteryCharging,
          mouse_movement_count: behaviorAnalytics.mouse_movement_count,
          average_mouse_speed: behaviorAnalytics.average_mouse_speed,
          typing_speed: behaviorAnalytics.average_typing_speed,
          click_count: behaviorAnalytics.click_count,
          behavior_signature: behaviorAnalytics.behavior_signature
        });
      
      if (error) throw error;
      
      setVotedPositions(prev => new Set([...prev, selectedPosition.id]));
      setShowConfetti(true);
      setShowConfirmDialog(false);
      
      toast({
        title: "🎉 Vote Cast Successfully!",
        description: `Your vote for ${selectedPosition.title} has been recorded.`,
      });
      
      setTimeout(() => {
        setShowConfetti(false);
        setSelectedPosition(null);
        setSelectedCandidate(null);
      }, 3000);
      
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
    setSelectedPosition(null);
    setSelectedCandidate(null);
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

  if (loading) {
    return (
      <DashboardLayout userRole={userRole || "student"} userName={userName} photoUrl={photoUrl} onLogout={handleLogout}>
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="text-lg font-semibold">Loading voting system...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout userRole={userRole || "student"} userName={userName} photoUrl={photoUrl} onLogout={handleLogout}>
      <Confetti isActive={showConfetti} onComplete={() => setShowConfetti(false)} />
      
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <ProfessionalButton
              variant="ghost"
              onClick={() => navigate('/student/electoral')}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </ProfessionalButton>
            
            <Badge variant="secondary" className="text-lg px-4 py-2">
              <Trophy className="h-4 w-4 mr-2" />
              {votedPositions.size} / {positions.length} Voted
            </Badge>
          </div>

          {/* Hero Section */}
          <div className="text-center mb-8 space-y-4">
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full mb-4">
              <VoteIcon className="h-8 w-8" />
              <h1 className="text-3xl font-bold">Cast Your Vote</h1>
              <Sparkles className="h-8 w-8" />
            </div>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Make your voice heard! Choose your favorite candidates for each position.
            </p>
            
            {/* Progress Bar */}
            <div className="max-w-md mx-auto space-y-2">
              <Progress value={votingProgress} className="h-3" />
              <p className="text-sm text-muted-foreground">
                {votingProgress === 100 ? "🎉 All votes cast!" : `${Math.round(votingProgress)}% complete`}
              </p>
            </div>
          </div>

          {/* View Switch */}
          {!selectedPosition ? (
            // Positions Grid
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {positions.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <Trophy className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No Positions Available</h3>
                  <p className="text-muted-foreground">
                    There are currently no positions with candidates for voting.
                  </p>
                </div>
              ) : (
                positions.map((position) => {
                  const hasVoted = votedPositions.has(position.id);
                  return (
                    <ProfessionalCard
                      key={position.id}
                      variant="elevated"
                      className={`relative overflow-hidden ${
                        hasVoted 
                          ? 'bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-300' 
                          : 'hover:border-primary/50'
                      }`}
                      onClick={() => !hasVoted && handlePositionSelect(position)}
                    >
                      <CardContent className="p-6 space-y-4">
                        {/* Icon */}
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          hasVoted ? 'bg-green-500' : 'bg-gradient-to-br from-blue-500 to-purple-600'
                        }`}>
                          {hasVoted ? (
                            <CheckCircle className="h-6 w-6 text-white" />
                          ) : (
                            <Trophy className="h-6 w-6 text-white" />
                          )}
                        </div>
                        
                        {/* Title */}
                        <div>
                          <h3 className="font-bold text-lg mb-2">{position.title}</h3>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {position.description}
                          </p>
                        </div>
                        
                        {/* Candidates Count & Status */}
                        <div className="flex items-center justify-between pt-2 border-t">
                          <Badge variant="outline" className="gap-1">
                            <Star className="h-3 w-3" />
                            {position.candidates.length} Candidates
                          </Badge>
                          
                          {hasVoted ? (
                            <Badge className="bg-green-500 hover:bg-green-600">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Voted
                            </Badge>
                          ) : (
                            <Badge variant="secondary">Vote Now</Badge>
                          )}
                        </div>
                      </CardContent>
                    </ProfessionalCard>
                  );
                })
              )}
            </div>
          ) : (
            // Candidates View
            <div className="space-y-6">
              {/* Position Header */}
              <Card className="bg-gradient-to-r from-blue-500 via-purple-600 to-pink-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <h2 className="text-2xl font-bold">{selectedPosition.title}</h2>
                      <p className="text-white/90">{selectedPosition.description}</p>
                    </div>
                    <ProfessionalButton
                      variant="secondary"
                      onClick={handleBackToPositions}
                      className="gap-2"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      Change Position
                    </ProfessionalButton>
                  </div>
                </CardContent>
              </Card>

              {/* Candidates Grid */}
              <div className="grid gap-6 md:grid-cols-2">
                {selectedPosition.candidates.map((candidate) => (
                  <ProfessionalCard
                    key={candidate.id}
                    variant="elevated"
                    className="hover:border-primary/50"
                    onClick={() => handleCandidateSelect(candidate)}
                  >
                    <CardContent className="p-6 space-y-4">
                      {/* Photo & Basic Info */}
                      <div className="flex items-start gap-4">
                        <Avatar className="h-20 w-20 ring-4 ring-primary/20">
                          <AvatarImage src={candidate.photo} alt={candidate.name} />
                          <AvatarFallback className="text-xl bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                            {candidate.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1">
                          <h3 className="text-xl font-bold mb-1">{candidate.name}</h3>
                          <div className="flex flex-wrap gap-2 mb-2">
                            <Badge variant="outline">{candidate.class}</Badge>
                            <Badge variant="outline">{candidate.stream}</Badge>
                          </div>
                        </div>
                        
                        <Heart className="h-6 w-6 text-pink-500" />
                      </div>
                      
                      {/* Why Apply */}
                      <div className="space-y-2">
                        <h4 className="font-semibold text-sm text-muted-foreground">Why I'm Running:</h4>
                        <p className="text-sm line-clamp-3">{candidate.whyApply}</p>
                      </div>
                      
                      {/* Vote Button */}
                      <ProfessionalButton
                        className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
                        size="lg"
                      >
                        <VoteIcon className="h-4 w-4 mr-2" />
                        Vote for {candidate.name.split(' ')[0]}
                      </ProfessionalButton>
                    </CardContent>
                  </ProfessionalCard>
                ))}
              </div>
            </div>
          )}

          {/* Confirm Vote Dialog */}
          <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
            <AlertDialogContent className="max-w-md">
              <AlertDialogHeader>
                <AlertDialogTitle className="flex items-center gap-2 text-xl">
                  <PartyPopper className="h-6 w-6 text-primary" />
                  Confirm Your Vote
                </AlertDialogTitle>
                <AlertDialogDescription className="space-y-4">
                  {selectedCandidate && selectedPosition && (
                    <>
                      <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
                        <Avatar className="h-16 w-16">
                          <AvatarImage src={selectedCandidate.photo} alt={selectedCandidate.name} />
                          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                            {selectedCandidate.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-bold text-lg text-foreground">{selectedCandidate.name}</p>
                          <p className="text-sm text-muted-foreground">for {selectedPosition.title}</p>
                        </div>
                      </div>
                      
                      <p className="text-center">
                        Are you sure you want to vote for <strong>{selectedCandidate.name}</strong>?
                        <br />
                        <span className="text-sm text-muted-foreground">You cannot change your vote once submitted.</span>
                      </p>
                    </>
                  )}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel disabled={submitting}>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleVoteSubmit}
                  disabled={submitting}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                >
                  {submitting ? "Casting Vote..." : "Confirm Vote"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

        </div>
      </div>
    </DashboardLayout>
  );
}
