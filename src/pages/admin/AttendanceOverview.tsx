import { useState, useEffect, useMemo } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, ChevronLeft, ChevronRight, Users, TrendingUp, BarChart3, Clock } from "lucide-react";
import { AttendanceStats } from "@/components/attendance/AttendanceStats";
import { ClassAttendanceTable } from "@/components/attendance/ClassAttendanceTable";
import { AttendanceByGenderChart } from "@/components/attendance/analytics/AttendanceByGenderChart";
import { AttendanceByDayChart } from "@/components/attendance/analytics/AttendanceByDayChart";
import { AttendanceByStreamChart } from "@/components/attendance/analytics/AttendanceByStreamChart";
import { AttendanceTrendChart } from "@/components/attendance/analytics/AttendanceTrendChart";
import { AttendanceHeatmap } from "@/components/attendance/analytics/AttendanceHeatmap";
import { MonthlyComparisonChart } from "@/components/attendance/analytics/MonthlyComparisonChart";
import { TopPerformersCard } from "@/components/attendance/analytics/TopPerformersCard";
import { AttendanceQuickStats } from "@/components/attendance/analytics/AttendanceQuickStats";
import { format, addDays, subDays, startOfMonth, endOfMonth, eachDayOfInterval, getDay } from "date-fns";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const AttendanceOverview = () => {
  const { userRole, userName, photoUrl, signOut } = useAuth();
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [attendanceData, setAttendanceData] = useState<any>({});
  const [allStudents, setAllStudents] = useState<any[]>([]);
  const [classList, setClassList] = useState<any[]>([]);
  const [totalStudentsCount, setTotalStudentsCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  
  // Load students from database
  useEffect(() => {
    loadStudents();
  }, []);
  
  // Load attendance from database
  useEffect(() => {
    if (allStudents.length > 0) {
      loadAttendance();
    }
    
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
  }, [selectedDate, allStudents]);

  const loadStudents = async () => {
    try {
      setIsLoading(true);
      
      // Use count query to get total students (bypasses 1000 row limit)
      const { count: totalCount } = await supabase
        .from('students')
        .select('*', { count: 'exact', head: true });
      
      setTotalStudentsCount(totalCount || 0);
      
      // Load student data for attendance tracking
      const { data: students, error } = await supabase
        .from('students')
        .select('id, name, email, class_id, stream_id, photo_url')
        .order('class_id')
        .order('stream_id')
        .order('name')
        .limit(10000);
      
      if (error) throw error;
      
      const formattedStudents = students?.map(s => ({
        id: s.id,
        name: s.name,
        email: s.email,
        class: s.class_id,
        stream: s.stream_id,
        photoUrl: s.photo_url
      })) || [];
      
      setAllStudents(formattedStudents);
      
      // Build class list from database students
      const classMap = new Map();
      formattedStudents.forEach(student => {
        if (!classMap.has(student.stream)) {
          classMap.set(student.stream, {
            id: student.stream,
            name: student.stream.replace('-', ' - '),
            students: []
          });
        }
        classMap.get(student.stream).students.push(student);
      });
      setClassList(Array.from(classMap.values()).sort((a, b) => a.id.localeCompare(b.id)));
      
    } catch (error) {
      console.error('Error loading students:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
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

  // Calculate overall statistics using the count from database
  const presentCount = Object.values(attendanceData).filter((a: any) => a.status === 'present').length;
  const absentCount = Object.values(attendanceData).filter((a: any) => a.status === 'absent').length;
  const pendingCount = Object.values(attendanceData).filter((a: any) => a.status === 'not-marked').length;
  const attendanceRate = totalStudentsCount > 0 ? Math.round((presentCount / totalStudentsCount) * 100) : 0;

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

  // Calculate analytics data
  const analyticsData = useMemo(() => {
    // Gender data (mock - you'd need actual gender data in your database)
    const maleCount = Math.round(presentCount * 0.52);
    const femaleCount = presentCount - maleCount;
    const genderData = [
      { name: 'Male', value: maleCount, percentage: Math.round((maleCount / presentCount) * 100) || 50 },
      { name: 'Female', value: femaleCount, percentage: Math.round((femaleCount / presentCount) * 100) || 50 }
    ];

    // Day of week data (mock - you'd aggregate from actual data)
    const dayData = [
      { day: 'Mon', present: Math.round(presentCount * 0.92), absent: Math.round(absentCount * 0.08), rate: 92 },
      { day: 'Tue', present: Math.round(presentCount * 0.95), absent: Math.round(absentCount * 0.05), rate: 95 },
      { day: 'Wed', present: Math.round(presentCount * 0.89), absent: Math.round(absentCount * 0.11), rate: 89 },
      { day: 'Thu', present: Math.round(presentCount * 0.93), absent: Math.round(absentCount * 0.07), rate: 93 },
      { day: 'Fri', present: Math.round(presentCount * 0.87), absent: Math.round(absentCount * 0.13), rate: 87 }
    ];

    // Stream data
    const streamData = classData.map(cls => ({
      stream: cls.name,
      present: cls.present,
      total: cls.totalStudents,
      rate: cls.attendanceRate
    }));

    // Trend data (last 30 days mock)
    const trendData = Array.from({ length: 30 }, (_, i) => {
      const date = subDays(selectedDate, 29 - i);
      const rate = 85 + Math.random() * 10;
      return {
        date: format(date, 'MM/dd'),
        rate: Math.round(rate),
        present: Math.round((totalStudentsCount * rate) / 100),
        total: totalStudentsCount
      };
    });

    // Heatmap data (mock)
    const heatmapData = [];
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
    const hours = [8, 9, 10, 11, 12, 13, 14, 15, 16];
    for (const day of days) {
      for (const hour of hours) {
        heatmapData.push({
          day,
          hour,
          attendance: 70 + Math.random() * 25,
          color: ''
        });
      }
    }

    // Monthly data (mock)
    const monthData = [
      { month: 'Jan', avgRate: 88, present: Math.round(totalStudentsCount * 0.88), absent: Math.round(totalStudentsCount * 0.12) },
      { month: 'Feb', avgRate: 91, present: Math.round(totalStudentsCount * 0.91), absent: Math.round(totalStudentsCount * 0.09) },
      { month: 'Mar', avgRate: 86, present: Math.round(totalStudentsCount * 0.86), absent: Math.round(totalStudentsCount * 0.14) },
      { month: 'Apr', avgRate: 93, present: Math.round(totalStudentsCount * 0.93), absent: Math.round(totalStudentsCount * 0.07) },
      { month: 'May', avgRate: 89, present: Math.round(totalStudentsCount * 0.89), absent: Math.round(totalStudentsCount * 0.11) },
      { month: 'Jun', avgRate: 90, present: Math.round(totalStudentsCount * 0.90), absent: Math.round(totalStudentsCount * 0.10) }
    ];

    // Top and bottom performers
    const sortedStreams = [...streamData].sort((a, b) => b.rate - a.rate);
    const bestStreams = sortedStreams.slice(0, 5).map(s => ({ stream: s.stream, rate: s.rate }));
    const worstStreams = sortedStreams.slice(-5).reverse().map(s => ({ stream: s.stream, rate: s.rate }));

    // Perfect attendance students (mock)
    const perfectAttendance = allStudents.slice(0, 6).map(s => ({
      name: s.name,
      stream: s.stream,
      rate: 100,
      photoUrl: s.photoUrl
    }));

    return {
      genderData,
      dayData,
      streamData,
      trendData,
      heatmapData,
      monthData,
      bestStreams,
      worstStreams,
      perfectAttendance
    };
  }, [classData, presentCount, absentCount, totalStudentsCount, allStudents, selectedDate]);

  // Quick stats
  const quickStats = [
    { icon: Users, value: totalStudentsCount, label: 'Total Students' },
    { icon: TrendingUp, value: `${attendanceRate}%`, label: 'Today\'s Rate', trend: 2.5 },
    { icon: BarChart3, value: analyticsData.bestStreams[0]?.rate + '%' || 'N/A', label: 'Best Stream' },
    { icon: Clock, value: format(selectedDate, 'MMM d'), label: 'Current Date' }
  ];

  if (!userRole || isLoading) return null;

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

        {/* Tabs for different views */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Statistics Cards */}
            <AttendanceStats
              totalStudents={totalStudentsCount}
              present={presentCount}
              absent={absentCount}
              pending={pendingCount}
              attendanceRate={attendanceRate}
            />

            {/* Class Table */}
            <ClassAttendanceTable classData={classData} onClassClick={handleClassClick} />

            {/* Quick Gender and Day Insights */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <AttendanceByGenderChart data={analyticsData.genderData} />
              <AttendanceByDayChart data={analyticsData.dayData} />
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            {/* Quick Stats */}
            <AttendanceQuickStats stats={quickStats} />

            {/* Stream Analysis */}
            <AttendanceByStreamChart 
              data={analyticsData.streamData} 
              onStreamClick={handleClassClick} 
            />

            {/* Gender and Day Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <AttendanceByGenderChart data={analyticsData.genderData} />
              <AttendanceByDayChart data={analyticsData.dayData} />
            </div>

            {/* Heatmap */}
            <AttendanceHeatmap data={analyticsData.heatmapData} />
          </TabsContent>

          {/* Trends Tab */}
          <TabsContent value="trends" className="space-y-6">
            {/* Trend Chart */}
            <AttendanceTrendChart data={analyticsData.trendData} />

            {/* Monthly Comparison */}
            <MonthlyComparisonChart data={analyticsData.monthData} />

            {/* Stream Performance */}
            <AttendanceByStreamChart 
              data={analyticsData.streamData} 
              onStreamClick={handleClassClick} 
            />
          </TabsContent>

          {/* Insights Tab */}
          <TabsContent value="insights" className="space-y-6">
            {/* Top Performers */}
            <TopPerformersCard
              bestStreams={analyticsData.bestStreams}
              worstStreams={analyticsData.worstStreams}
              perfectAttendance={analyticsData.perfectAttendance}
              onStreamClick={handleClassClick}
            />

            {/* Weekly Heatmap */}
            <AttendanceHeatmap data={analyticsData.heatmapData} />

            {/* Day Analysis */}
            <AttendanceByDayChart data={analyticsData.dayData} />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default AttendanceOverview;
