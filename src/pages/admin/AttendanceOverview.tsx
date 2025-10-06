import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Download, Filter, BarChart3, ChevronLeft, ChevronRight } from "lucide-react";
import { AttendanceStats } from "@/components/attendance/AttendanceStats";
import { ClassAttendanceTable } from "@/components/attendance/ClassAttendanceTable";
import { StudentAttendanceList } from "@/components/attendance/StudentAttendanceList";
import { format, addDays } from "date-fns";
import { parseStudentCSV } from '@/utils/csvParser';
import studentsCSV from '@/data/students.csv?raw';

// Parse student data
const allStudents = parseStudentCSV(studentsCSV).map(row => ({
  id: row.id,
  name: row.name,
  email: row.email,
  class: row.class_id,
  stream: row.stream_id,
  photoUrl: row.photo_url
}));

// Build class list
const buildClassList = () => {
  const classMap = new Map();
  allStudents.forEach(student => {
    if (!classMap.has(student.stream)) {
      classMap.set(student.stream, {
        id: student.stream,
        name: student.stream.replace('-', ' - '),
        students: []
      });
    }
    classMap.get(student.stream).students.push(student);
  });
  return Array.from(classMap.values()).sort((a, b) => a.id.localeCompare(b.id));
};

const classList = buildClassList();

// Mock attendance data - In real app, this would come from backend
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

const AttendanceOverview = () => {
  const { userRole, userName, photoUrl, signOut } = useAuth();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [attendanceData] = useState(generateMockAttendance());

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Failed to logout:", error);
    }
  };

  const navigateDate = (direction: 'prev' | 'next') => {
    setSelectedDate(prev => addDays(prev, direction === 'next' ? 1 : -1));
  };

  // Calculate overall statistics
  const totalStudents = allStudents.length;
  const presentCount = Object.values(attendanceData).filter((a: any) => a.status === 'present').length;
  const absentCount = Object.values(attendanceData).filter((a: any) => a.status === 'absent').length;
  const pendingCount = Object.values(attendanceData).filter((a: any) => a.status === 'not-marked').length;
  const attendanceRate = Math.round((presentCount / totalStudents) * 100);

  // Calculate class-wise data
  const classData = classList.map(cls => {
    const classStudents = cls.students;
    const present = classStudents.filter(s => attendanceData[s.id]?.status === 'present').length;
    const absent = classStudents.filter(s => attendanceData[s.id]?.status === 'absent').length;
    
    return {
      id: cls.id,
      name: cls.name,
      totalStudents: classStudents.length,
      present,
      absent,
      attendanceRate: Math.round((present / classStudents.length) * 100)
    };
  });

  // Student attendance list
  const studentAttendanceList = allStudents.map(student => ({
    ...student,
    status: attendanceData[student.id]?.status || 'not-marked',
    timeMarked: attendanceData[student.id]?.timeMarked
  }));

  const handleClassClick = (classId: string) => {
    window.location.href = `/admin/attendance/details?class=${classId}`;
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
          <div>
            <h1 className="text-3xl font-bold bg-gradient-elegant bg-clip-text text-transparent">
              Attendance Overview
            </h1>
            <p className="text-muted-foreground mt-1">
              Monitor and analyze attendance across the entire school
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Date Selection */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm font-medium text-muted-foreground">Viewing Date:</span>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => navigateDate('prev')}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="font-semibold min-w-[200px] text-center">
                  {format(selectedDate, 'EEEE, MMMM d, yyyy')}
                </span>
                <Button variant="outline" size="sm" onClick={() => navigateDate('next')}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
              <Select value={selectedFilter} onValueChange={setSelectedFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Students</SelectItem>
                  <SelectItem value="present">Present Only</SelectItem>
                  <SelectItem value="absent">Absent Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Statistics Cards */}
        <AttendanceStats
          totalStudents={totalStudents}
          present={presentCount}
          absent={absentCount}
          pending={pendingCount}
          attendanceRate={attendanceRate}
        />

        {/* Class-wise Table */}
        <ClassAttendanceTable classData={classData} onClassClick={handleClassClick} />

        {/* Student List */}
        <StudentAttendanceList students={studentAttendanceList} />
      </div>
    </DashboardLayout>
  );
};

export default AttendanceOverview;
