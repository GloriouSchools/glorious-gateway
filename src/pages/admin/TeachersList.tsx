import { useState, useEffect } from "react";
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
  Loader2
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [filteredTeachers, setFilteredTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterGender, setFilterGender] = useState("all");

  useEffect(() => {
    fetchTeachers();
  }, []);

  useEffect(() => {
    filterTeachers();
  }, [teachers, searchTerm, filterStatus, filterGender]);

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
    if (searchTerm) {
      filtered = filtered.filter(teacher =>
        teacher.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        teacher.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        teacher.teacher_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        teacher.subjectsTaught?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (filterStatus !== "all") {
      filtered = filtered.filter(teacher => {
        if (filterStatus === "verified") return teacher.is_verified;
        if (filterStatus === "unverified") return !teacher.is_verified;
        return true;
      });
    }

    // Gender filter
    if (filterGender !== "all") {
      filtered = filtered.filter(teacher => teacher.sex === filterGender);
    }

    setFilteredTeachers(filtered);
  };

  const exportToCSV = () => {
    const headers = ['ID', 'Teacher ID', 'Name', 'Email', 'Personal Email', 'Nationality', 'Gender', 'Contact', 'Subjects', 'Classes', 'Verified', 'Created At'];
    const csvData = filteredTeachers.map(teacher => [
      teacher.id,
      teacher.teacher_id || '',
      teacher.name || '',
      teacher.email || '',
      teacher.personal_email || '',
      teacher.nationality || '',
      teacher.sex || '',
      teacher.contactNumber || '',
      teacher.subjectsTaught || '',
      teacher.classesTaught || '',
      teacher.is_verified ? 'Yes' : 'No',
      new Date(teacher.created_at).toLocaleDateString()
    ]);

    const csvContent = [headers, ...csvData]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'teachers.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

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
            <h1 className="text-3xl font-bold tracking-tight">Teachers List</h1>
            <p className="text-muted-foreground">
              Total: {filteredTeachers.length} of {teachers.length} teachers
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
                  placeholder="Search by name, email, ID, or subject..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="verified">Verified</SelectItem>
                <SelectItem value="unverified">Unverified</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterGender} onValueChange={setFilterGender}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Genders</SelectItem>
                <SelectItem value="Male">Male</SelectItem>
                <SelectItem value="Female">Female</SelectItem>
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
                            <p className="text-xs text-muted-foreground">
                              ID: {teacher.teacher_id || teacher.id}
                            </p>
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
  );
}