import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { 
  BookOpen, 
  ClipboardList, 
  Award, 
  Calendar,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Shield,
  Mail,
  Loader2,
  Vote
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { AccountVerificationForm } from "@/components/auth/AccountVerificationForm";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";

// Import election images
import election1 from "@/assets/election-1.jpg";
import election2 from "@/assets/election-2.jpg";
import election3 from "@/assets/election-3.jpg";
import election4 from "@/assets/election-4.jpg";

export function StudentDashboard() {
  const { userName, isVerified, personalEmail, user, isLoading } = useAuth();
  const navigate = useNavigate();
  const [showVerificationDialog, setShowVerificationDialog] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [carouselApi, setCarouselApi] = useState<any>(null);

  useEffect(() => {
    if (!carouselApi) return;

    carouselApi.on("select", () => {
      setCurrentSlide(carouselApi.selectedScrollSnap());
    });
  }, [carouselApi]);

  // Election carousel data
  const electionSlides = [
    {
      image: election1,
      title: "🗳️ Election Time!",
      text: "At Glorious, democracy is the power of the pupils for the pupils by the pupils."
    },
    {
      image: election2,
      title: "Your Voice Matters",
      text: "At Glorious, we believe in democracy so pupils exercise their rights of choosing their own leaders."
    },
    {
      image: election3,
      title: "Make Every Vote Count",
      text: "Every election you don't participate in is a vote lost."
    },
    {
      image: election4,
      title: "#PupilPower ✊",
      text: "Democracy thrives when every student participates in shaping their future."
    }
  ];

  // Show loading state while authentication is being resolved
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }
  
  const stats = [
    { 
      title: "Current GPA", 
      value: "3.75", 
      icon: TrendingUp, 
      description: "Out of 4.0",
      color: "text-success" 
    },
    { 
      title: "Courses Enrolled", 
      value: "6", 
      icon: BookOpen, 
      description: "This semester",
      color: "text-primary" 
    },
    { 
      title: "Assignments Due", 
      value: "4", 
      icon: ClipboardList, 
      description: "This week",
      color: "text-warning" 
    },
    { 
      title: "Attendance", 
      value: "92%", 
      icon: Award, 
      description: "Overall",
      color: "text-secondary" 
    },
  ];

  const upcomingClasses = [
    { time: "09:00 AM", subject: "Mathematics", room: "Room 201", status: "upcoming" },
    { time: "10:30 AM", subject: "Physics", room: "Lab 3", status: "upcoming" },
    { time: "12:00 PM", subject: "English Literature", room: "Room 105", status: "upcoming" },
    { time: "02:00 PM", subject: "Computer Science", room: "Lab 1", status: "current" },
  ];

  const recentGrades = [
    { subject: "Mathematics", assignment: "Quiz 3", grade: "A", percentage: 92 },
    { subject: "Physics", assignment: "Lab Report", grade: "B+", percentage: 87 },
    { subject: "English", assignment: "Essay", grade: "A-", percentage: 90 },
    { subject: "Computer Science", assignment: "Project 1", grade: "A", percentage: 95 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Welcome back, {userName || 'Student'}!</h2>
        <p className="text-muted-foreground">Here's an overview of your academic progress</p>
      </div>

      {/* Election Carousel */}
      <div className="relative overflow-hidden rounded-xl animate-fade-in">
        <Carousel 
          className="w-full" 
          opts={{ align: "start", loop: true }}
          plugins={[Autoplay({ delay: 4000 })]}
          setApi={setCarouselApi}
        >
          <CarouselContent>
            {electionSlides.map((slide, index) => (
              <CarouselItem key={index}>
                <div className="relative h-72 md:h-96 overflow-hidden rounded-xl">
                  {/* Background Image */}
                  <img 
                    src={slide.image} 
                    alt={`Election slide ${index + 1}`}
                    className="absolute inset-0 w-full h-full object-cover object-center"
                  />
                  
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/70 to-black/50"></div>
                  
                  {/* Content Overlay */}
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full space-y-4 md:space-y-6 px-6 md:px-12">
                      {/* Centered Heading */}
                      <div className="flex items-center justify-center gap-2 md:gap-3">
                        <Vote className="h-6 w-6 md:h-8 md:w-8 text-white animate-pulse" />
                        <h3 className="text-xl md:text-3xl font-bold text-white animate-fade-in">
                          {slide.title}
                        </h3>
                        <Vote className="h-6 w-6 md:h-8 md:w-8 text-white animate-pulse" />
                      </div>
                      
                      {/* Centered Text */}
                      <div className="max-w-2xl mx-auto text-center">
                        <p className="text-sm md:text-lg text-white/90 font-medium leading-relaxed animate-fade-in">
                          {slide.text}
                        </p>
                      </div>
                      
                      {/* Centered Button */}
                      <div className="pt-2 md:pt-4 text-center">
                        <Button 
                          size="lg" 
                          className="bg-gradient-to-r from-orange-500 via-orange-600 to-orange-700 hover:from-orange-600 hover:via-orange-700 hover:to-orange-800 text-white border-0 shadow-lg hover:shadow-xl animate-pulse font-bold text-sm md:text-lg px-6 md:px-10 py-2 md:py-3 transition-all duration-500"
                          onClick={() => navigate('/electoral')}
                        >
                          <Vote className="h-4 w-4 md:h-5 md:w-5 mr-2" />
                          VOTE NOW
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
        
        {/* Dot Indicators */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {electionSlides.map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-all duration-300 ${
                currentSlide === index 
                  ? 'bg-white shadow-lg' 
                  : 'bg-white/40 hover:bg-white/70'
              }`}
              onClick={() => carouselApi?.scrollTo(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>


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

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Today's Schedule
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingClasses.map((class_, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{class_.subject}</p>
                      <p className="text-sm text-muted-foreground">{class_.time} - {class_.room}</p>
                    </div>
                  </div>
                  {class_.status === "current" && (
                    <Badge variant="default" className="bg-gradient-primary">In Progress</Badge>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Recent Grades
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentGrades.map((grade, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{grade.subject}</p>
                      <p className="text-sm text-muted-foreground">{grade.assignment}</p>
                    </div>
                    <Badge variant={grade.percentage >= 90 ? "default" : "secondary"}>
                      {grade.grade}
                    </Badge>
                  </div>
                  <Progress value={grade.percentage} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ClipboardList className="h-5 w-5" />
            Pending Assignments
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { subject: "Mathematics", title: "Problem Set 5", due: "Tomorrow", priority: "high" },
              { subject: "Physics", title: "Lab Report 3", due: "In 3 days", priority: "medium" },
              { subject: "English", title: "Book Review", due: "In 5 days", priority: "low" },
              { subject: "Computer Science", title: "Coding Assignment", due: "Next week", priority: "medium" },
            ].map((assignment, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex items-center gap-3">
                  {assignment.priority === "high" ? (
                    <AlertCircle className="h-4 w-4 text-destructive" />
                  ) : (
                    <CheckCircle className="h-4 w-4 text-muted-foreground" />
                  )}
                  <div>
                    <p className="font-medium">{assignment.title}</p>
                    <p className="text-sm text-muted-foreground">{assignment.subject} • Due {assignment.due}</p>
                  </div>
                </div>
                <Badge variant={
                  assignment.priority === "high" ? "destructive" : 
                  assignment.priority === "medium" ? "default" : "secondary"
                }>
                  {assignment.priority}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}