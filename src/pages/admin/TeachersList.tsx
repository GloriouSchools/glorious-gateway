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
            <div className="flex gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by name, email, ID, or subject..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-48">
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
      <Card>
        <CardHeader>
          <CardTitle>Teachers ({filteredTeachers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Teacher</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Subjects/Classes</TableHead>
                  <TableHead>Details</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTeachers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      No teachers found matching your criteria.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTeachers.map((teacher) => (
                    <TableRow key={teacher.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={teacher.photo_url} />
                            <AvatarFallback>
                              {teacher.name?.split(' ').map(n => n[0]).join('') || 'T'}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{teacher.name || 'No Name'}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <p className="text-sm">{teacher.email}</p>
                          {teacher.personal_email && (
                            <p className="text-xs text-muted-foreground">{teacher.personal_email}</p>
                          )}
                          {teacher.contactNumber && (
                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              {teacher.contactNumber}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {teacher.subjectsTaught && (
                            <p className="text-sm font-medium">{teacher.subjectsTaught}</p>
                          )}
                          {teacher.classesTaught && (
                            <p className="text-xs text-muted-foreground">Classes: {teacher.classesTaught}</p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {teacher.sex && (
                            <Badge variant="outline">{teacher.sex}</Badge>
                          )}
                          {teacher.nationality && (
                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {teacher.nationality}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={teacher.is_verified ? "default" : "secondary"}>
                          {teacher.is_verified ? "Verified" : "Unverified"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(teacher.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Mail className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline">
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
        </CardContent>
      </Card>
      </div>
    </DashboardLayout>
  );
}