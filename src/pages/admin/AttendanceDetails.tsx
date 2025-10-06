import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Users, UserCheck, UserX, TrendingUp, BookOpen, Download } from "lucide-react";
import { parseStudentCSV } from '@/utils/csvParser';
import studentsCSV from '@/data/students.csv?raw';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";

const allStudents = parseStudentCSV(studentsCSV).map(row => ({
  id: row.id,
  name: row.name,
  email: row.email,
  class: row.class_id,
  stream: row.stream_id,
  photoUrl: row.photo_url
}));

// Mock attendance data
const generateMockAttendance = () => {
  const attendance: any = {};
  allStudents.forEach(student => {
    const rand = Math.random();
    attendance[student.id] = {
      status: rand > 0.85 ? 'not-marked' : (rand > 0.15 ? 'present' : 'absent'),
      timeMarked: rand > 0.85 ? null : new Date().toISOString()
    };
  });
  return attendance;
};

const AttendanceDetails = () => {
  const { userRole, userName, photoUrl, signOut } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [attendanceData] = useState(generateMockAttendance());

  const filter = searchParams.get('filter');
  const classId = searchParams.get('class');

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Failed to logout:", error);
    }
  };

  // Filter students based on query params
  let filteredStudents = allStudents;
  let title = "All Students Attendance";
  
  if (classId) {
    filteredStudents = allStudents.filter(s => s.stream === classId);
    title = `${classId.replace('-', ' - ')} Attendance Details`;
  } else if (filter === 'present') {
    filteredStudents = allStudents.filter(s => attendanceData[s.id]?.status === 'present');
    title = "Present Students";
  } else if (filter === 'absent') {
    filteredStudents = allStudents.filter(s => attendanceData[s.id]?.status === 'absent');
    title = "Absent Students";
  } else if (filter === 'pending') {
    filteredStudents = allStudents.filter(s => attendanceData[s.id]?.status === 'not-marked');
    title = "Pending Attendance";
  }

  const studentList = filteredStudents.map(student => ({
    ...student,
    status: attendanceData[student.id]?.status || 'not-marked',
    timeMarked: attendanceData[student.id]?.timeMarked
  }));

  // Calculate stats for this view
  const totalStudents = studentList.length;
  const presentCount = studentList.filter(s => s.status === 'present').length;
  const absentCount = studentList.filter(s => s.status === 'absent').length;
  const pendingCount = studentList.filter(s => s.status === 'not-marked').length;
  const attendanceRate = totalStudents > 0 ? Math.round((presentCount / totalStudents) * 100) : 0;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'present':
        return (
          <Badge className="bg-emerald-500/10 text-emerald-700 border-emerald-200">
            <UserCheck className="h-3 w-3 mr-1" />
            Present
          </Badge>
        );
      case 'absent':
        return (
          <Badge className="bg-red-500/10 text-red-700 border-red-200">
            <UserX className="h-3 w-3 mr-1" />
            Absent
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="text-yellow-700 border-yellow-200 bg-yellow-50">
            Pending
          </Badge>
        );
    }
  };

  if (!userRole) return null;

  return (
    <DashboardLayout
      userRole={userRole}
      userName={userName || "Admin"}
      photoUrl={photoUrl}
      onLogout={handleLogout}
    >
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-elegant bg-clip-text text-transparent">
                {title}
              </h1>
              <p className="text-muted-foreground mt-1">
                Detailed attendance information and records
              </p>
            </div>
          </div>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="hover-scale border-l-4 border-l-primary">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Students</p>
                  <h3 className="text-3xl font-bold mt-2">{totalStudents}</h3>
                </div>
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Users className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover-scale border-l-4 border-l-emerald-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Present</p>
                  <h3 className="text-3xl font-bold mt-2 text-emerald-600">{presentCount}</h3>
                </div>
                <div className="h-12 w-12 rounded-full bg-emerald-500/10 flex items-center justify-center">
                  <UserCheck className="h-6 w-6 text-emerald-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover-scale border-l-4 border-l-red-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Absent</p>
                  <h3 className="text-3xl font-bold mt-2 text-red-600">{absentCount}</h3>
                </div>
                <div className="h-12 w-12 rounded-full bg-red-500/10 flex items-center justify-center">
                  <UserX className="h-6 w-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover-scale border-l-4 border-l-blue-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Attendance Rate</p>
                  <h3 className="text-3xl font-bold mt-2 text-blue-600">{attendanceRate}%</h3>
                </div>
                <div className="h-12 w-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Student List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Student List
            </CardTitle>
            <CardDescription>
              {totalStudents} student{totalStudents !== 1 ? 's' : ''} in this view
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-[600px] overflow-y-auto">
              {studentList.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No students found
                </div>
              ) : (
                studentList.map((student) => (
                  <div
                    key={student.id}
                    className="flex items-center gap-4 p-4 rounded-lg border bg-card hover:bg-accent/20 transition-colors"
                  >
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={student.photoUrl} alt={student.name} />
                      <AvatarFallback>
                        {student.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold truncate">{student.name}</h4>
                      <p className="text-sm text-muted-foreground truncate">{student.email}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {student.class} - {student.stream}
                      </p>
                    </div>

                    <div className="flex flex-col items-end gap-1">
                      {getStatusBadge(student.status)}
                      {student.timeMarked && (
                        <span className="text-xs text-muted-foreground">
                          {new Date(student.timeMarked).toLocaleTimeString()}
                        </span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AttendanceDetails;
