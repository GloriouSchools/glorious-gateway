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
    
    behaviorTrackerRef.current = new BehaviorTracker();
    behaviorTrackerRef.current.startTracking();
    
    return () => {
      if (behaviorTrackerRef.current) {
        behaviorTrackerRef.current.stopTracking();
      }
    };
  }, []);

  // Load candidates and votes - Using dummy data for testing
  useEffect(() => {
    const loadDummyData = async () => {
      try {
        setLoading(true);
        
        // Mock student data
        setStudentData({
          name: "Test Student",
          email: "student@glorious.edu.ug",
          classes: { name: "P6" },
          streams: { name: "Gold" }
        });

        // Use dummy data from dummyElectoralData
        const dummyPositions: Position[] = [
          {
            id: "head_prefect",
            title: "Head Prefect",
            description: "Overall leader of the school",
            candidates: [
              {
                id: "dummy_head_prefect_1",
                name: "NAKAYIZA MILKAH",
                email: "nakayiza.milkah@gloriousschools.com",
                photo: null,
                class: "P5",
                stream: "SKYHIGH",
                experience: "I have served as class monitor for 2 years and head of the debate club.",
                qualifications: "Strong leadership skills, excellent communication",
                whyApply: "I want to bridge the gap between students and administration"
              },
              {
                id: "dummy_head_prefect_2",
                name: "MUKASA BRYTON",
                email: "mukasa.bryton@gloriousschools.com",
                photo: null,
                class: "P5",
                stream: "SUNRISE",
                experience: "Captain of the school football team, former entertainment prefect",
                qualifications: "Natural leader, team player, excellent public speaking",
                whyApply: "I believe every student should have equal opportunities"
              },
              {
                id: "dummy_head_prefect_3",
                name: "NAMATOVU IMMACULATE",
                email: "namatovu.immaculate@gloriousschools.com",
                photo: null,
                class: "P5",
                stream: "SUNSET",
                experience: "Head of the school choir, academic prefect assistant",
                qualifications: "Excellent academic performance, strong organizational skills",
                whyApply: "I want to focus on academic excellence while ensuring balanced school life"
              }
            ]
          },
          {
            id: "academic_prefect",
            title: "Academic Prefect",
            description: "Oversee academic activities",
            candidates: [
              {
                id: "dummy_academic_prefect_1",
                name: "KIGGUNDU FAVOUR MARCUS",
                email: "kiggundu.favour@gloriousschools.com",
                photo: null,
                class: "P5",
                stream: "SKYHIGH",
                experience: "Top 3 in class for the past 2 years, leader of mathematics club",
                qualifications: "Excellent academic record, strong analytical skills",
                whyApply: "I want to improve our school's academic standards"
              },
              {
                id: "dummy_academic_prefect_2",
                name: "NINSIIMA MARY SHALOM",
                email: "ninsiima.mary@gloriousschools.com",
                photo: null,
                class: "P5",
                stream: "SUNRISE",
                experience: "Head of the science club, winner of multiple academic competitions",
                qualifications: "Strong in STEM subjects, excellent research skills",
                whyApply: "I believe every student can excel academically with the right support"
              }
            ]
          },
          {
            id: "entertainment_prefect",
            title: "Entertainment Prefect",
            description: "Organize school entertainment events",
            candidates: [
              {
                id: "dummy_entertainment_prefect_1",
                name: "KAYEMBA SHAN",
                email: "kayemba.shan@gloriousschools.com",
                photo: null,
                class: "P5",
                stream: "SUNSET",
                experience: "Lead dancer in school cultural performances, organized talent shows",
                qualifications: "Creative thinking, event planning experience",
                whyApply: "I want to make our school events more exciting and inclusive"
              },
              {
                id: "dummy_entertainment_prefect_2",
                name: "SSEMATIMBA MARK",
                email: "ssematimba.mark@gloriousschools.com",
                photo: null,
                class: "P5",
                stream: "SUNRISE",
                experience: "School DJ for events, organizer of movie nights",
                qualifications: "Technical skills with audio equipment, creative event planning",
                whyApply: "I want to modernize our entertainment activities"
              }
            ]
          },
          {
            id: "games_sports_prefect",
            title: "Games & Sports Prefect",
            description: "Manage sports activities",
            candidates: [
              {
                id: "dummy_games_sports_prefect_1",
                name: "TUSUBIRA ARTHUR",
                email: "tusubira.arthur@gloriousschools.com",
                photo: null,
                class: "P5",
                stream: "SKYHIGH",
                experience: "Captain of the school basketball team, organized inter-class tournaments",
                qualifications: "Excellent athletic ability, leadership in team sports",
                whyApply: "I want to improve our sports facilities and ensure everyone can participate"
              }
            ]
          }
        ];
        
        setPositions(dummyPositions);
        
        // Check if already voted
        if (sessionStorage.getItem('voteSubmitted') === 'true') {
          setHasAlreadyVoted(true);
        }
        
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

    loadDummyData();
  }, [toast, navigate]);

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
    
    const { error } = await supabase
      .from('votes')
      .insert({
        voter_id: user.id,
        voter_name: studentData.name,
        voter_email: studentData.email,
        voter_class: studentData.classes?.name || '',
        voter_stream: studentData.streams?.name || '',
        position_id: positionId,
        position_title: position.title,
        candidate_id: candidateId,
        candidate_name: candidate.name,
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
    
    toast({
      title: "Vote Recorded",
      description: `Your vote for ${position.title} has been recorded.`,
    });
  };

  const handleVoteComplete = (votes: Record<string, string>) => {
    toast({
      title: "🎉 All Votes Submitted!",
      description: "Thank you for voting in the Student Council Elections.",
    });
    
    setTimeout(() => {
      navigate('/student/electoral');
    }, 3000);
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
                onClick={() => navigate('/student/electoral/results')}
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
    <BallotContainer 
      positions={positions}
      onVotePosition={handleVotePosition}
      onVoteComplete={handleVoteComplete}
    />
  );
}
