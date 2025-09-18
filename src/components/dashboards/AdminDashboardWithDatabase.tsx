import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Users, 
  GraduationCap, 
  BookOpen, 
  DollarSign,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  CheckCircle,
  BarChart3,
  Calendar,
  Building,
  Activity,
  Shield,
  Mail,
  Loader2,
  Vote
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { AccountVerificationForm } from "@/components/auth/AccountVerificationForm";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

interface DatabaseStats {
  totalStudents: number;
  totalTeachers: number;
  totalClasses: number;
  totalStreams: number;
}

export function AdminDashboard() {
  const { userName, isVerified, personalEmail, user, isLoading } = useAuth();
  const [showVerificationDialog, setShowVerificationDialog] = useState(false);
  const [stats, setStats] = useState<DatabaseStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setStatsLoading(true);
      
      console.log('Fetching dashboard stats...');
      
      // Use count queries instead of selecting all records to avoid the 1000 row limit
      const [studentsResult, teachersResult, classesResult, streamsResult] = await Promise.all([
        supabase.from('students').select('*', { count: 'exact', head: true }),
        supabase.from('teachers').select('*', { count: 'exact', head: true }),
        supabase.from('classes').select('*', { count: 'exact', head: true }),
        supabase.from('streams').select('*', { count: 'exact', head: true })
      ]);

      console.log('Stats results:', {
        students: studentsResult,
        teachers: teachersResult,
        classes: classesResult,
        streams: streamsResult
      });

      // Check for errors and set counts using the count property
      if (studentsResult.error) console.error('Students query error:', studentsResult.error);
      if (teachersResult.error) console.error('Teachers query error:', teachersResult.error);
      if (classesResult.error) console.error('Classes query error:', classesResult.error);
      if (streamsResult.error) console.error('Streams query error:', streamsResult.error);

      setStats({
        totalStudents: studentsResult.count || 0,
        totalTeachers: teachersResult.count || 0,
        totalClasses: classesResult.count || 0,
        totalStreams: streamsResult.count || 0
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      setStats({
        totalStudents: 0,
        totalTeachers: 0,
        totalClasses: 0,
        totalStreams: 0
      });
    } finally {
      setStatsLoading(false);
    }
  };

  // Show loading state while authentication is being resolved
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  const dashboardStats = stats ? [
    { 
      title: "Total Students", 
      value: stats.totalStudents.toString(), 
      icon: GraduationCap, 
      change: "+12%",
      trend: "up",
      color: "text-primary",
      route: "/admin/students"
    },
    { 
      title: "Total Teachers", 
      value: stats.totalTeachers.toString(), 
      icon: Users, 
      change: "+5%",
      trend: "up",
      color: "text-secondary",
      route: "/admin/teachers"
    },
    { 
      title: "Total Classes", 
      value: stats.totalClasses.toString(), 
      icon: BookOpen, 
      change: "+8%",
      trend: "up",
      color: "text-success",
      route: "/admin/classes"
    },
    { 
      title: "Total Streams", 
      value: stats.totalStreams.toString(), 
      icon: Building, 
      change: "+2%",
      trend: "up",
      color: "text-warning",
      route: "/admin/streams"
    },
  ] : [];

  const handleCardClick = (route: string) => {
    navigate(route);
  };

  const recentActivities = [
    { action: "New student enrolled", user: "John Doe", time: "2 minutes ago", type: "student" },
    { action: "Teacher joined", user: "Dr. Sarah Smith", time: "1 hour ago", type: "teacher" },
    { action: "Course created", user: "Advanced Physics", time: "3 hours ago", type: "course" },
    { action: "Payment received", user: "$1,250 from Grade 11", time: "5 hours ago", type: "payment" },
    { action: "Report generated", user: "Monthly Performance", time: "Yesterday", type: "report" },
  ];

  const departmentStats = [
    { name: "Mathematics", teachers: 25, students: 520, performance: 85 },
    { name: "Science", teachers: 22, students: 480, performance: 82 },
    { name: "English", teachers: 20, students: 510, performance: 88 },
    { name: "History", teachers: 18, students: 420, performance: 79 },
    { name: "Computer Science", teachers: 15, students: 380, performance: 91 },
  ];

  const upcomingEvents = [
    { event: "Parent-Teacher Meeting", date: "March 15", status: "upcoming" },
    { event: "Mid-term Examinations", date: "March 20-25", status: "upcoming" },
    { event: "Sports Day", date: "April 2", status: "planned" },
    { event: "Annual Function", date: "April 15", status: "planned" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Admin Dashboard</h2>
          <p className="text-muted-foreground">Complete overview of Glorious Schools</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">Generate Report</Button>
          <Button className="bg-gradient-primary">Add New User</Button>
        </div>
      </div>


      {/* Verification Dialog */}
      <Dialog open={showVerificationDialog} onOpenChange={setShowVerificationDialog}>
        <DialogContent className="sm:max-w-md">
          <AccountVerificationForm 
            userType="admin"
            userId="00000000-0000-0000-0000-000000000001"
            userName={userName}
            onVerificationComplete={() => {
              setShowVerificationDialog(false);
            }}
          />
        </DialogContent>
      </Dialog>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statsLoading ? (
          // Show skeleton loading for stats
          Array.from({ length: 4 }).map((_, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16 mb-2" />
                <Skeleton className="h-4 w-20" />
              </CardContent>
            </Card>
          ))
        ) : (
          dashboardStats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card 
                key={stat.title} 
                className="cursor-pointer hover:shadow-md transition-shadow hover:scale-105 transform duration-200"
                onClick={() => handleCardClick(stat.route)}
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Click to view details
                  </p>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* Electoral Applications Management */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Vote className="h-5 w-5" />
              Electoral Applications
            </span>
            <Button size="sm" variant="outline" onClick={() => navigate('/admin/electoral')}>
              Manage Applications
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Review and manage student applications for leadership positions
          </p>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg">
              <p className="text-2xl font-bold text-yellow-600">-</p>
              <p className="text-sm text-yellow-700 dark:text-yellow-400">Pending Review</p>
            </div>
            <div className="text-center p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
              <p className="text-2xl font-bold text-green-600">-</p>
              <p className="text-sm text-green-700 dark:text-green-400">Confirmed</p>
            </div>
            <div className="text-center p-4 bg-red-50 dark:bg-red-950/20 rounded-lg">
              <p className="text-2xl font-bold text-red-600">-</p>
              <p className="text-sm text-red-700 dark:text-red-400">Rejected</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Recent Activities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="h-2 w-2 rounded-full bg-gradient-primary" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">{activity.user} • {activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Upcoming Events
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingEvents.map((event, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                  <div>
                    <p className="font-medium">{event.event}</p>
                    <p className="text-sm text-muted-foreground">{event.date}</p>
                  </div>
                  <Badge variant={event.status === "upcoming" ? "default" : "secondary"}>
                    {event.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              Department Overview
            </span>
            <Button size="sm" variant="outline">View Details</Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {departmentStats.map((dept, index) => (
              <div key={index} className="grid grid-cols-4 gap-4 p-3 rounded-lg bg-muted/30">
                <div>
                  <p className="font-medium">{dept.name}</p>
                  <p className="text-sm text-muted-foreground">Department</p>
                </div>
                <div>
                  <p className="font-semibold">{dept.teachers}</p>
                  <p className="text-sm text-muted-foreground">Teachers</p>
                </div>
                <div>
                  <p className="font-semibold">{dept.students}</p>
                  <p className="text-sm text-muted-foreground">Students</p>
                </div>
                <div className="flex items-center gap-2">
                  <p className="font-semibold">{dept.performance}%</p>
                  {dept.performance >= 85 ? (
                    <CheckCircle className="h-4 w-4 text-success" />
                  ) : dept.performance >= 75 ? (
                    <AlertCircle className="h-4 w-4 text-warning" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-destructive" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}