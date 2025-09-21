import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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

interface Student {
  id: string;
  name: string;
  studentId: string;
  grade: string;
  section: string;
  photoUrl?: string;
}

interface AttendanceRecord {
  studentId: string;
  status: 'present' | 'absent';
  timeMarked: string;
}

interface ClassInfo {
  id: string;
  name: string;
  class_id: string;
  totalStudents: number;
}

// Mock student data
const mockStudents: Student[] = [
  {
    id: 'S001',
    name: 'John Smith',
    studentId: 'STU001',
    grade: 'Primary 5',
    section: 'A'
  },
  {
    id: 'S002',
    name: 'Emma Wilson',
    studentId: 'STU002',
    grade: 'Primary 5',
    section: 'A'
  },
  {
    id: 'S003',
    name: 'Michael Brown',
    studentId: 'STU003',
    grade: 'Primary 5',
    section: 'A'
  },
  {
    id: 'S004',
    name: 'Sarah Davis',
    studentId: 'STU004',
    grade: 'Primary 5',
    section: 'A'
  },
  {
    id: 'S005',
    name: 'James Johnson',
    studentId: 'STU005',
    grade: 'Primary 5',
    section: 'A'
  },
  {
    id: 'S006',
    name: 'Lisa Anderson',
    studentId: 'STU006',
    grade: 'Primary 5',
    section: 'A'
  },
  {
    id: 'S007',
    name: 'Robert Garcia',
    studentId: 'STU007',
    grade: 'Primary 5',
    section: 'A'
  },
  {
    id: 'S008',
    name: 'Maria Rodriguez',
    studentId: 'STU008',
    grade: 'Primary 5',
    section: 'A'
  },
  {
    id: 'S009',
    name: 'David Lee',
    studentId: 'STU009',
    grade: 'Primary 5',
    section: 'A'
  },
  {
    id: 'S010',
    name: 'Jennifer Taylor',
    studentId: 'STU010',
    grade: 'Primary 5',
    section: 'A'
  }
];

// Real class and stream data from CSV
const realClasses: ClassInfo[] = [
  { id: 'P1-PEARLS', name: 'P1 - PEARLS', class_id: 'P1', totalStudents: 30 },
  { id: 'P1-STARS', name: 'P1 - STARS', class_id: 'P1', totalStudents: 28 },
  { id: 'P1-DIAMONDS', name: 'P1 - DIAMONDS', class_id: 'P1', totalStudents: 32 },
  { id: 'P2-GOLDEN', name: 'P2 - GOLDEN', class_id: 'P2', totalStudents: 29 },
  { id: 'P2-KITES', name: 'P2 - KITES', class_id: 'P2', totalStudents: 31 },
  { id: 'P2-MARIGOLD', name: 'P2 - MARIGOLD', class_id: 'P2', totalStudents: 27 },
  { id: 'P3-CRANES', name: 'P3 - CRANES', class_id: 'P3', totalStudents: 33 },
  { id: 'P3-PARROTS', name: 'P3 - PARROTS', class_id: 'P3', totalStudents: 30 },
  { id: 'P3-SPARROWS', name: 'P3 - SPARROWS', class_id: 'P3', totalStudents: 29 },
  { id: 'P4-CUBS', name: 'P4 - CUBS', class_id: 'P4', totalStudents: 26 },
  { id: 'P4-EAGLETS', name: 'P4 - EAGLETS', class_id: 'P4', totalStudents: 28 },
  { id: 'P4-SPARKLES', name: 'P4 - SPARKLES', class_id: 'P4', totalStudents: 31 },
  { id: 'P4-BUNNIES', name: 'P4 - BUNNIES', class_id: 'P4', totalStudents: 29 },
  { id: 'P5-SKYHIGH', name: 'P5 - SKY-HIGH', class_id: 'P5', totalStudents: 32 },
  { id: 'P5-SUNSET', name: 'P5 - SUNSET', class_id: 'P5', totalStudents: 30 },
  { id: 'P5-SUNRISE', name: 'P5 - SUNRISE', class_id: 'P5', totalStudents: 28 },
  { id: 'P6-RADIANT', name: 'P6 - RADIANT', class_id: 'P6', totalStudents: 27 },
  { id: 'P6-VIBRANT', name: 'P6 - VIBRANT', class_id: 'P6', totalStudents: 29 },
  { id: 'P6-VICTORS', name: 'P6 - VICTORS', class_id: 'P6', totalStudents: 31 },
  { id: 'P7-WINNERS', name: 'P7 - WINNERS', class_id: 'P7', totalStudents: 25 },
  { id: 'P7-ACHIEVERS', name: 'P7 - ACHIEVERS', class_id: 'P7', totalStudents: 33 },
  { id: 'P7-SUCCESS', name: 'P7 - SUCCESS', class_id: 'P7', totalStudents: 30 }
];

