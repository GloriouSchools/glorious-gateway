import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
  Search, 
  Filter, 
  Download, 
  Mail,
  Phone,
  MapPin,
  ArrowLeft,
  Loader2,
  FileText
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useAuth } from "@/hooks/useAuth";
import { StudentsPagination } from "@/components/admin/StudentsPagination";

interface Teacher {
  id: string;
  teacher_id?: string;
  name: string;
  email: string;
  personal_email?: string;
  photo_url?: string;
  nationality?: string;
  sex?: string;
  contactNumber?: number;
  classesTaught?: string;
  subjectsTaught?: string;
  is_verified: boolean;
  created_at: string;
}

export default function TeachersList() {
  const navigate = useNavigate();
  const { userName, photoUrl } = useAuth();
  
  const handleLogout = () => {
    navigate('/login');
  };
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [filteredTeachers, setFilteredTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    fetchTeachers();
  }, []);

  useEffect(() => {
    filterTeachers();
  }, [teachers, debouncedSearchTerm, filterType]);

  const fetchTeachers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('teachers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching teachers:', error);
        toast.error('Failed to fetch teachers');
        return;
      }

      setTeachers(data || []);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to fetch teachers');
    } finally {
      setLoading(false);
    }
  };

  const filterTeachers = () => {
    let filtered = teachers;

    // Search filter
    if (debouncedSearchTerm) {
      filtered = filtered.filter(teacher =>
        teacher.name?.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        teacher.email?.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        teacher.teacher_id?.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        teacher.subjectsTaught?.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
      );
    }

    // Advanced filters
    if (filterType !== "all") {
      const [filterCategory, filterValue] = filterType.split("-");
      
      if (filterCategory === "status") {
        if (filterValue === "verified") filtered = filtered.filter(teacher => teacher.is_verified);
        if (filterValue === "unverified") filtered = filtered.filter(teacher => !teacher.is_verified);
      } else if (filterCategory === "gender") {
        filtered = filtered.filter(teacher => teacher.sex === filterValue);
      }
    }

    setFilteredTeachers(filtered);
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text('Teachers Report', 20, 20);
    doc.setFontSize(12);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 30);
    doc.text(`Total Teachers: ${filteredTeachers.length}`, 20, 40);

    const tableData = filteredTeachers.map(teacher => [
      teacher.photo_url ? 'Photo' : 'No Photo',
      teacher.name || 'No Name',
      teacher.email || 'No Email',
      teacher.teacher_id || 'No ID'
    ]);

    (doc as any).autoTable({
      head: [['Avatar', 'Name', 'Email', 'Teacher ID']],
      body: tableData,
      startY: 50,
      styles: { fontSize: 10 },
      headStyles: { fillColor: [59, 130, 246] },
    });

    doc.save('teachers-report.pdf');
  };

  // Pagination
  const paginatedTeachers = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredTeachers.slice(startIndex, endIndex);
  }, [filteredTeachers, currentPage]);

  const totalPages = Math.ceil(filteredTeachers.length / itemsPerPage);

  const visiblePages = useMemo(() => {
    const maxVisible = 5;
    const pages: number[] = [];
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
      let end = Math.min(totalPages, start + maxVisible - 1);
      
      if (end - start < maxVisible - 1) {
        start = Math.max(1, end - maxVisible + 1);
      }
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
    }
    
    return pages;
  }, [currentPage, totalPages]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchTerm, filterType]);

  const filterOptions = useMemo(() => {
    const statusOptions = [
      { value: "status-verified", label: "Verified" },
      { value: "status-unverified", label: "Unverified" }
    ];
    
    const genderOptions = [
      { value: "gender-Male", label: "Male" },
      { value: "gender-Female", label: "Female" }
    ];

    return [
      { label: "Status", options: statusOptions },
      { label: "Gender", options: genderOptions }
    ];
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground">Loading teachers...</p>
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout 
      userRole="admin" 
      userName={userName} 
      photoUrl={photoUrl} 
      onLogout={handleLogout}
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Teachers List</h1>
            <p className="text-muted-foreground">
              Total: {filteredTeachers.length} of {teachers.length} teachers
            </p>
          </div>
          <Button onClick={downloadPDF} className="gap-2">
            <FileText className="h-4 w-4" />
            Download PDF
          </Button>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Search & Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, email, ID, or subject..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="All Filters" />
                </SelectTrigger>
                <SelectContent className="max-h-48 overflow-y-auto">
                  <SelectItem value="all">All Teachers</SelectItem>
                  {filterOptions.map((group) => (
                    group.options.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

      {/* Teachers Table */}
      <div className="space-y-4">
        {/* Desktop Table View */}
        <Card className="hidden lg:block">
          <CardHeader>
            <CardTitle>Teachers ({filteredTeachers.length})</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[200px]">Teacher</TableHead>
                    <TableHead className="min-w-[200px]">Contact</TableHead>
                    <TableHead className="min-w-[150px]">Subjects/Classes</TableHead>
                    <TableHead className="min-w-[120px]">Status</TableHead>
                    <TableHead className="min-w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTeachers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8">
                        No teachers found matching your criteria.
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedTeachers.map((teacher) => (
                      <TableRow key={teacher.id}>
                        <TableCell className="p-4">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10 flex-shrink-0">
                              <AvatarImage src={teacher.photo_url} />
                              <AvatarFallback>
                                {teacher.name?.split(' ').map(n => n[0]).join('') || 'T'}
                              </AvatarFallback>
                            </Avatar>
                            <div className="min-w-0 flex-1">
                              <p className="font-medium truncate">{teacher.name || 'No Name'}</p>
                              <p className="text-sm text-muted-foreground truncate">{teacher.teacher_id || 'No ID'}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="p-4">
                          <div className="space-y-1">
                            <p className="text-sm truncate max-w-[180px]">{teacher.email}</p>
                            {teacher.contactNumber && (
                              <p className="text-xs text-muted-foreground flex items-center gap-1">
                                <Phone className="h-3 w-3 flex-shrink-0" />
                                <span className="truncate">{teacher.contactNumber}</span>
                              </p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="p-4">
                          <div className="space-y-1">
                            {teacher.subjectsTaught && (
                              <p className="text-sm font-medium truncate max-w-[130px]">{teacher.subjectsTaught}</p>
                            )}
                            {teacher.classesTaught && (
                              <p className="text-xs text-muted-foreground truncate max-w-[130px]">Classes: {teacher.classesTaught}</p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="p-4">
                          <div className="flex flex-col gap-1">
                            <Badge variant={teacher.is_verified ? "default" : "secondary"} className="text-xs w-fit">
                              {teacher.is_verified ? "Verified" : "Unverified"}
                            </Badge>
                            {teacher.sex && (
                              <Badge variant="outline" className="text-xs w-fit">{teacher.sex}</Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="p-4">
                          <div className="flex flex-col gap-1">
                            <Button size="sm" variant="outline" className="h-8 w-full">
                              <Mail className="h-4 w-4 mr-1" />
                              Email
                            </Button>
                            <Button size="sm" variant="outline" className="h-8 w-full">
                              Edit
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
            {totalPages > 1 && (
              <StudentsPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                visiblePages={visiblePages}
              />
            )}
          </CardContent>
        </Card>

        {/* Mobile Card View */}
        <div className="lg:hidden">
          <div className="flex items-center justify-between mb-4 px-1">
            <h3 className="text-base font-semibold">Teachers ({filteredTeachers.length})</h3>
          </div>
          
          {filteredTeachers.length === 0 ? (
            <Card className="mx-1">
              <CardContent className="text-center py-8 text-sm">
                No teachers found matching your criteria.
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3 px-1">
              {paginatedTeachers.map((teacher) => (
                <Card key={teacher.id} className="w-full max-w-full overflow-hidden">
                  <CardContent className="p-3">
                    {/* Header with Avatar and Name */}
                    <div className="flex items-start gap-3 mb-3">
                      <Avatar className="h-10 w-10 flex-shrink-0">
                        <AvatarImage src={teacher.photo_url} />
                        <AvatarFallback className="text-xs">
                          {teacher.name?.split(' ').map(n => n[0]).join('') || 'T'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <h4 className="font-medium text-sm leading-tight mb-1 break-words">
                          {teacher.name || 'No Name'}
                        </h4>
                        <p className="text-xs text-muted-foreground break-all">
                          {teacher.email}
                        </p>
                        {teacher.teacher_id && (
                          <p className="text-xs text-muted-foreground mt-0.5">
                            ID: {teacher.teacher_id}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div className="flex justify-center mb-3">
                      <Badge 
                        variant={teacher.is_verified ? "default" : "secondary"} 
                        className="text-xs px-2 py-1"
                      >
                        {teacher.is_verified ? "✓ Verified" : "⚠ Unverified"}
                      </Badge>
                    </div>
                    
                    {/* Subjects and Classes */}
                    {(teacher.subjectsTaught || teacher.classesTaught) && (
                      <div className="space-y-2 mb-3 p-2 bg-muted/30 rounded">
                        {teacher.subjectsTaught && (
                          <div>
                            <span className="text-xs font-medium text-muted-foreground block mb-1">
                              Subjects:
                            </span>
                            <p className="text-sm font-medium break-words">
                              {teacher.subjectsTaught}
                            </p>
                          </div>
                        )}
                        {teacher.classesTaught && (
                          <div>
                            <span className="text-xs font-medium text-muted-foreground block mb-1">
                              Classes:
                            </span>
                            <p className="text-sm break-words">
                              {teacher.classesTaught}
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                    
                    {/* Additional Info */}
                    <div className="space-y-2 mb-3">
                      {teacher.contactNumber && (
                        <div className="flex items-center gap-2 text-xs">
                          <Phone className="h-3 w-3 flex-shrink-0 text-muted-foreground" />
                          <span className="break-all">{teacher.contactNumber}</span>
                        </div>
                      )}
                      
                      <div className="flex flex-wrap gap-1">
                        {teacher.sex && (
                          <Badge variant="outline" className="text-xs px-2 py-0.5">
                            {teacher.sex}
                          </Badge>
                        )}
                        {teacher.nationality && (
                          <Badge variant="secondary" className="text-xs px-2 py-0.5 flex items-center gap-1 max-w-full">
                            <MapPin className="h-3 w-3 flex-shrink-0" />
                            <span className="truncate">{teacher.nationality}</span>
                          </Badge>
                        )}
                      </div>
                      
                      <div className="text-xs text-muted-foreground">
                        Joined: {new Date(teacher.created_at).toLocaleDateString()}
                      </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="grid grid-cols-2 gap-2">
                      <Button size="sm" variant="outline" className="h-8 text-xs">
                        <Mail className="h-3 w-3 mr-1" />
                        Email
                      </Button>
                      <Button size="sm" variant="outline" className="h-8 text-xs">
                        Edit
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
          
          {totalPages > 1 && (
            <StudentsPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              visiblePages={visiblePages}
            />
          )}
        </div>
      </div>
      </div>
    </DashboardLayout>
  );
}