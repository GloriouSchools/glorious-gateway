import { useState, useRef, useMemo } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Download, Search } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { parseStudentCSV } from '@/utils/csvParser';
import studentsCSV from '@/data/students.csv?raw';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { toast } from "sonner";
import { format } from "date-fns";
import { generateAttendancePDF } from "@/utils/pdfGenerator";

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

const ITEMS_PER_PAGE = 20;

// Build unique stream list from all students
const buildStreamList = () => {
  const streams = new Set<string>();
  allStudents.forEach(student => streams.add(student.stream));
  return Array.from(streams).sort();
};

const streamList = buildStreamList();

const AttendanceDetails = () => {
  const { userRole, userName, photoUrl, signOut } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const classId = searchParams.get('class');
  const filterParam = searchParams.get('filter');
  
  const [searchTerm, setSearchTerm] = useState("");
  const [streamFilter, setStreamFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [attendanceData] = useState(generateMockAttendance());

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Failed to logout:", error);
    }
  };

  // Get base students based on class filter
  const baseStudents = classId ? allStudents.filter(s => s.stream === classId) : allStudents;
  
  const className = classId ? classId.replace('-', ' - ') : (
    filterParam === 'all' ? 'All Students' :
    filterParam === 'present' ? 'Present Students' :
    filterParam === 'absent' ? 'Absent Students' :
    filterParam === 'pending' ? 'Pending Attendance' : 'All Students'
  );

  // Apply all filters and search
  const filteredStudents = useMemo(() => {
    let students = baseStudents.map(student => ({
      ...student,
      status: attendanceData[student.id]?.status || 'not-marked',
      timeMarked: attendanceData[student.id]?.timeMarked
    }));

    // Apply URL param filter (from stats cards)
    if (filterParam === 'present') {
      students = students.filter(s => s.status === 'present');
    } else if (filterParam === 'absent') {
      students = students.filter(s => s.status === 'absent');
    } else if (filterParam === 'pending') {
      students = students.filter(s => s.status === 'not-marked');
    }

    // Apply search filter
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      students = students.filter(s => 
        s.name.toLowerCase().includes(search) ||
        s.email.toLowerCase().includes(search) ||
        s.id.toLowerCase().includes(search)
      );
    }

    // Apply stream filter
    if (streamFilter !== "all") {
      students = students.filter(s => s.stream === streamFilter);
    }

    // Apply status filter
    if (statusFilter === "present") {
      students = students.filter(s => s.status === 'present');
    } else if (statusFilter === "absent") {
      students = students.filter(s => s.status === 'absent');
    } else if (statusFilter === "pending") {
      students = students.filter(s => s.status === 'not-marked');
    }

    return students;
  }, [baseStudents, attendanceData, filterParam, searchTerm, streamFilter, statusFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredStudents.length / ITEMS_PER_PAGE);
  const paginatedStudents = filteredStudents.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Reset to page 1 when filters change
  useMemo(() => {
    setCurrentPage(1);
  }, [searchTerm, streamFilter, statusFilter]);

  const stats = {
    total: baseStudents.length,
    present: baseStudents.filter(s => attendanceData[s.id]?.status === 'present').length,
    absent: baseStudents.filter(s => attendanceData[s.id]?.status === 'absent').length,
  };

  const handleDownloadPDF = () => {
    const toastId = toast.loading("Generating PDF...");
    try {
      const pdfData = filteredStudents.map(student => ({
        name: student.name,
        email: student.email,
        stream: student.stream,
        status: attendanceData[student.id]?.status || 'not-marked',
        timeMarked: attendanceData[student.id]?.timeMarked,
        photoUrl: student.photoUrl
      }));
      
      const pdf = generateAttendancePDF(
        pdfData,
        `${className} - Attendance Report`
      );
      
      pdf.save(`attendance-${className.replace(/\s+/g, '-')}-${format(new Date(), 'yyyy-MM-dd')}.pdf`);
      toast.success("PDF downloaded successfully!", { id: toastId });
    } catch (error) {
      console.error("PDF generation error:", error);
      toast.error("Failed to generate PDF", { id: toastId });
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
      <div className="w-full min-w-0 space-y-4 sm:space-y-6 animate-fade-in px-2 sm:px-4 lg:px-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
          <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
            <Button variant="outline" size="icon" onClick={() => navigate('/admin/attendance')} className="shrink-0">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="min-w-0 flex-1">
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-elegant bg-clip-text text-transparent truncate">{className}</h1>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1 truncate">
                Showing {filteredStudents.length} of {stats.total} students
              </p>
            </div>
          </div>
          <Button onClick={handleDownloadPDF} size="sm" className="w-full sm:w-auto shrink-0">
            <Download className="h-4 w-4 mr-2" />
            Download PDF
          </Button>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold">{stats.total}</div>
                <div className="text-xs sm:text-sm text-muted-foreground mt-1">Total Students</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-emerald-600">{stats.present}</div>
                <div className="text-xs sm:text-sm text-muted-foreground mt-1">Present</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-red-600">{stats.absent}</div>
                <div className="text-xs sm:text-sm text-muted-foreground mt-1">Absent</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardContent className="p-3 sm:p-6">
            <div className="flex flex-col gap-3 sm:gap-4">
              <div className="relative flex-1 min-w-0">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, email, or ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                {!classId && (
                  <Select value={streamFilter} onValueChange={setStreamFilter}>
                    <SelectTrigger className="w-full sm:w-[200px] bg-background border">
                      <SelectValue placeholder="All Streams" />
                    </SelectTrigger>
                    <SelectContent className="bg-background border z-50">
                      <SelectItem value="all">All Streams</SelectItem>
                      {streamList.map(stream => (
                        <SelectItem key={stream} value={stream}>
                          {stream.replace('-', ' - ')}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-[200px] bg-background border">
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent className="bg-background border z-50">
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="present">Present Only</SelectItem>
                    <SelectItem value="absent">Absent Only</SelectItem>
                    <SelectItem value="pending">Pending Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Student List */}
        <Card>
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-lg sm:text-xl">Attendance List</CardTitle>
            <CardDescription className="text-xs sm:text-sm">{format(new Date(), 'EEEE, MMMM d, yyyy')}</CardDescription>
          </CardHeader>
          <CardContent className="p-3 sm:p-6">
            {paginatedStudents.length === 0 ? (
              <div className="text-center py-8 sm:py-12 text-muted-foreground text-sm">
                No students found matching your filters
              </div>
            ) : (
              <div className="space-y-2 sm:space-y-3">
                {paginatedStudents.map((student) => (
                  <div key={student.id} className="flex items-center gap-2 sm:gap-4 p-3 sm:p-4 rounded-lg border hover:bg-muted/50 transition-colors">
                    <Avatar className="h-10 w-10 sm:h-12 sm:w-12 shrink-0">
                      <AvatarImage src={student.photoUrl} />
                      <AvatarFallback>
                        {student.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm sm:text-base font-semibold truncate">{student.name}</h4>
                      <p className="text-xs sm:text-sm text-muted-foreground truncate">{student.email}</p>
                      <p className="text-xs text-muted-foreground mt-0.5 sm:mt-1 truncate">{student.stream.replace('-', ' - ')}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {getStatusBadge(student.status)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pagination */}
        {totalPages > 1 && (
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
              
              {[...Array(totalPages)].map((_, i) => {
                const page = i + 1;
                // Show first page, last page, current page, and pages around current
                if (
                  page === 1 || 
                  page === totalPages || 
                  (page >= currentPage - 1 && page <= currentPage + 1)
                ) {
                  return (
                    <PaginationItem key={page}>
                      <PaginationLink
                        onClick={() => setCurrentPage(page)}
                        isActive={currentPage === page}
                        className="cursor-pointer"
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  );
                } else if (page === currentPage - 2 || page === currentPage + 2) {
                  return (
                    <PaginationItem key={page}>
                      <PaginationEllipsis />
                    </PaginationItem>
                  );
                }
                return null;
              })}
              
              <PaginationItem>
                <PaginationNext 
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}

      </div>
    </DashboardLayout>
  );
};

export default AttendanceDetails;
