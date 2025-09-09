import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
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
  Loader2
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { AccountVerificationForm } from "@/components/auth/AccountVerificationForm";
import { Dialog, DialogContent } from "@/components/ui/dialog";

export function TeacherDashboard() {
  const { userName, isVerified, personalEmail, user, isLoading } = useAuth();
  const [showVerificationDialog, setShowVerificationDialog] = useState(false);

  // Show loading state while authentication is being resolved
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground">Loading teacher dashboard...</p>
        </div>
      </div>
    );
  }
  const stats = [
    { 
      title: "Total Students", 
      value: "156", 
      icon: Users, 
      description: "Across all classes",
      color: "text-primary" 
    },
    { 
      title: "Classes Today", 
      value: "5", 
      icon: BookOpen, 
      description: "3 completed",
      color: "text-secondary" 
    },
    { 
      title: "Assignments to Grade", 
      value: "23", 
      icon: ClipboardList, 
      description: "Due this week",
      color: "text-warning" 
    },
    { 
      title: "Average Performance", 
      value: "82%", 
      icon: TrendingUp, 
      description: "All classes",
      color: "text-success" 
    },
  ];

  const todaysClasses = [
    { time: "08:00 AM", subject: "Mathematics", class: "Grade 10A", room: "Room 201", status: "completed" },
    { time: "09:30 AM", subject: "Algebra", class: "Grade 11B", room: "Room 203", status: "completed" },
    { time: "11:00 AM", subject: "Calculus", class: "Grade 12A", room: "Room 205", status: "completed" },
    { time: "01:00 PM", subject: "Geometry", class: "Grade 10B", room: "Room 201", status: "current" },
    { time: "02:30 PM", subject: "Statistics", class: "Grade 11A", room: "Room 204", status: "upcoming" },
  ];

  const recentSubmissions = [
    { student: "John Smith", class: "Grade 10A", assignment: "Quiz 3", status: "pending" },
    { student: "Emma Wilson", class: "Grade 11B", assignment: "Homework 5", status: "graded" },
    { student: "Michael Brown", class: "Grade 12A", assignment: "Project 1", status: "pending" },
    { student: "Sarah Davis", class: "Grade 10B", assignment: "Test 2", status: "graded" },
  ];

  const classPerformance = [
    { class: "Grade 10A", average: 85, students: 32 },
    { class: "Grade 10B", average: 78, students: 30 },
    { class: "Grade 11A", average: 82, students: 31 },
    { class: "Grade 11B", average: 88, students: 33 },
    { class: "Grade 12A", average: 79, students: 30 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Teacher Dashboard</h2>
        <p className="text-muted-foreground">Manage your classes and track student progress</p>
      </div>


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
              {todaysClasses.map((class_, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{class_.subject} - {class_.class}</p>
                      <p className="text-sm text-muted-foreground">{class_.time} • {class_.room}</p>
                    </div>
                  </div>
                  {class_.status === "completed" && <CheckCircle className="h-4 w-4 text-success" />}
                  {class_.status === "current" && (
                    <Badge className="bg-gradient-primary">In Progress</Badge>
                  )}
                  {class_.status === "upcoming" && <Clock className="h-4 w-4 text-muted-foreground" />}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <ClipboardList className="h-5 w-5" />
                Recent Submissions
              </span>
              <Button size="sm" variant="outline">View All</Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentSubmissions.map((submission, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                  <div>
                    <p className="font-medium">{submission.student}</p>
                    <p className="text-sm text-muted-foreground">
                      {submission.class} • {submission.assignment}
                    </p>
                  </div>
                  <Badge variant={submission.status === "graded" ? "default" : "secondary"}>
                    {submission.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart className="h-5 w-5" />
            Class Performance Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {classPerformance.map((class_, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{class_.class}</p>
                    <p className="text-sm text-muted-foreground">{class_.students} students</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{class_.average}%</span>
                    {class_.average >= 85 ? (
                      <TrendingUp className="h-4 w-4 text-success" />
                    ) : class_.average >= 75 ? (
                      <AlertCircle className="h-4 w-4 text-warning" />
                    ) : (
                      <XCircle className="h-4 w-4 text-destructive" />
                    )}
                  </div>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="h-2 rounded-full bg-gradient-primary"
                    style={{ width: `${class_.average}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Dialog open={showVerificationDialog} onOpenChange={setShowVerificationDialog}>
        <DialogContent className="max-w-md">
          <AccountVerificationForm userType="teacher" />
        </DialogContent>
      </Dialog>
    </div>
  );
}