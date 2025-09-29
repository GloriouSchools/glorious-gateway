import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { ProfessionalCard } from "@/components/ui/professional-card";
import { ProfessionalButton } from "@/components/ui/professional-button";
import { QuoteModal } from "@/components/ui/quote-modal";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { getQuoteOfTheDay, getRandomPhotoQuote, PhotoQuote } from "@/utils/photoQuotes";
import { formatGreetingName, getTimeBasedGreeting } from "@/utils/greetingUtils";
import { format } from "date-fns";
import { toZonedTime } from "date-fns-tz";
import { 
  Users, 
  BookOpen, 
  ClipboardList, 
  Calendar,
  Clock,
  TrendingUp,
  CheckCircle,
  XCircle,
  AlertCircle,
  BarChart,
  Shield,
  Mail,
  Loader2,
  Sparkles,
  Star,
  Heart,
  Smile,
  ArrowRight,
  Target,
  GraduationCap,
  UserCheck,
  FileText,
  Settings
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { AccountVerificationForm } from "@/components/auth/AccountVerificationForm";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";
import { Confetti } from "@/components/ui/confetti";

export function TeacherDashboard() {
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
    setGreeting(getTimeBasedGreeting());
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

  // Function to load a new random quote
  const loadNewPhotoQuote = () => {
    try {
      setQuoteLoading(true);
      const photoQuote = getRandomPhotoQuote();
      setDailyPhotoQuote(photoQuote);
    } catch (error) {
      console.log('Error loading new photo quote:', error);
      // Fallback to a default image or text
      setDailyPhotoQuote({ 
        src: "/placeholder.svg", 
        alt: "Inspirational quote" 
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
          <p className="text-lg font-semibold text-muted-foreground">Loading your teaching dashboard...</p>
        </div>
      </div>
    );
  }

  const teacherSections = [
    {
      id: 'dashboard',
      title: 'Dashboard',
      description: 'Your main teaching hub',
      icon: Target,
      color: 'from-blue-400 to-cyan-400',
      stats: 'Overview',
      action: 'View Dashboard',
      route: '/teacher'
    },
    {
      id: 'classes',
      title: 'My Classes',
      description: 'Manage all your teaching classes',
      icon: GraduationCap,
      color: 'from-green-400 to-emerald-400',
      stats: '5 Active Classes',
      action: 'View Classes',
      route: '/teacher/classes'
    },
    {
      id: 'students',
      title: 'Students',
      description: 'View and manage your students',
      icon: Users,
      color: 'from-purple-400 to-pink-400',
      stats: '156 Students',
      action: 'View Students',
      route: '/teacher/students'
    },
    {
      id: 'assignments',
      title: 'Assignments',
      description: 'Create and manage assignments',
      icon: ClipboardList,
      color: 'from-orange-400 to-red-400',
      stats: '23 Pending',
      action: 'Manage Assignments',
      route: '/teacher/assignments'
    },
    {
      id: 'grades',
      title: 'Grades',
      description: 'Grade work and track progress',
      icon: TrendingUp,
      color: 'from-teal-400 to-green-400',
      stats: 'Assessment',
      action: 'View Grades',
      route: '/teacher/grades'
    },
    {
      id: 'schedule',
      title: 'Schedule',
      description: 'Your teaching timetable',
      icon: Calendar,
      color: 'from-indigo-400 to-purple-400',
      stats: '5 Classes Today',
      action: 'View Schedule',
      route: '/teacher/schedule'
    },
    {
      id: 'attendance',
      title: 'Attendance',
      description: 'Take roll call and track attendance',
      icon: UserCheck,
      color: 'from-emerald-400 to-teal-400',
      stats: 'Today\'s Classes',
      action: 'Take Attendance',
      route: '/teacher/attendance',
      isHighlight: true
    },
    {
      id: 'messages',
      title: 'Messages',
      description: 'Communicate with students and staff',
      icon: Mail,
      color: 'from-pink-400 to-rose-400',
      stats: 'Communication',
      action: 'View Messages',
      route: '/teacher/messages'
    },
    {
      id: 'reports',
      title: 'Reports',
      description: 'Generate and view class reports',
      icon: FileText,
      color: 'from-gray-400 to-slate-400',
      stats: 'Performance Data',
      action: 'View Reports',
      route: '/teacher/reports'
    }
  ];

  const quickStats = [
    { label: 'Total Students', value: '156', icon: GraduationCap, color: 'text-blue-500', route: '/teacher/classes', clickable: true },
    { label: 'Classes Today', value: '5', icon: BookOpen, color: 'text-green-500', route: '/teacher/schedule', clickable: true },
    { label: 'Pending Grades', value: '23', icon: ClipboardList, color: 'text-orange-500', route: '/teacher/grades', clickable: true },
    { label: 'Average Score', value: '82%', icon: TrendingUp, color: 'text-purple-500', route: '/teacher/grades', clickable: true }
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
      <ScrollReveal animation="fadeInUp" delay={100}>
        <div className="relative overflow-hidden rounded-2xl md:rounded-3xl bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 p-4 md:p-6 text-white">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative z-10 text-center space-y-2 md:space-y-3">
            <div className="flex justify-center items-center space-x-2 mb-2">
              <GraduationCap className="h-5 w-5 text-white/80" />
              <span className="text-sm font-medium tracking-wider">TEACHER PORTAL</span>
              <GraduationCap className="h-5 w-5 text-white/80" />
            </div>
            <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold animate-slide-in-right">
              {greeting}, {formatGreetingName(userName || '', 'teacher') || 'Teacher'}! 
            </h1>
            <p className="text-sm md:text-lg lg:text-xl font-medium opacity-90">
              Teaching Management System
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
                    <p className="text-sm text-white font-medium bg-black/50 px-3 py-1 rounded-full backdrop-blur-sm">Click to view</p>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Professional Corner Elements - Hidden on mobile */}
          <div className="hidden md:block absolute top-4 left-4 opacity-20">
            <BookOpen className="h-5 w-5 text-white" />
          </div>
          <div className="hidden md:block absolute top-4 right-4 opacity-20">
            <Users className="h-5 w-5 text-white" />
          </div>
        </div>
      </ScrollReveal>

      {/* Quick Stats */}
      <ScrollReveal animation="fadeInUp" delay={200}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <ProfessionalCard 
                key={stat.label} 
                variant="elevated"
                onClick={() => navigate(stat.route)}
              >
                <CardContent className="p-4 text-center">
                  <Icon className={`h-8 w-8 ${stat.color} mx-auto mb-2`} />
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="text-sm text-muted-foreground font-medium">{stat.label}</div>
                  <div className="text-xs text-primary font-medium mt-1">View details</div>
                </CardContent>
              </ProfessionalCard>
            );
          })}
        </div>
      </ScrollReveal>

      {/* Dashboard Sections Grid */}
      <ScrollReveal animation="fadeInUp" delay={300}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {teacherSections.map((section, index) => {
            const Icon = section.icon;
            const isHovered = hoveredCard === section.id;
            
            return (
              <ProfessionalCard 
                key={section.id}
                variant="bordered"
                className={`group relative overflow-hidden ${
                  section.isHighlight ? 'border-primary/50 bg-primary/5' : ''
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
                      <Icon className="h-6 w-6 text-white" />
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
                    
                    <ProfessionalButton 
                      variant={section.isHighlight ? "default" : "outline"}
                      size="sm" 
                      className={`font-medium ${
                        section.isHighlight 
                          ? 'bg-primary hover:bg-primary/90' 
                          : ''
                      }`}
                    >
                      {section.action}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </ProfessionalButton>
                  </div>
                  
                  {section.isHighlight && (
                    <div className="text-center">
                      <span className="text-xs font-medium text-primary">
                        Action Required
                      </span>
                    </div>
                  )}
                </CardContent>
              </ProfessionalCard>
            );
          })}
        </div>
      </ScrollReveal>

      {/* Motivational Footer */}
      <ScrollReveal animation="fadeInUp" delay={400}>
        <Card className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white border-0">
          <CardContent className="p-6 text-center">
            <div className="flex justify-center items-center space-x-2 mb-4">
              <Target className="h-6 w-6" />
              <span className="text-xl font-semibold">Excellence in Education</span>
              <Target className="h-6 w-6" />
            </div>
            <p className="text-lg opacity-90">
              Your dedication to teaching makes a lasting impact on every student's future.
            </p>
          </CardContent>
        </Card>
      </ScrollReveal>

      {/* Quote Modal */}
      <QuoteModal 
        isOpen={showQuoteModal}
        onClose={() => setShowQuoteModal(false)}
        quote={dailyPhotoQuote}
        onNewQuote={loadNewPhotoQuote}
      />

      <Dialog open={showVerificationDialog} onOpenChange={setShowVerificationDialog}>
        <DialogContent className="max-w-md">
          <AccountVerificationForm userType="teacher" />
        </DialogContent>
      </Dialog>
    </div>
  );
}