const Attendance = () => {
  const { userRole, userName, photoUrl, signOut } = useAuth();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedClass, setSelectedClass] = useState(realClasses[0].id);
  const [searchTerm, setSearchTerm] = useState("");
  const [attendanceRecords, setAttendanceRecords] = useState<{ [key: string]: AttendanceRecord }>({});
  const [isSaving, setIsSaving] = useState(false);

  const currentClass = realClasses.find(cls => cls.id === selectedClass);
  const filteredStudents = mockStudents.filter(student => 
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.studentId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const markAttendance = (studentId: string, status: 'present' | 'absent') => {
    setAttendanceRecords(prev => ({
      ...prev,
      [studentId]: {
        studentId,
        status,
        timeMarked: new Date().toISOString()
      }
    }));
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
    setIsSaving(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const stats = getAttendanceStats();
    toast.success(`Attendance saved! ${stats.marked} of ${stats.total} students marked.`);
    setIsSaving(false);
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
    const newRecords: { [key: string]: AttendanceRecord } = {};
    filteredStudents.forEach(student => {
      newRecords[student.id] = {
        studentId: student.id,
        status: 'absent',
        timeMarked: new Date().toISOString()
      };
    });
    setAttendanceRecords(prev => ({ ...prev, ...newRecords }));
    toast.success("All students marked as absent!");
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
    setSelectedDate(prev => addDays(prev, direction === 'next' ? 1 : -1));
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
          <div className="flex justify-center md:justify-end">
            <Button 
              onClick={saveAttendance} 
              disabled={isSaving || stats.marked === 0}
              className="bg-primary hover:bg-primary/90 w-full sm:w-auto"
            >
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? "Saving..." : "Save Attendance"}
            </Button>
          </div>
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
                      <SelectValue placeholder="Select class" />
                    </SelectTrigger>
                    <SelectContent className="bg-background border z-50">
                      {realClasses.map(cls => (
                        <SelectItem key={cls.id} value={cls.id}>
                          {cls.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <div className="relative w-full sm:flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input 
                      placeholder="Search students..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>
          </CardContent>
        </Card>

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
              >
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </Button>
              <Button 
                variant="outline"
              >
                <Upload className="h-4 w-4 mr-2" />
                Import Previous
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
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <span className="text-sm font-semibold">
                            {student.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="font-semibold truncate">{student.name}</h3>
                          <p className="text-sm text-muted-foreground truncate">
                            ID: {student.studentId} | {student.grade} {student.section}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex gap-2 w-full sm:w-auto">
                        <Button
                          size="sm"
                          variant={record?.status === 'present' ? 'default' : 'outline'}
                          onClick={() => markAttendance(student.id, 'present')}
                          className={`flex-1 sm:flex-none ${record?.status === 'present' ? getStatusColor('present') : 'hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200'}`}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Present
                        </Button>
                        <Button
                          size="sm"
                          variant={record?.status === 'absent' ? 'default' : 'outline'}
                          onClick={() => markAttendance(student.id, 'absent')}
                          className={`flex-1 sm:flex-none ${record?.status === 'absent' ? getStatusColor('absent') : 'hover:bg-red-50 hover:text-red-600 hover:border-red-200'}`}
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Absent
                        </Button>
                      </div>
                      
                      {record && (
                        <div className="flex items-center gap-2 w-full sm:w-auto">
                          <Badge className={getStatusColor(record.status)}>
                            {getStatusIcon(record.status)}
                            <span className="ml-1 capitalize">{record.status}</span>
                          </Badge>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Attendance;