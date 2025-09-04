import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  Activity
} from "lucide-react";

export function AdminDashboard() {
  const stats = [
    { 
      title: "Total Students", 
      value: "2,847", 
      icon: GraduationCap, 
      change: "+12%",
      trend: "up",
      color: "text-primary" 
    },
    { 
      title: "Total Teachers", 
      value: "156", 
      icon: Users, 
      change: "+5%",
      trend: "up",
      color: "text-secondary" 
    },
    { 
      title: "Active Courses", 
      value: "89", 
      icon: BookOpen, 
      change: "+8%",
      trend: "up",
      color: "text-success" 
    },
    { 
      title: "Revenue (Monthly)", 
      value: "$124,500", 
      icon: DollarSign, 
      change: "-3%",
      trend: "down",
      color: "text-warning" 
    },
  ];

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
                <div className="flex items-center text-xs">
                  {stat.trend === "up" ? (
                    <TrendingUp className="h-3 w-3 text-success mr-1" />
                  ) : (
                    <TrendingDown className="h-3 w-3 text-destructive mr-1" />
                  )}
                  <span className={stat.trend === "up" ? "text-success" : "text-destructive"}>
                    {stat.change}
                  </span>
                  <span className="text-muted-foreground ml-1">from last month</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

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