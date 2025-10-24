import { useState, lazy, Suspense, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useAuth } from "@/hooks/useAuth";
import { 
  UserCheck, 
  Calendar, 
  Users, 
  Save,
  Filter,
  Search,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Download,
  Upload,
  BookOpen
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { format, addDays, parseISO } from "date-fns";
import { parseStudentCSV, StudentCSVRow } from '@/utils/csvParser';
import studentsCSV from '@/data/students.csv?raw';
import AttendanceOverview from "./admin/AttendanceOverview";
import { supabase } from "@/integrations/supabase/client";
import { EmptyAttendanceState } from "@/components/attendance/EmptyAttendanceState";

interface Student {
  id: string;
  name: string;
  email: string;
  class: string;
  stream: string;
  photoUrl?: string;
}

interface AttendanceRecord {
  studentId: string;
  status: 'present' | 'absent' | 'unmarked';
  timeMarked: string;
  absentReason?: string;
}

interface ClassInfo {
  id: string;
  name: string;
  class_id: string;
  totalStudents: number;
}

const convertCSVToStudents = (): Student[] => {
  const csvData = parseStudentCSV(studentsCSV);
  
  return csvData.map(row => ({
    id: row.id,
    name: row.name,
    email: row.email,
    class: row.class_id,
    stream: row.stream_id,
    photoUrl: row.photo_url
  }));
};

const allStudents = convertCSVToStudents();

const buildClassList = (): ClassInfo[] => {
  const classStreamMap = new Map<string, Set<string>>();

  allStudents.forEach(student => {
    if (!classStreamMap.has(student.stream)) {
      classStreamMap.set(student.stream, new Set());
    }
  });

  const classList: ClassInfo[] = [];
  
  classStreamMap.forEach((_, streamId) => {
    const studentsInStream = allStudents.filter(s => s.stream === streamId);
    const className = streamId.split('-')[0];
    
    classList.push({
      id: streamId,
      name: streamId.replace('-', ' - '),
      class_id: className,
      totalStudents: studentsInStream.length
    });
  });

  return classList.sort((a, b) => a.id.localeCompare(b.id));
};

const realClasses: ClassInfo[] = buildClassList();

const AttendanceMarking = () => {
  const { userRole, userName, photoUrl, signOut } = useAuth();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedClass, setSelectedClass] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [attendanceRecords, setAttendanceRecords] = useState<{ [key: string]: AttendanceRecord }>({});
  const [isSaving, setIsSaving] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [absentReason, setAbsentReason] = useState<string>("");
  const [customReason, setCustomReason] = useState<string>("");
  const [showReasonDialog, setShowReasonDialog] = useState(false);
  
  // Load existing attendance from database when date or class changes
  useEffect(() => {
    loadAttendance();
  }, [selectedDate, selectedClass]);
  
  const loadAttendance = async () => {
    try {
      const { data, error } = await (supabase as any)
        .from('attendance_records')
        .select('*')
        .eq('date', format(selectedDate, 'yyyy-MM-dd'))
        .eq('stream_id', selectedClass);
      
      if (error) throw error;
      
      if (data) {
        const records: { [key: string]: AttendanceRecord } = {};
        data.forEach((record: any) => {
          records[record.student_id] = {
            studentId: record.student_id,
            status: record.status as 'present' | 'absent',
            timeMarked: record.marked_at || record.created_at,
            absentReason: record.absent_reason
          };
        });
        setAttendanceRecords(records);
      }
    } catch (error) {
      console.error('Error loading attendance:', error);
    }
  };

  const currentClass = realClasses.find(cls => cls.id === selectedClass);
  
  // Filter students based on selected class and search term
  const classStudents = allStudents.filter(student => student.stream === selectedClass);

  const filteredStudents = classStudents.filter(student => 
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const markAttendance = (studentId: string, status: 'present' | 'absent', reason?: string) => {
    setAttendanceRecords(prev => ({
      ...prev,
      [studentId]: {
        studentId,
        status,
        timeMarked: new Date().toISOString(),
        absentReason: status === 'absent' ? reason : undefined
      }
    }));
    toast.success(`Marked as ${status}`);
  };

  const handleAbsentClick = (student: Student) => {
    setSelectedStudent(student);
    setShowReasonDialog(true);
    setAbsentReason("");
    setCustomReason("");
  };

  const handleAbsentReasonSubmit = () => {
    if (!selectedStudent) return;
    
    const finalReason = absentReason === "Other" ? customReason : absentReason;
    
    if (!finalReason) {
      toast.error("Please provide a reason for absence");
      return;
    }

    markAttendance(selectedStudent.id, 'absent', finalReason);
    setShowReasonDialog(false);
    setIsModalOpen(false);
  };

  const getAttendanceStats = () => {
    const records = Object.values(attendanceRecords);
    const present = records.filter(r => r.status === 'present').length;
    const absent = records.filter(r => r.status === 'absent').length;
    const total = filteredStudents.length;
    const marked = records.length;

    return { present, absent, total, marked };
  };

  const saveAttendance = async () => {
    // Validate all students are marked
    if (stats.marked !== stats.total) {
      toast.error(`Please mark all students. ${stats.total - stats.marked} students remaining.`);
      return;
    }

    // Validate date is not in the future
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selected = new Date(selectedDate);
    selected.setHours(0, 0, 0, 0);
    
    if (selected > today) {
      toast.error("Cannot mark attendance for future dates.");
      return;
    }

    setIsSaving(true);
    
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      // Prepare attendance records for database
      const attendanceToSave = Object.values(attendanceRecords).map(record => ({
        student_id: record.studentId,
        stream_id: selectedClass,
        date: format(selectedDate, 'yyyy-MM-dd'),
        status: record.status,
        marked_by: user?.id || null,
        absent_reason: record.absentReason || null
      }));
      
      // Upsert attendance records (insert or update if exists)
      const { error } = await (supabase as any)
        .from('attendance_records')
        .upsert(attendanceToSave, {
          onConflict: 'student_id,date'
        });
      
      if (error) throw error;
      
      const stats = getAttendanceStats();
      toast.success(`Attendance saved! ${stats.marked} of ${stats.total} students marked.`);
    } catch (error) {
      console.error('Error saving attendance:', error);
      toast.error('Failed to save attendance. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const markAllPresent = () => {
    const newRecords: { [key: string]: AttendanceRecord } = {};
    filteredStudents.forEach(student => {
      newRecords[student.id] = {
        studentId: student.id,
        status: 'present',
        timeMarked: new Date().toISOString()
      };
    });
    setAttendanceRecords(prev => ({ ...prev, ...newRecords }));
    toast.success("All students marked as present!");
  };

  const markAllAbsent = () => {
    toast.info("Please mark students individually to provide absence reasons.");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present': return "text-emerald-600 bg-emerald-50 border-emerald-200 hover:bg-emerald-100";
      case 'absent': return "text-red-600 bg-red-50 border-red-200 hover:bg-red-100";
      default: return "text-gray-600 bg-gray-50 border-gray-200 hover:bg-gray-100";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'present': return <CheckCircle className="h-4 w-4" />;
      case 'absent': return <XCircle className="h-4 w-4" />;
      default: return null;
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
    const newDate = addDays(selectedDate, direction === 'next' ? 1 : -1);
    
    // Prevent navigation to future dates
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const checkDate = new Date(newDate);
    checkDate.setHours(0, 0, 0, 0);
    
    if (checkDate > today) {
      toast.error("Cannot mark attendance for future dates.");
      return;
    }
    
    setSelectedDate(newDate);
  };

  const handleStudentClick = (student: Student) => {
    setSelectedStudent(student);
    setIsModalOpen(true);
  };

  const handleModalAttendance = (status: 'present' | 'absent') => {
    if (selectedStudent) {
      if (status === 'absent') {
        setIsModalOpen(false);
        handleAbsentClick(selectedStudent);
      } else {
        markAttendance(selectedStudent.id, status);
        setIsModalOpen(false);
      }
    }
  };

  const stats = getAttendanceStats();

  if (!userRole) return null;

  return (
    <DashboardLayout 
      userRole={userRole} 
      userName={userName || "Teacher"}
      photoUrl={photoUrl}
      onLogout={handleLogout}
    >
      <div className="space-y-4 md:space-y-6 animate-fade-in px-2 md:px-0">
        <div className="flex flex-col gap-4">
          <div className="text-center md:text-left">
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-elegant bg-clip-text text-transparent">
              Mark Attendance
            </h1>
            <p className="text-muted-foreground mt-1 text-sm md:text-base">
              Roll call and attendance marking for your classes
            </p>
          </div>
          {selectedClass && (
            <div className="flex justify-center md:justify-end">
              <Button 
                onClick={saveAttendance} 
                disabled={isSaving || stats.marked === 0}
                className="bg-primary hover:bg-primary/90 w-full sm:w-auto"
              >
                <Save className="h-4 w-4 mr-2" />
                {isSaving ? "Saving..." : "Update Attendance"}
              </Button>
            </div>
          )}
        </div>

        {/* Class and Date Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Class & Date Selection
            </CardTitle>
          </CardHeader>
          <CardContent>
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigateDate('prev')}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-sm font-medium text-center flex-1 min-w-0 px-2">
                    {format(selectedDate, 'EEEE, MMM d, yyyy')}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigateDate('next')}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <Select value={selectedClass} onValueChange={setSelectedClass}>
                    <SelectTrigger className="w-full sm:flex-1">
                      <SelectValue placeholder="Select a class" />
                    </SelectTrigger>
                    <SelectContent className="bg-background border z-50">
                      {realClasses.map(cls => (
                        <SelectItem key={cls.id} value={cls.id}>
                          {cls.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  {selectedClass && (
                    <div className="relative w-full sm:flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input 
                        placeholder="Search students..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  )}
                </div>
              </div>
          </CardContent>
        </Card>

        {/* Empty State or Attendance Content */}
        {!selectedClass ? (
          <EmptyAttendanceState />
        ) : (
          <>
            {/* Attendance Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="hover-scale">
                <CardContent className="p-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold">{stats.total}</div>
                    <div className="text-sm text-muted-foreground">Total Students</div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="hover-scale">
                <CardContent className="p-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-600">{stats.marked}</div>
                    <div className="text-sm text-muted-foreground">Marked</div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="hover-scale">
                <CardContent className="p-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-emerald-600">{stats.present}</div>
                    <div className="text-sm text-muted-foreground">Present</div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="hover-scale">
                <CardContent className="p-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">{stats.absent}</div>
                    <div className="text-sm text-muted-foreground">Absent</div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  <Button 
                    onClick={markAllPresent}
                    variant="outline"
                    className="text-emerald-600 border-emerald-200 hover:bg-emerald-50"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Mark All Present
                  </Button>
                  <Button 
                    onClick={markAllAbsent}
                    variant="outline"
                    className="text-red-600 border-red-200 hover:bg-red-50"
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Mark All Absent
                  </Button>
                  <Button 
                    onClick={() => setAttendanceRecords({})}
                    variant="outline"
                  >
                    Clear All
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => {
                      const csvContent = [
                        ['Name', 'Email', 'Class', 'Stream', 'Status'].join(','),
                        ...filteredStudents.map(s => {
                          const record = attendanceRecords[s.id];
                          return [s.name, s.email, s.class, s.stream, record?.status || 'not-marked'].join(',');
                        })
                      ].join('\n');
                      const blob = new Blob([csvContent], { type: 'text/csv' });
                      const url = window.URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `attendance-${currentClass?.name}-${format(selectedDate, 'yyyy-MM-dd')}.csv`;
                      a.click();
                      window.URL.revokeObjectURL(url);
                    }}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export Report
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Student List */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserCheck className="h-5 w-5" />
                  Student Roll Call - {currentClass?.name}
                </CardTitle>
                <CardDescription>
                  Mark attendance for each student by clicking the status buttons
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {filteredStudents.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No students found matching your search criteria</p>
                    </div>
                  ) : (
                    filteredStudents.map((student) => {
                      const record = attendanceRecords[student.id];
                      return (
                        <div 
                          key={student.id} 
                          className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-lg border bg-card hover:bg-accent/20 transition-colors"
                        >
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            {student.photoUrl ? (
                              <img 
                                src={student.photoUrl} 
                                alt={student.name}
                                className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                                onError={(e) => {
                                  // Fallback to initials if image fails to load
                                  e.currentTarget.style.display = 'none';
                                  e.currentTarget.nextElementSibling?.classList.remove('hidden');
                                }}
                              />
                            ) : null}
                            <div className={`w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 ${student.photoUrl ? 'hidden' : ''}`}>
                              <span className="text-sm font-semibold">
                                {student.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                              </span>
                            </div>
                            <div className="min-w-0 flex-1">
                              <h3 
                                className="font-semibold truncate cursor-pointer hover:text-primary transition-colors"
                                onClick={() => handleStudentClick(student)}
                              >
                                {student.name}
                              </h3>
                              <p className="text-sm text-muted-foreground truncate">
                                {student.email}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex flex-col items-end gap-2 w-full sm:w-auto">
                            {/* Segmented Control for Attendance */}
                            <div className="flex rounded-lg border bg-muted p-1 w-full sm:w-auto">
                              <button
                                onClick={() => markAttendance(student.id, 'present')}
                                className={`flex-1 sm:flex-none px-4 py-2 rounded-md text-sm font-medium transition-all ${
                                  record?.status === 'present'
                                    ? 'bg-emerald-600 text-white shadow-sm'
                                    : 'text-muted-foreground hover:text-foreground'
                                }`}
                              >
                                <div className="flex items-center justify-center gap-1">
                                  <CheckCircle className="h-4 w-4" />
                                  <span>Present</span>
                                </div>
                              </button>
                              <button
                                onClick={() => handleAbsentClick(student)}
                                className={`flex-1 sm:flex-none px-4 py-2 rounded-md text-sm font-medium transition-all ${
                                  record?.status === 'absent'
                                    ? 'bg-red-600 text-white shadow-sm'
                                    : 'text-muted-foreground hover:text-foreground'
                                }`}
                              >
                                <div className="flex items-center justify-center gap-1">
                                  <XCircle className="h-4 w-4" />
                                  <span>Absent</span>
                                </div>
                              </button>
                            </div>
                            
                            {/* Show absence reason if student is marked absent */}
                            {record?.status === 'absent' && record.absentReason && (
                              <div className="text-xs text-muted-foreground bg-red-50 dark:bg-red-950/20 px-2 py-1 rounded border border-red-200 dark:border-red-900">
                                <span className="font-medium">Reason:</span> {record.absentReason}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {/* Student Details Modal */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-lg">Student Details</DialogTitle>
              <DialogDescription className="text-sm">
                View and mark attendance for this student
              </DialogDescription>
            </DialogHeader>
            
            {selectedStudent && (
              <div className="space-y-4">
                {/* Student Photo */}
                <div className="flex justify-center">
                  {selectedStudent.photoUrl ? (
                    <img 
                      src={selectedStudent.photoUrl} 
                      alt={selectedStudent.name}
                      className="w-20 h-20 rounded-full object-cover border-2 border-primary/20"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                  ) : null}
                  <div className={`w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center border-2 border-primary/20 ${selectedStudent.photoUrl ? 'hidden' : ''}`}>
                    <span className="text-xl font-bold">
                      {selectedStudent.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </span>
                  </div>
                </div>

                {/* Student Information */}
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-muted-foreground">Full Name</label>
                    <p className="font-semibold">{selectedStudent.name}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-muted-foreground">Class</label>
                      <p className="text-sm font-semibold">{selectedStudent.class}</p>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-muted-foreground">Stream</label>
                      <p className="text-sm font-semibold">{selectedStudent.stream}</p>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-medium text-muted-foreground">Email</label>
                    <p className="text-sm break-all">{selectedStudent.email}</p>
                  </div>

                  {/* Current Status */}
                  {attendanceRecords[selectedStudent.id] && (
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-muted-foreground">Current Status</label>
                      <div>
                        <Badge className={getStatusColor(attendanceRecords[selectedStudent.id].status)}>
                          {getStatusIcon(attendanceRecords[selectedStudent.id].status)}
                          <span className="ml-1 capitalize">{attendanceRecords[selectedStudent.id].status}</span>
                        </Badge>
                      </div>
                    </div>
                  )}
                </div>

                {/* Attendance Actions */}
                <div className="flex gap-2 pt-3 border-t">
                  <Button
                    onClick={() => handleModalAttendance('present')}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
                    size="sm"
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Present
                  </Button>
                  <Button
                    onClick={() => handleModalAttendance('absent')}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                    size="sm"
                  >
                    <XCircle className="h-4 w-4 mr-1" />
                    Absent
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Absent Reason Dialog */}
        <Dialog open={showReasonDialog} onOpenChange={setShowReasonDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Absence Reason</DialogTitle>
              <DialogDescription>
                Please provide a reason for {selectedStudent?.name}'s absence
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Select Reason</label>
                <Select value={absentReason} onValueChange={setAbsentReason}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a reason..." />
                  </SelectTrigger>
                  <SelectContent className="bg-background border z-50">
                    <SelectItem value="Sick">Sick</SelectItem>
                    <SelectItem value="Sent back for school fees">Sent back for school fees</SelectItem>
                    <SelectItem value="Suspended">Suspended</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {absentReason === "Other" && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Specify Reason</label>
                  <Input
                    value={customReason}
                    onChange={(e) => setCustomReason(e.target.value)}
                    placeholder="Enter the reason..."
                    className="w-full"
                  />
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  onClick={() => setShowReasonDialog(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleAbsentReasonSubmit}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                  disabled={!absentReason || (absentReason === "Other" && !customReason.trim())}
                >
                  Mark as Absent
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

// Main Attendance component that routes based on role
const Attendance = () => {
  const { userRole } = useAuth();

  if (!userRole) return null;

  // Admin sees overview, teachers see marking interface, students see their attendance
  if (userRole === 'admin') {
    return <AttendanceOverview />;
  }
  
  if (userRole === 'student') {
    const StudentAttendanceView = lazy(() => import('./student/StudentAttendanceView'));
    return (
      <Suspense fallback={<div>Loading...</div>}>
        <StudentAttendanceView />
      </Suspense>
    );
  }

  return <AttendanceMarking />;
};

export default Attendance;
