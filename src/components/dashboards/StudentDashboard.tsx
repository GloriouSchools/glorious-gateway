import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
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
  Loader2
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { AccountVerificationForm } from "@/components/auth/AccountVerificationForm";
import { Dialog, DialogContent } from "@/components/ui/dialog";

export function StudentDashboard() {
  const { userName, isVerified, personalEmail, user, isLoading } = useAuth();
  const [showVerificationDialog, setShowVerificationDialog] = useState(false);

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