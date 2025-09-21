import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { AnimatedCard } from "@/components/ui/animated-card";
import { AnimatedButton } from "@/components/ui/animated-button";
import { QuoteModal } from "@/components/ui/quote-modal";
import { getQuoteOfTheDay, getRandomPhotoQuote, PhotoQuote } from "@/utils/photoQuotes";
import { format } from "date-fns";
import { toZonedTime } from "date-fns-tz";
import { 
  BookOpen, 
  ClipboardList, 
  Award, 
  Calendar,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Mail,
  Loader2,
  Vote,
  Trophy,
  UserCheck,
  Sparkles,
  Star,
  Users,
  Library,
  MessageSquare,
  HelpCircle,
  ArrowRight,
  Zap,
  Target,
  Heart,
  Smile,
  User,
  GraduationCap,
  Monitor,
  Quote
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { AccountVerificationForm } from "@/components/auth/AccountVerificationForm";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";
import { Confetti } from "@/components/ui/confetti";

export function StudentDashboard() {
  const { userName, isVerified, personalEmail, user, isLoading } = useAuth();
  const navigate = useNavigate();
  const [showVerificationDialog, setShowVerificationDialog] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [dailyPhotoQuote, setDailyPhotoQuote] = useState<PhotoQuote>({ src: "", alt: "" });
  const [greeting, setGreeting] = useState("");
  const [quoteLoading, setQuoteLoading] = useState(true);
  const [showQuoteModal, setShowQuoteModal] = useState(false);

  // Get quote of the day and time-based greeting on component mount
  useEffect(() => {
    loadQuoteOfTheDay();

    // Get current time in East Africa Time (EAT)
    const eatTime = toZonedTime(new Date(), 'Africa/Nairobi');
    const hour = eatTime.getHours();

    if (hour >= 5 && hour < 12) {
      setGreeting("Good morning");
    } else if (hour >= 12 && hour < 17) {
      setGreeting("Good afternoon");
    } else {
      setGreeting("Good evening");
    }
  }, []);

  // Function to load quote of the day (persistent)
  const loadQuoteOfTheDay = () => {
    try {
      setQuoteLoading(true);
      const photoQuote = getQuoteOfTheDay();
      setDailyPhotoQuote(photoQuote);
    } catch (error) {
      console.log('Error loading photo quote:', error);
      // Fallback to a default image or text
      setDailyPhotoQuote({ 
        src: "/placeholder.svg", 
        alt: "Inspirational quote of the day" 
      });
    } finally {
      setQuoteLoading(false);
    }
  };

  // Function to load a new photo quote (when user requests new one)
  const loadNewPhotoQuote = () => {
    try {
      setQuoteLoading(true);
      const photoQuote = getRandomPhotoQuote();
      setDailyPhotoQuote(photoQuote);
    } catch (error) {
      console.log('Error loading photo quote:', error);
      // Fallback to a default image or text
      setDailyPhotoQuote({ 
        src: "/placeholder.svg", 
        alt: "Inspirational quote of the day" 
      });
    } finally {
      setQuoteLoading(false);
    }
  };

  // Show loading state while authentication is being resolved
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4 animate-bounce">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
          <p className="text-lg font-semibold text-muted-foreground">Loading your awesome dashboard... 🚀</p>
        </div>
      </div>
    );
  }
  
  const dashboardSections = [
    {
      id: 'elections',
      title: 'Elections',
      description: 'Vote for your school leaders',
      icon: Vote,
      color: 'from-red-400 to-pink-400',
      stats: 'Voting Open Now!',
      action: 'Vote Now',
      route: '/electoral',
      isHighlight: true
    },
    {
      id: 'profile',
      title: 'Profile',
      description: 'See your info & achievements',
      icon: User,
      color: 'from-purple-400 to-pink-400',
      stats: 'Profile 95% Complete',
      action: 'Visit Profile',
      route: '/profile'
    },
    {
      id: 'calendar',
      title: 'Calendar',
      description: 'Never miss important dates!',
      icon: Calendar,
      color: 'from-blue-400 to-cyan-400',
      stats: '3 Events Today',
      action: 'Check Schedule',
      route: '/calendar'
    },
    {
      id: 'classes',
      title: 'My Classes',
      description: 'All your subjects in one place',
      icon: BookOpen,
      color: 'from-green-400 to-emerald-400',
      stats: '6 Active Classes',
      action: 'Explore Classes',
      route: '/classes'
    },
    {
      id: 'assignments',
      title: 'Assignments',
      description: 'Track your homework & projects',
      icon: ClipboardList,
      color: 'from-orange-400 to-red-400',
      stats: '4 Due This Week',
      action: 'Start Working',
      route: '/assignments'
    },
    {
      id: 'grades',
      title: 'My Grades',
      description: 'See how awesome you\'re doing!',
      icon: Award,
      color: 'from-yellow-400 to-orange-400',
      stats: 'GPA: 3.75/4.0',
      action: 'View Report',
      route: '/grades'
    },
    {
      id: 'timetable',
      title: 'Timetable',
      description: 'Your daily class schedule',
      icon: Clock,
      color: 'from-indigo-400 to-purple-400',
      stats: 'Next: Math at 10:00',
      action: 'See Schedule',
      route: '/timetable'
    },
    {
      id: 'attendance',
      title: 'Attendance',
      description: 'Track your presence streak!',
      icon: UserCheck,
      color: 'from-teal-400 to-green-400',
      stats: '92% This Month',
      action: 'Check Record',
      route: '/attendance'
    },
    {
      id: 'hall-of-fame',
      title: 'Hall of Fame',
      description: 'See the amazing achievers!',
      icon: Trophy,
      color: 'from-yellow-400 to-amber-400',
      stats: 'Top 10 Students',
      action: 'See Stars',
      route: '/hall-of-fame'
    },
    {
      id: 'library',
      title: 'Library',
      description: 'Discover amazing books & resources',
      icon: Library,
      color: 'from-emerald-400 to-teal-400',
      stats: '500+ Books Available',
      action: 'Browse Books',
      route: '/library'
    },
    {
      id: 'communication',
      title: 'Communication',
      description: 'Connect with friends & teachers',
      icon: MessageSquare,
      color: 'from-blue-400 to-indigo-400',
      stats: '3 New Messages',
      action: 'Read Messages',
      route: '/communication'
    },
    {
      id: 'help',
      title: 'Help & Support',
      description: 'Need help? We\'re here for you!',
      icon: HelpCircle,
      color: 'from-purple-400 to-pink-400',
      stats: '24/7 Support',
      action: 'Get Help',
      route: '/help'
    }
  ];

  const quickStats = [
    { label: 'Friends', value: '24', icon: Users, color: 'text-blue-500', route: '/friends', clickable: true },
    { label: 'Friend Requests', value: '3', icon: Heart, color: 'text-pink-500', route: '/friend-requests', clickable: true },
    { label: 'Classmates', value: '35', icon: GraduationCap, color: 'text-green-500', route: '/classmates', clickable: true },
    { label: 'Streammates', value: '142', icon: Monitor, color: 'text-purple-500', route: '/streammates', clickable: true }
  ];

  const handleSectionClick = (route: string, isHighlight?: boolean) => {
    if (isHighlight) {
      setShowConfetti(true);
    }
    navigate(route);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <Confetti isActive={showConfetti} onComplete={() => setShowConfetti(false)} />
      
      {/* Hero Welcome Section */}
      <div className="relative overflow-hidden rounded-2xl md:rounded-3xl bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 p-4 md:p-6 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 text-center space-y-2 md:space-y-3">
          <div className="flex justify-center items-center space-x-1 md:space-x-2 mb-2">
            <Sparkles className="h-4 w-4 md:h-6 md:w-6 animate-pulse" />
            <span className="text-lg md:text-2xl animate-bounce">🎉</span>
            <Sparkles className="h-4 w-4 md:h-6 md:w-6 animate-pulse" />
          </div>
          <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold animate-slide-in-right">
            {greeting}, {userName || 'Superstar'}! 
          </h1>
          <p className="text-sm md:text-lg lg:text-xl font-medium opacity-90 animate-fade-in">
            Quote of the Day
          </p>
          <div className="bg-black/20 backdrop-blur-sm rounded-lg md:rounded-xl p-3 md:p-4 mt-2 md:mt-4 max-w-xs md:max-w-2xl mx-auto border border-white/10">
            {quoteLoading ? (
              <div className="flex justify-center items-center h-32 md:h-48">
                <Loader2 className="h-6 w-6 md:h-8 md:w-8 animate-spin text-white/80" />
              </div>
            ) : (
              <div className="relative group cursor-pointer" onClick={() => setShowQuoteModal(true)}>
                <img 
                  src={dailyPhotoQuote.src} 
                  alt={dailyPhotoQuote.alt}
                  className="w-full h-32 md:h-48 object-contain rounded-lg md:rounded-xl shadow-lg transition-transform duration-300 group-hover:scale-105"
                  onError={(e) => {
                    // Fallback to placeholder if image fails to load
                    (e.target as HTMLImageElement).src = "/placeholder.svg";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg md:rounded-xl flex items-center justify-center">
                  <p className="text-sm text-white font-medium bg-black/50 px-3 py-1 rounded-full backdrop-blur-sm">Click to zoom 🔍</p>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Floating Elements - Hidden on mobile */}
        <div className="hidden md:block absolute top-4 left-4 animate-bounce delay-100">
          <Star className="h-4 w-4 md:h-6 md:w-6 text-yellow-300" />
        </div>
        <div className="hidden md:block absolute top-8 right-8 animate-bounce delay-300">
          <Heart className="h-3 w-3 md:h-5 md:w-5 text-pink-300" />
        </div>
        <div className="hidden md:block absolute bottom-4 left-8 animate-bounce delay-500">
          <Smile className="h-4 w-4 md:h-6 md:w-6 text-yellow-300" />
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {quickStats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <AnimatedCard 
            key={stat.label} 
            hoverAnimation={index % 2 === 0 ? 'bounce' : 'wiggle'}
            delay={index * 100}
            className="fun-hover cursor-pointer transition-all duration-300 hover:shadow-xl border-2 hover:border-primary/50 bg-gradient-subtle click-effect"
            onClick={() => navigate(stat.route)}
          >
            <CardContent className="p-4 text-center">
              <Icon className={`h-8 w-8 ${stat.color} mx-auto mb-2 animate-pulse`} />
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="text-sm text-muted-foreground font-medium">{stat.label}</div>
              <div className="text-xs text-primary font-medium mt-1">Click to explore</div>
            </CardContent>
          </AnimatedCard>
        );
      })}
      </div>

      {/* Dashboard Sections Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {dashboardSections.map((section, index) => {
          const Icon = section.icon;
          const isHovered = hoveredCard === section.id;
          
          // Different animation for each card based on position
          const animations = ['bounce', 'wiggle', 'float', 'zoom', 'rainbow'];
          const cardAnimation = animations[index % animations.length] as any;
          
          return (
            <AnimatedCard 
              key={section.id}
              hoverAnimation={cardAnimation}
              delay={index * 50}
              className={`group fun-hover cursor-pointer click-effect transition-all duration-500 hover:shadow-2xl border-2 hover:border-primary/50 relative overflow-hidden ${
                section.isHighlight ? 'animate-pulse border-orange-400' : ''
              }`}
              onMouseEnter={() => setHoveredCard(section.id)}
              onMouseLeave={() => setHoveredCard(null)}
              onClick={() => handleSectionClick(section.route, section.isHighlight)}
            >
              {/* Background Gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${section.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
              
              <CardHeader className="relative z-10 pb-2">
                <div className="flex items-center space-x-3">
                  <div className={`p-3 rounded-full bg-gradient-to-r ${section.color} transition-transform duration-300`}>
                    <Icon className={`h-6 w-6 text-white transition-transform duration-300 ${isHovered ? 'animate-bounce' : ''}`} />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-bold group-hover:text-primary transition-colors duration-300">
                      {section.title}
                    </CardTitle>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="relative z-10 space-y-4">
                <p className="text-muted-foreground font-medium">
                  {section.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <Badge 
                    variant="secondary" 
                    className={`font-semibold ${section.isHighlight ? 'bg-orange-100 text-orange-700 animate-pulse' : ''}`}
                  >
                    {section.stats}
                  </Badge>
                  
                  <AnimatedButton 
                    variant={section.isHighlight ? "default" : "outline"}
                    size="sm" 
                    animation={section.isHighlight ? 'bounce' : 'zoom'}
                    playAnimation={section.isHighlight}
                    className={`group-hover:scale-105 transition-all duration-300 font-bold ${
                      section.isHighlight 
                        ? 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white' 
                        : 'hover:bg-primary hover:text-white'
                    }`}
                  >
                    {section.action}
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </AnimatedButton>
                </div>
                
                {section.isHighlight && (
                  <div className="text-center">
                    <span className="text-xs font-bold text-orange-600 animate-bounce">
                      HOT! Don't miss out!
                    </span>
                  </div>
                )}
              </CardContent>
            </AnimatedCard>
          );
        })}
      </div>

      {/* Motivational Footer */}
      <Card className="bg-gradient-to-r from-green-400 to-blue-500 text-white border-0">
        <CardContent className="p-6 text-center">
          <div className="flex justify-center items-center space-x-2 mb-4">
            <Target className="h-6 w-6 animate-pulse" />
            <span className="text-2xl font-bold">You're doing AMAZING! 🌟</span>
            <Target className="h-6 w-6 animate-pulse" />
          </div>
          <p className="text-lg opacity-90">
            Every day is a new adventure. Keep exploring, keep learning, and keep being awesome! 🚀
          </p>
        </CardContent>
      </Card>

      {/* Confetti Effect */}
      <Confetti isActive={showConfetti} />

      {/* Quote Modal */}
      <QuoteModal 
        isOpen={showQuoteModal}
        onClose={() => setShowQuoteModal(false)}
        quote={dailyPhotoQuote}
        onNewQuote={loadNewPhotoQuote}
      />

      {/* Verification Dialog */}
      <Dialog open={showVerificationDialog} onOpenChange={setShowVerificationDialog}>
        <DialogContent className="sm:max-w-md">
          <AccountVerificationForm 
            userType="student"
            userId={user?.id}
            userName={userName}
            onVerificationComplete={() => {
              setShowVerificationDialog(false);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}