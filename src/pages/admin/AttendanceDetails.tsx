import { useState, useRef } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Download, Filter } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { parseStudentCSV } from '@/utils/csvParser';
import studentsCSV from '@/data/students.csv?raw';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { toast } from "sonner";
import { format } from "date-fns";

const allStudents = parseStudentCSV(studentsCSV).map(row => ({
  id: row.id,
  name: row.name,
  email: row.email,
  class: row.class_id,
  stream: row.stream_id,
  photoUrl: row.photo_url
}));

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
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const classId = searchParams.get('class');
  const [statusFilter, setStatusFilter] = useState("all");
  const [attendanceData] = useState(generateMockAttendance());
  const contentRef = useRef<HTMLDivElement>(null);

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Failed to logout:", error);
    }
  };

  const filterParam = searchParams.get('filter');
  const classStudents = classId ? allStudents.filter(s => s.stream === classId) : allStudents;
  const className = classId ? classId.replace('-', ' - ') : (
    filterParam === 'all' ? 'All Students' :
    filterParam === 'present' ? 'Present Students' :
    filterParam === 'absent' ? 'Absent Students' :
    filterParam === 'pending' ? 'Pending Attendance' : 'All Students'
  );

  let filteredStudents = classStudents.map(student => ({
    ...student,
    status: attendanceData[student.id]?.status || 'not-marked',
    timeMarked: attendanceData[student.id]?.timeMarked
  }));

  // Apply filter from URL params (stats cards)
  if (filterParam === 'present') {
    filteredStudents = filteredStudents.filter(s => s.status === 'present');
  } else if (filterParam === 'absent') {
    filteredStudents = filteredStudents.filter(s => s.status === 'absent');
  } else if (filterParam === 'pending') {
    filteredStudents = filteredStudents.filter(s => s.status === 'not-marked');
  }

  // Apply dropdown filter
  if (statusFilter === "present") {
    filteredStudents = filteredStudents.filter(s => s.status === 'present');
  } else if (statusFilter === "absent") {
    filteredStudents = filteredStudents.filter(s => s.status === 'absent');
  }

  const stats = {
    total: classStudents.length,
    present: classStudents.filter(s => attendanceData[s.id]?.status === 'present').length,
    absent: classStudents.filter(s => attendanceData[s.id]?.status === 'absent').length,
  };

  const handleDownloadPDF = async () => {
    if (!contentRef.current) return;
    toast.loading("Generating PDF...");
    try {
      const canvas = await html2canvas(contentRef.current, { scale: 2, backgroundColor: '#ffffff' });
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save(`attendance-${className}-${format(new Date(), 'yyyy-MM-dd')}.pdf`);
      toast.success("PDF downloaded!");
    } catch (error) {
      toast.error("Failed to generate PDF");
    }
  };

  const getStatusBadge = (status: string) => {
    if (status === 'present') return <Badge className="bg-emerald-500/10 text-emerald-700 border-emerald-200">Present</Badge>;
    if (status === 'absent') return <Badge className="bg-red-500/10 text-red-700 border-red-200">Absent</Badge>;
    return <Badge variant="outline">Not Marked</Badge>;
  };

  if (!userRole) return null;

  return (
    <DashboardLayout userRole={userRole} userName={userName || "Admin"} photoUrl={photoUrl} onLogout={handleLogout}>
      <div className="space-y-6 animate-fade-in">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" onClick={() => navigate('/admin/attendance')}><ArrowLeft className="h-4 w-4" /></Button>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-elegant bg-clip-text text-transparent">{className}</h1>
              <p className="text-muted-foreground mt-1">Detailed attendance report</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px] bg-background border z-50">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-background border z-50">
                <SelectItem value="all">All Students</SelectItem>
                <SelectItem value="present">Present Only</SelectItem>
                <SelectItem value="absent">Absent Only</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleDownloadPDF}><Download className="h-4 w-4 mr-2" />Download PDF</Button>
          </div>
        </div>
        <div ref={contentRef} className="space-y-6 bg-background p-6">
          <div className="grid grid-cols-3 gap-4">
            <Card><CardContent className="p-4"><div className="text-center"><div className="text-2xl font-bold">{stats.total}</div><div className="text-sm text-muted-foreground">Total</div></div></CardContent></Card>
            <Card><CardContent className="p-4"><div className="text-center"><div className="text-2xl font-bold text-emerald-600">{stats.present}</div><div className="text-sm text-muted-foreground">Present</div></div></CardContent></Card>
            <Card><CardContent className="p-4"><div className="text-center"><div className="text-2xl font-bold text-red-600">{stats.absent}</div><div className="text-sm text-muted-foreground">Absent</div></div></CardContent></Card>
          </div>
          <Card>
            <CardHeader><CardTitle>{className} - Attendance Report</CardTitle><CardDescription>{format(new Date(), 'EEEE, MMMM d, yyyy')}</CardDescription></CardHeader>
            <CardContent>
              <div className="space-y-3">
                {filteredStudents.map((student) => (
                  <div key={student.id} className="flex items-center gap-4 p-4 rounded-lg border">
                    <Avatar className="h-12 w-12"><AvatarImage src={student.photoUrl} /><AvatarFallback>{student.name.split(' ').map(n => n[0]).join('').slice(0, 2)}</AvatarFallback></Avatar>
                    <div className="flex-1"><h4 className="font-semibold">{student.name}</h4><p className="text-sm text-muted-foreground">{student.email}</p></div>
                    <div>{getStatusBadge(student.status)}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AttendanceDetails;
