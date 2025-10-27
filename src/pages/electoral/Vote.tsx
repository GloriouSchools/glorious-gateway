import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { BallotContainer } from "@/components/electoral/ballot";
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
  photo?: string | null;
  class: string;
  stream: string;
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
  const [loading, setLoading] = useState(true);
  const [studentData, setStudentData] = useState<any>(null);
  const [hasAlreadyVoted, setHasAlreadyVoted] = useState(false);
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
  const [ipAddress, setIpAddress] = useState<string | null>(null);
  const [locationDenied, setLocationDenied] = useState(false);
  const [showLocationWarning, setShowLocationWarning] = useState(false);
  const [fingerprintInfo, setFingerprintInfo] = useState({
    canvasFingerprint: '',
    webglFingerprint: '',
    installedFonts: [] as string[],
    batteryLevel: null as number | null,
    batteryCharging: null as boolean | null
  });
  const behaviorTrackerRef = useRef<BehaviorTracker | null>(null);
  const locationWatchIdRef = useRef<number | null>(null);

  // Warn user before leaving if voting is incomplete
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      const ballotData = sessionStorage.getItem('ballotData');
      const voteSubmitted = sessionStorage.getItem('voteSubmitted');
      
      // Only warn if they have started voting but haven't completed
      if (ballotData && voteSubmitted !== 'true') {
        e.preventDefault();
        e.returnValue = 'You have not completed voting yet. Your vote will not be recorded, but your selections will be restored if you return to this page.';
        return e.returnValue;
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  // Gather device and location information
  useEffect(() => {
    const ua = navigator.userAgent;
    let device = 'Unknown';
    let browser = 'Unknown';
    let os = 'Unknown';
    
    if (/mobile/i.test(ua)) device = 'Mobile';
    else if (/tablet/i.test(ua)) device = 'Tablet';
    else device = 'Desktop';
    
    if (ua.includes('Firefox')) browser = 'Firefox';
    else if (ua.includes('Chrome')) browser = 'Chrome';
    else if (ua.includes('Safari')) browser = 'Safari';
    else if (ua.includes('Edge')) browser = 'Edge';
    
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
    
    // Continuous location monitoring
    if ('geolocation' in navigator) {
      // Initial check
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocationInfo({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy
          });
          setLocationDenied(false);
          setShowLocationWarning(false);
        },
        (error) => {
          console.log('Location access denied or unavailable:', error);
          setLocationDenied(true);
          setShowLocationWarning(true);
        }
      );

      // Watch for location changes continuously
      locationWatchIdRef.current = navigator.geolocation.watchPosition(
        (position) => {
          setLocationInfo({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy
          });
          setLocationDenied(false);
          setShowLocationWarning(false);
        },
        (error) => {
          console.log('Location tracking error:', error);
          setLocationDenied(true);
          setShowLocationWarning(true);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    }
    
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
    
    // Fetch IP address
    const fetchIpAddress = async () => {
      try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        setIpAddress(data.ip);
      } catch (error) {
        console.log('Could not fetch IP address:', error);
        setIpAddress(null);
      }
    };
    
    fetchIpAddress();
    
    behaviorTrackerRef.current = new BehaviorTracker();
    behaviorTrackerRef.current.startTracking();
    
    return () => {
      if (behaviorTrackerRef.current) {
        behaviorTrackerRef.current.stopTracking();
      }
      // Clear location watch on unmount
      if (locationWatchIdRef.current !== null) {
        navigator.geolocation.clearWatch(locationWatchIdRef.current);
      }
    };
  }, []);

  // Load candidates from database
  useEffect(() => {
    const loadVotingData = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        // Fetch student data with joins
        const { data: student, error: studentError } = await supabase
          .from('students')
          .select('id, name, email, class_id, stream_id')
          .eq('id', user.id)
          .single();

        if (studentError) throw studentError;

        // Fetch class and stream separately
        const [classResult, streamResult] = await Promise.all([
          supabase.from('classes').select('name').eq('id', student.class_id).single(),
          supabase.from('streams').select('name').eq('id', student.stream_id).single()
        ]);

        setStudentData({
          name: student.name,
          email: student.email,
          classes: { name: classResult.data?.name || 'Unknown' },
          streams: { name: streamResult.data?.name || 'Unknown' }
        });

        // Check if student has already voted
        const { data: existingVotes, error: votesError } = await supabase
          .from('electoral_votes')
          .select('id')
          .eq('voter_id', user.id)
          .limit(1);

        if (votesError) throw votesError;

        if (existingVotes && existingVotes.length > 0) {
          setHasAlreadyVoted(true);
          setLoading(false);
          return;
        }

        // Fetch active positions
        const { data: positionsData, error: positionsError } = await supabase
          .from('electoral_positions')
          .select('*')
          .eq('is_active', true)
          .order('title');

        if (positionsError) throw positionsError;

        // Fetch confirmed candidates
        const { data: candidatesData, error: candidatesError } = await supabase
          .from('electoral_applications')
          .select('*')
          .eq('status', 'confirmed')
          .order('student_name');

        if (candidatesError) throw candidatesError;

        // Group candidates by position - filter out candidates with NULL IDs
        const positionsWithCandidates: Position[] = (positionsData || []).map(pos => ({
          id: pos.id!,
          title: pos.title!,
          description: pos.description || '',
          candidates: (candidatesData || [])
            .filter(app => app.position === pos.id && app.id !== null && app.id !== undefined)
            .map(app => ({
              id: app.id!,
              name: app.student_name!,
              email: app.student_email!,
              photo: app.student_photo,
              class: app.class_name!,
              stream: app.stream_name!
            }))
        })).filter(pos => pos.candidates.length > 0); // Only show positions with candidates
        
        setPositions(positionsWithCandidates);
        
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

    loadVotingData();
  }, [user?.id, toast]);

  const handleVotePosition = async (positionId: string, candidateId: string) => {
    if (!user?.id || !studentData) {
      throw new Error('User not authenticated');
    }

    const position = positions.find(p => p.id === positionId);
    const candidate = position?.candidates.find(c => c.id === candidateId);

    if (!position || !candidate) {
      throw new Error('Invalid position or candidate');
    }
    
    const behaviorAnalytics = behaviorTrackerRef.current?.getAnalytics() || {
      mouse_movement_count: 0,
      average_mouse_speed: 0,
      key_press_count: 0,
      average_typing_speed: 0,
      click_count: 0,
      click_frequency: 0,
      behavior_signature: 'unavailable'
    };
    
    // Determine vote status based on requirements:
    // 1. Location must be available
    // 2. Device must be Desktop
    // 3. Browser must be Chrome
    // 4. OS must be Windows
    const hasLocation = !locationDenied && locationInfo.latitude !== null && locationInfo.longitude !== null;
    const isValidDevice = deviceInfo.device === 'Desktop';
    const isValidBrowser = deviceInfo.browser === 'Chrome';
    const isValidOS = deviceInfo.os === 'Windows';
    
    const voteStatus = (hasLocation && isValidDevice && isValidBrowser && isValidOS) ? 'valid' : 'invalid';
    
    const { data, error } = await supabase
      .from('electoral_votes')
      .insert({
        voter_id: user.id,
        voter_name: studentData.name,
        candidate_id: candidateId,
        candidate_name: candidate.name,
        position: position.title,
        vote_status: voteStatus,
        device_type: deviceInfo.device,
        browser: deviceInfo.browser,
        os: deviceInfo.os,
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
        behavior_signature: behaviorAnalytics.behavior_signature,
        ip_address: ipAddress,
      })
      .select();
    
    if (error) {
      console.error('Vote insertion error:', error);
      throw new Error(`Failed to record vote: ${error.message}`);
    }
    
    console.log('Vote successfully inserted:', data);
    
    toast({
      title: "Vote Recorded",
      description: `Your vote for ${position.title} has been recorded.`,
    });
  };

  const handleVoteComplete = (votes: Record<string, string>) => {
    // Success overlay will handle navigation - no auto-redirect
    toast({
      title: "🗳️ All Votes Submitted!",
      description: "Thank you for voting in the Student Council Elections.",
    });
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
      <div className="min-h-screen bg-gradient-to-br from-[#667eea] to-[#764ba2] flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
          <p className="text-lg font-semibold text-white">Loading voting system...</p>
        </div>
      </div>
    );
  }

  if (hasAlreadyVoted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#667eea] to-[#764ba2] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white border-[3px] border-[#2c3e50] shadow-[0_20px_60px_rgba(0,0,0,0.3)] p-12">
          <div className="text-center space-y-6">
            <div className="text-6xl">✅</div>
            <h2 className="text-3xl font-bold text-[#1a1a1a]">Already Voted</h2>
            <p className="text-[#4a4a4a] text-lg mb-6">
              You have already submitted your ballot for this election. Only one vote per person is allowed.
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => navigate('/student/electoral')}
                className="px-8 py-4 text-lg font-bold uppercase tracking-wider bg-[#667eea] hover:bg-[#5568d3] text-white rounded-lg transition-colors"
              >
                View Live Results
              </button>
              <button
                onClick={() => navigate('/student/electoral')}
                className="text-[#667eea] hover:underline font-bold"
              >
                Return to Electoral Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {showLocationWarning && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-300">
          <div className="max-w-md w-full bg-white dark:bg-gray-800 border-[3px] border-red-500 shadow-[0_20px_60px_rgba(220,38,38,0.4)] p-8 rounded-lg animate-in zoom-in duration-300">
            <div className="text-center space-y-4">
              <div className="text-5xl animate-pulse">🚨</div>
              <h2 className="text-2xl font-bold text-red-600 dark:text-red-400">Location Turned Off!</h2>
              <p className="text-gray-700 dark:text-gray-300 font-semibold">
                Your location has been disabled. Your votes will be marked as <span className="font-bold text-red-600">INVALID</span> without location verification.
              </p>
              <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-300 dark:border-red-700 p-4 rounded-lg">
                <p className="text-sm text-red-800 dark:text-red-300 font-medium">
                  ⚠️ Please turn on your device location to ensure your vote is counted as valid.
                </p>
              </div>
              <div className="flex flex-col gap-3 pt-4">
                <button
                  onClick={() => setShowLocationWarning(false)}
                  className="px-6 py-3 text-base font-bold uppercase tracking-wider bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                >
                  Continue Without Location (Invalid Vote)
                </button>
                <button
                  onClick={() => window.location.reload()}
                  className="text-gray-600 dark:text-gray-400 hover:underline text-sm font-medium"
                >
                  Refresh to Enable Location
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <BallotContainer 
        positions={positions}
        onVotePosition={handleVotePosition}
        onVoteComplete={handleVoteComplete}
      />
    </>
  );
}
