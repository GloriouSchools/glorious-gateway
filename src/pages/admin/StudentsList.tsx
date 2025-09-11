import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { 
  Search, 
  Filter, 
  Download, 
  ArrowLeft,
  Loader2
} from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import defaultAvatar from "@/assets/default-avatar.png";

interface Student {
  id: string;
  name: string;
  email: string;
  photo_url?: string;
  class_id?: string;
  stream_id?: string;
}

export default function StudentsList() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const [totalCount, setTotalCount] = useState(0);

  // Data
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterClass, setFilterClass] = useState<string>("all");
  const [paramStream, setParamStream] = useState<string | null>(null);

  // Reference data maps
  const [classes, setClasses] = useState<{ id: string; name: string }[]>([]);
  const [streams, setStreams] = useState<{ id: string; name: string }[]>([]);

  const classNameById = useMemo(() => {
    const map: Record<string, string> = {};
    classes.forEach(c => { if (c.id) map[c.id] = c.name || c.id; });
    return map;
  }, [classes]);

  const streamNameById = useMemo(() => {
    const map: Record<string, string> = {};
    streams.forEach(s => { if (s.id) map[s.id] = s.name || s.id; });
    return map;
  }, [streams]);

  // Initialize from query params
  useEffect(() => {
    const classParam = searchParams.get("class");
    const streamParam = searchParams.get("stream");
    if (classParam) setFilterClass(classParam);
    if (streamParam) setParamStream(streamParam);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const loadRefData = async () => {
      const [{ data: classData, error: classError }, { data: streamData, error: streamError }] = await Promise.all([
        supabase.from('classes').select('id, name'),
        supabase.from('streams').select('id, name')
      ]);
      if (classError) console.error('Error fetching classes:', classError);
      if (streamError) console.error('Error fetching streams:', streamError);
      setClasses(classData || []);
      setStreams(streamData || []);
    };
    loadRefData();
  }, []);

  useEffect(() => {
    fetchStudents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, searchTerm, filterClass, paramStream]);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('students')
        .select('id, name, email, photo_url, class_id, stream_id', { count: 'exact' })
        .order('created_at', { ascending: false });

      // Filters
      if (searchTerm) {
        // Supabase: chain ilike filters with or()
        query = query.or(
          `name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%`
        );
      }
      if (filterClass && filterClass !== 'all') {
        query = query.eq('class_id', filterClass);
      }
      if (paramStream) {
        query = query.eq('stream_id', paramStream);
      }

      // Pagination
      const from = (currentPage - 1) * pageSize;
      const to = from + pageSize - 1;
      const { data, error, count } = await query.range(from, to);

      if (error) {
        console.error('Error fetching students:', error);
        toast.error('Failed to fetch students');
        return;
      }

      setStudents(data || []);
      setTotalCount(count || 0);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to fetch students');
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  const exportToCSV = () => {
    const headers = ['ID', 'Name', 'Email', 'Class', 'Stream'];
    const csvData = students.map(student => [
      student.id,
      student.name || '',
      student.email || '',
      student.class_id ? (classNameById[student.class_id] || student.class_id) : '',
      student.stream_id ? (streamNameById[student.stream_id] || student.stream_id) : ''
    ]);

    const csvContent = [headers, ...csvData]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `students_page_${currentPage}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const visiblePages = useMemo(() => {
    const pages: number[] = [];
    const maxToShow = 5;
    let start = Math.max(1, currentPage - Math.floor(maxToShow / 2));
    let end = Math.min(totalPages, start + maxToShow - 1);
    start = Math.max(1, Math.min(start, end - maxToShow + 1));
    for (let p = start; p <= end; p++) pages.push(p);
    return pages;
  }, [currentPage, totalPages]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground">Loading students...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigate('/')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Students</h1>
            <p className="text-muted-foreground">
              Showing {(students.length ? (currentPage - 1) * pageSize + 1 : 0)}–{(currentPage - 1) * pageSize + students.length} of {totalCount}
            </p>
          </div>
        </div>
        <Button onClick={exportToCSV} className="gap-2">
          <Download className="h-4 w-4" />
          Export CSV
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters & Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 flex-wrap">
            <div className="flex-1 min-w-64">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filterClass} onValueChange={(v) => { setFilterClass(v); setCurrentPage(1); }}>
              <SelectTrigger className="w-56">
                <SelectValue placeholder="Filter by class" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Classes</SelectItem>
                {classes.map(c => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Students Table */}
      <Card>
        <CardHeader>
          <CardTitle>Students ({students.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Class</TableHead>
                  <TableHead>Stream</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8">
                      No students found.
                    </TableCell>
                  </TableRow>
                ) : (
                  students.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={student.photo_url}
                              onError={(e) => { (e.currentTarget as HTMLImageElement).src = defaultAvatar; }}
                              alt={`${student.name || 'Student'} avatar`} />
                            <AvatarFallback>
                              {student.name?.split(' ').map(n => n[0]).join('') || 'ST'}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{student.name || 'No Name'}</p>
                            <p className="text-xs text-muted-foreground">{student.id}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm">{student.email}</p>
                      </TableCell>
                      <TableCell>
                        {student.class_id ? (classNameById[student.class_id] || student.class_id) : '-'}
                      </TableCell>
                      <TableCell>
                        {student.stream_id ? (streamNameById[student.stream_id] || student.stream_id) : '-'}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="mt-4 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Page {currentPage} of {totalPages}</p>
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious href="#" onClick={(e) => { e.preventDefault(); handlePageChange(currentPage - 1); }} />
                </PaginationItem>
                {visiblePages[0] > 1 && (
                  <>
                    <PaginationItem>
                      <PaginationLink href="#" onClick={(e) => { e.preventDefault(); handlePageChange(1); }}>1</PaginationLink>
                    </PaginationItem>
                    {visiblePages[0] > 2 && (
                      <PaginationItem>
                        <PaginationEllipsis />
                      </PaginationItem>
                    )}
                  </>
                )}
                {visiblePages.map(p => (
                  <PaginationItem key={p}>
                    <PaginationLink href="#" isActive={p === currentPage} onClick={(e) => { e.preventDefault(); handlePageChange(p); }}>
                      {p}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                {visiblePages[visiblePages.length - 1] < totalPages && (
                  <>
                    {visiblePages[visiblePages.length - 1] < totalPages - 1 && (
                      <PaginationItem>
                        <PaginationEllipsis />
                      </PaginationItem>
                    )}
                    <PaginationItem>
                      <PaginationLink href="#" onClick={(e) => { e.preventDefault(); handlePageChange(totalPages); }}>{totalPages}</PaginationLink>
                    </PaginationItem>
                  </>
                )}
                <PaginationItem>
                  <PaginationNext href="#" onClick={(e) => { e.preventDefault(); handlePageChange(currentPage + 1); }} />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
