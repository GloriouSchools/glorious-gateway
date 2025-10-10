import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { AttendanceStats } from "@/components/attendance/AttendanceStats";
import { ClassAttendanceTable } from "@/components/attendance/ClassAttendanceTable";
import { format, addDays } from "date-fns";
import { parseStudentCSV } from '@/utils/csvParser';
import studentsCSV from '@/data/students.csv?raw';
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

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

const AttendanceOverview = () => {
  const { userRole, userName, photoUrl, signOut } = useAuth();
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [attendanceData, setAttendanceData] = useState<any>({});
  
  // Load attendance from database
  useEffect(() => {
    loadAttendance();
    
    // Subscribe to realtime changes
    const channel = supabase
      .channel('attendance-overview-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'attendance_records'
        },
        () => {
          loadAttendance();
        }
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, [selectedDate]);
  
  const loadAttendance = async () => {
    try {
      const { data, error } = await (supabase as any)
        .from('attendance_records')
        .select('*')
        .eq('date', format(selectedDate, 'yyyy-MM-dd'));
      
      if (error) throw error;
      
      const attendance: any = {};
      data?.forEach((record: any) => {
        attendance[record.student_id] = {
          status: record.status,
          timeMarked: record.marked_at || record.created_at
        };
      });
      setAttendanceData(attendance);
    } catch (error) {
      console.error('Error loading attendance:', error);
    }
  };

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

  const handleClassClick = (classId: string) => {
    navigate(`/admin/attendance/details?class=${classId}`);
  };

  if (!userRole) return null;

  return (
    <DashboardLayout
      userRole={userRole}
      userName={userName || "Admin"}
      photoUrl={photoUrl}
      onLogout={handleLogout}
    >
      <div className="w-full min-w-0 space-y-4 sm:space-y-6 animate-fade-in px-2 sm:px-4 lg:px-6">
        {/* Header */}
        <div className="flex flex-col gap-2 sm:gap-4">
          <div className="min-w-0">
            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-elegant bg-clip-text text-transparent truncate">
              Attendance Overview
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-1">
              Monitor and analyze attendance across the entire school
            </p>
          </div>
        </div>

        {/* Date Selection */}
        <Card>
          <CardContent className="p-3 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
              <div className="flex items-center gap-2 shrink-0">
                <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                <span className="text-xs sm:text-sm font-medium text-muted-foreground whitespace-nowrap">Viewing Date:</span>
              </div>
              <div className="flex items-center gap-2 min-w-0">
                <Button variant="outline" size="sm" onClick={() => navigateDate('prev')} className="shrink-0">
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="font-semibold text-xs sm:text-sm text-center min-w-0 truncate sm:whitespace-nowrap px-2">
                  {format(selectedDate, 'EEE, MMM d, yyyy')}
                </span>
                <Button variant="outline" size="sm" onClick={() => navigateDate('next')} className="shrink-0">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
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
      </div>
    </DashboardLayout>
  );
};

export default AttendanceOverview;
