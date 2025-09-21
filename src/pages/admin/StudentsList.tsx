import { useState, useEffect, useMemo, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { HighlightText } from "@/utils/textHighlighter";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  Loader2,
  FileText,
  ChevronDown
} from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import defaultAvatar from "@/assets/default-avatar.png";
import headerImage from "@/assets/header.png";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useAuth } from "@/hooks/useAuth";

interface Student {
  id: string;
  name: string;
  email: string;
  photo_url?: string;
  class_id?: string;
  stream_id?: string;
  is_verified?: boolean;
  created_at?: string;
  default_password?: string;
}

export default function StudentsList() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { userRole, userName, photoUrl, signOut } = useAuth();

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const [totalCount, setTotalCount] = useState(0);

  // Data
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [filterClass, setFilterClass] = useState<string>("all");
  const [filterStream, setFilterStream] = useState<string>("all");
  const [filterVerified, setFilterVerified] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("created_at");
  const [sortOrder, setSortOrder] = useState<string>("desc");
  const [paramStream, setParamStream] = useState<string | null>(null);

  // Reference data maps
  const [classes, setClasses] = useState<{ id: string; name: string }[]>([]);
  const [streams, setStreams] = useState<{ id: string; name: string; class_id?: string }[]>([]);

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

  // Dynamic filter helpers
  const filteredStreams = useMemo(() => {
    if (filterClass === 'all') return streams;
    return streams.filter(stream => stream.class_id === filterClass);
  }, [streams, filterClass]);

  const filteredClasses = useMemo(() => {
    if (filterStream === 'all') return classes;
    const selectedStream = streams.find(s => s.id === filterStream);
    if (!selectedStream?.class_id) return classes;
    return classes.filter(c => c.id === selectedStream.class_id);
  }, [classes, streams, filterStream]);

  // Initialize from query params
  useEffect(() => {
    const classParam = searchParams.get("class");
    const streamParam = searchParams.get("stream");
    if (classParam) setFilterClass(classParam);
    if (streamParam) {
      setParamStream(streamParam);
      setFilterStream(streamParam);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const loadRefData = async () => {
      const [{ data: classData, error: classError }, { data: streamData, error: streamError }] = await Promise.all([
        supabase.from('classes').select('id, name'),
        supabase.from('streams').select('id, name, class_id')
      ]);
      if (classError) console.error('Error fetching classes:', classError);
      if (streamError) console.error('Error fetching streams:', streamError);
      setClasses(classData || []);
      setStreams(streamData || []);
    };
    loadRefData();
  }, []);

  // Debounce search term
  useEffect(() => {
    if (searchTerm !== debouncedSearchTerm) {
      setIsSearching(true);
    }
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setIsSearching(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm, debouncedSearchTerm]);

  useEffect(() => {
    fetchStudents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, debouncedSearchTerm, filterClass, filterStream, filterVerified, sortBy, sortOrder, paramStream]);

  const fetchStudents = async () => {
    try {
      // Only show main loading on initial load, not during search
      if (!debouncedSearchTerm && filterClass === 'all' && filterStream === 'all' && filterVerified === 'all') {
        setLoading(true);
      }
      let query = supabase
        .from('students')
        .select('id, name, email, photo_url, class_id, stream_id, is_verified, created_at, default_password', { count: 'exact' })
        .order(sortBy, { ascending: sortOrder === 'asc' });

      // Filters
      if (debouncedSearchTerm) {
        // Enhanced search across multiple fields
        query = query.or(
          `name.ilike.%${debouncedSearchTerm}%,email.ilike.%${debouncedSearchTerm}%,id.ilike.%${debouncedSearchTerm}%`
        );
      }
      if (filterClass && filterClass !== 'all') {
        query = query.eq('class_id', filterClass);
      }
      const streamId = (filterStream && filterStream !== 'all') ? filterStream : paramStream;
      if (streamId) {
        query = query.eq('stream_id', streamId);
      }
      if (filterVerified && filterVerified !== 'all') {
        query = query.eq('is_verified', filterVerified === 'verified');
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
    const headers = ['Name', 'Email', 'Password', 'Class', 'Stream'];
    const csvData = students.map(student => [
      student.name || '',
      student.email || '',
      '********', // Password placeholder
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

  const handlePrint = useCallback(async () => {
    setIsPrinting(true);
    try {
      console.log('StudentsList: Printing with filters', { filterClass, filterStream, paramStream, filterVerified, debouncedSearchTerm });
      // 1) Get filtered students for printing
      const allFilteredStudents = await fetchAllFilteredStudents();
      console.log('StudentsList: Fetched for printing', allFilteredStudents.length);

      // 2) Preload photos and convert to data URLs so they are embedded and ready at print time
      const toDataUrl = async (url: string): Promise<string> => {
        try {
          const res = await fetch(url, { cache: 'no-store' });
          const blob = await res.blob();
          return await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.onerror = () => reject(new Error('Failed to read image blob'));
            reader.readAsDataURL(blob);
          });
        } catch (e) {
          console.warn('Failed to inline image', url, e);
          return '';
        }
      };

      const studentsWithPhotos = await Promise.all(
        allFilteredStudents.map(async (s) => {
          const src = s.photo_url || defaultAvatar;
          const dataUrl = src ? await toDataUrl(src) : '';
          return { ...s, photoDataUrl: dataUrl } as Student & { photoDataUrl?: string };
        })
      );

      // 3) Create a print-friendly HTML page using embedded images
      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        toast.error('Please allow popups to print the report');
        return;
      }

      const filterInfo = getFilterDescription();
      const currentDate = new Date().toLocaleDateString('en-US', { 
        month: 'long', 
        day: 'numeric', 
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true 
      });

      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Student Details Report</title>
          <meta charset=\"utf-8\" />
          <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\" />
          <style>
            @media print { @page { margin: 0.5in; } }
            body { font-family: Arial, sans-serif; margin: 0; padding: 20px; font-size: 12px; }
            .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #003366; padding-bottom: 20px; }
            .school-name { font-size: 24px; font-weight: bold; color: #003366; margin-bottom: 5px; }
            .report-title { font-size: 18px; font-weight: bold; margin: 10px 0; }
            .report-info { font-size: 10px; color: #666; margin: 5px 0; }
            .students-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin-top: 20px; }
            .student-card { border: 1px solid #ddd; border-radius: 8px; padding: 15px; display: flex; align-items: center; gap: 15px; page-break-inside: avoid; }
            .student-photo { width: 50px; height: 50px; border-radius: 50%; object-fit: cover; border: 2px solid #003366; }
            .photo-placeholder { width: 50px; height: 50px; border-radius: 50%; background-color: #f0f0f0; display: flex; align-items: center; justify-content: center; font-size: 20px; border: 2px solid #003366; }
            .student-info { flex: 1; }
            .student-name { font-weight: bold; font-size: 14px; color: #003366; margin-bottom: 5px; }
            .student-email { color: #666; font-size: 11px; margin-bottom: 3px; word-break: break-all; }
            .student-password { font-weight: bold; color: #003366; font-size: 12px; }
            .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 10px; color: #666; }
          </style>
        </head>
        <body>
          <div class=\"header\">
            <img src=\"${headerImage}\" alt=\"School Header\" style=\"max-width: 100%; height: auto; margin-bottom: 20px;\" />
            <div class=\"report-title\">STUDENT DETAILS REPORT</div>
            ${filterInfo ? `<div class=\"report-info\">Filter: ${filterInfo}</div>` : ''}
            <div class=\"report-info\">Generated on: ${currentDate}</div>
            <div class=\"report-info\">Total Students: ${studentsWithPhotos.length}</div>
          </div>
          <div class=\"students-grid\">
            ${studentsWithPhotos.map(student => `
              <div class=\"student-card\">
                ${student.photoDataUrl ? 
                  `<img src=\"${student.photoDataUrl}\" alt=\"${student.name || 'Student'}\" class=\"student-photo\" />` :
                  `<div class=\"photo-placeholder\">👤</div>`
                }
                <div class=\"student-info\">
                  <div class=\"student-name\">${(student.name || '').toUpperCase()}</div>
                  <div class=\"student-email\">${student.email || ''}</div>
                  <div class=\"student-password\">Password: ${student.default_password || '****'}</div>
                </div>
              </div>
            `).join('')}
          </div>
          <div class=\"footer\">
            <div>Glorious School - Student Details Report</div>
            <div>Generated: ${new Date().toLocaleDateString()}</div>
          </div>
          <script>
            // Wait for all images to finish loading before printing
            (function() {
              var imgs = Array.prototype.slice.call(document.images);
              if (imgs.length === 0) { window.focus(); window.print(); return; }
              var loaded = 0; var done = false;
              function finish() { if (done) return; done = true; window.focus(); window.print(); }
              function check() { loaded++; if (loaded >= imgs.length) finish(); }
              imgs.forEach(function(img){
                if (img.complete) return check();
                img.addEventListener('load', check);
                img.addEventListener('error', check);
              });
              setTimeout(finish, 7000); // Fallback in case some images hang
            })();
          </script>
        </body>
        </html>
      `);

      printWindow.document.close();

      toast.success('Print dialog opened successfully');
    } catch (error) {
      console.error('Error generating print view:', error);
      toast.error('Failed to prepare print view');
    } finally {
      setIsPrinting(false);
    }
  }, [debouncedSearchTerm, filterClass, filterStream, filterVerified, sortBy, sortOrder, paramStream]);

  // Helper function to fetch all filtered students
  const fetchAllFilteredStudents = async (): Promise<Student[]> => {
    try {
      let query = supabase
        .from('students')
        .select('id, name, email, photo_url, class_id, stream_id, is_verified, created_at, default_password')
        .order(sortBy, { ascending: sortOrder === 'asc' });

      // Apply the same filters as the main query
      if (debouncedSearchTerm) {
        query = query.or(
          `name.ilike.%${debouncedSearchTerm}%,email.ilike.%${debouncedSearchTerm}%,id.ilike.%${debouncedSearchTerm}%`
        );
      }
      if (filterClass && filterClass !== 'all') {
        query = query.eq('class_id', filterClass);
      }
      const streamId = (filterStream && filterStream !== 'all') ? filterStream : paramStream;
      if (streamId) {
        query = query.eq('stream_id', streamId);
      }
      if (filterVerified && filterVerified !== 'all') {
        query = query.eq('is_verified', filterVerified === 'verified');
      }

      const { data, error } = await query;
      console.log('StudentsList: fetchAllFilteredStudents returned', {
        count: data?.length || 0,
        filterClass,
        filterStream,
        paramStream,
        filterVerified,
        debouncedSearchTerm,
        sortBy,
        sortOrder,
      });
      
      if (error) {
        console.error('Error fetching all students:', error);
        return students; // Fallback to current page students
      }
      
      return data || [];
    } catch (error) {
      console.error('Error:', error);
      return students; // Fallback to current page students
    }
  };

  // Helper function to get filter description
  const getFilterDescription = (): string => {
    const filters = [];
    
    if (filterClass && filterClass !== 'all') {
      const className = classNameById[filterClass] || filterClass;
      filters.push(`Class: ${className}`);
    }
    
    const streamId = (filterStream && filterStream !== 'all') ? filterStream : paramStream;
    if (streamId) {
      const streamName = streamNameById[streamId] || streamId;
      filters.push(`Stream: ${streamName}`);
    }
    
    if (filterVerified && filterVerified !== 'all') {
      filters.push(`Status: ${filterVerified === 'verified' ? 'Verified' : 'Unverified'}`);
    }
    
    if (debouncedSearchTerm) {
      filters.push(`Search: "${debouncedSearchTerm}"`);
    }
    
    return filters.length > 0 ? filters.join(', ') : 'All Students';
  };

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = async () => {
    try {
      await signOut();
      toast.success("You have been logged out");
      navigate("/login");
    } catch (error: any) {
      toast.error("Failed to log out");
    }
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
      <DashboardLayout userRole={userRole || "admin"} userName={userName} photoUrl={photoUrl} onLogout={handleLogout}>
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
            <p className="text-muted-foreground">Loading students...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout userRole={userRole || "admin"} userName={userName} photoUrl={photoUrl} onLogout={handleLogout}>
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
        <div className="flex gap-2">
          <Button 
            onClick={handlePrint} 
            disabled={isPrinting}
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            {isPrinting ? 'Preparing...' : 'Print'}
          </Button>
        </div>
      </div>

      {/* Compact Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Search & Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 items-center">
            {/* Search Input */}
            <div className="flex-1 min-w-64">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, email, or ID..."
                  value={searchTerm}
                  onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                  className="pl-10"
                />
                {isSearching && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <div className="h-4 w-4 rounded-full border-2 border-orange-500 border-t-transparent animate-spin"></div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Compact Filter Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Filter className="h-4 w-4" />
                  Filters
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-background border z-50" align="end">
                <div className="p-3 space-y-3">
                  <div>
                    <label className="text-sm font-medium mb-1 block">Class</label>
                    <Select 
                      value={filterClass} 
                      onValueChange={(v) => { 
                        setFilterClass(v); 
                        if (v !== 'all' && filterStream !== 'all') {
                          // Check if current stream belongs to selected class
                          const selectedStream = streams.find(s => s.id === filterStream);
                          if (selectedStream?.class_id !== v) {
                            setFilterStream('all');
                          }
                        }
                        setCurrentPage(1); 
                      }}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="All Classes" />
                      </SelectTrigger>
                      <SelectContent className="bg-background border z-50 max-h-48 overflow-y-auto">
                        <SelectItem value="all">All Classes</SelectItem>
                        {filteredClasses.map(c => (
                          <SelectItem key={c.id} value={c.id}>
                            {c.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-1 block">Stream</label>
                    <Select 
                      value={filterStream} 
                      onValueChange={(v) => { 
                        setFilterStream(v); 
                        if (v !== 'all') {
                          // Auto-select the class of the selected stream
                          const selectedStream = streams.find(s => s.id === v);
                          if (selectedStream?.class_id && filterClass !== selectedStream.class_id) {
                            setFilterClass(selectedStream.class_id);
                          }
                        }
                        setCurrentPage(1); 
                      }}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="All Streams" />
                      </SelectTrigger>
                      <SelectContent className="bg-background border z-50 max-h-48 overflow-y-auto">
                        <SelectItem value="all">All Streams</SelectItem>
                        {filteredStreams.map(s => (
                          <SelectItem key={s.id} value={s.id}>
                            {s.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-1 block">Status</label>
                    <Select value={filterVerified} onValueChange={(v) => { setFilterVerified(v); setCurrentPage(1); }}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="All Students" />
                      </SelectTrigger>
                      <SelectContent className="bg-background border z-50 max-h-48 overflow-y-auto">
                        <SelectItem value="all">All Students</SelectItem>
                        <SelectItem value="verified">Verified Only</SelectItem>
                        <SelectItem value="unverified">Unverified Only</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-1 block">Sort By</label>
                    <Select value={sortBy} onValueChange={(v) => { setSortBy(v); setCurrentPage(1); }}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Sort by" />
                      </SelectTrigger>
                      <SelectContent className="bg-background border z-50 max-h-48 overflow-y-auto">
                        <SelectItem value="created_at">Date Created</SelectItem>
                        <SelectItem value="name">Name</SelectItem>
                        <SelectItem value="email">Email</SelectItem>
                        <SelectItem value="class_id">Class</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-1 block">Order</label>
                    <Select value={sortOrder} onValueChange={(v) => { setSortOrder(v); setCurrentPage(1); }}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Sort order" />
                      </SelectTrigger>
                      <SelectContent className="bg-background border z-50 max-h-48 overflow-y-auto">
                        <SelectItem value="desc">Newest First</SelectItem>
                        <SelectItem value="asc">Oldest First</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
            
            {/* Clear Filters Button */}
            <Button 
              variant="outline" 
              onClick={() => {
                setSearchTerm("");
                setFilterClass("all");
                setFilterStream("all");
                setFilterVerified("all");
                setSortBy("created_at");
                setSortOrder("desc");
                setCurrentPage(1);
              }}
              className="px-4"
            >
              Clear Filters
            </Button>
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
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      No students found matching your criteria.
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
                            <p className="font-medium">
                              <HighlightText text={student.name || 'No Name'} searchTerm={debouncedSearchTerm} />
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm">
                          <HighlightText text={student.email || ''} searchTerm={debouncedSearchTerm} />
                        </p>
                      </TableCell>
                      <TableCell>
                        {student.class_id ? (classNameById[student.class_id] || student.class_id) : '-'}
                      </TableCell>
                      <TableCell>
                        {student.stream_id ? (streamNameById[student.stream_id] || student.stream_id) : '-'}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {student.is_verified ? (
                            <>
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                              <span className="text-sm text-green-700 dark:text-green-400">Verified</span>
                            </>
                          ) : (
                            <>
                              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                              <span className="text-sm text-orange-700 dark:text-orange-400">Pending</span>
                            </>
                          )}
                        </div>
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
    </DashboardLayout>
  );
}
