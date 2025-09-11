import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
  ArrowLeft,
  Loader2,
  BookOpen,
  Users
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Class {
  id: string;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

interface ClassWithCounts extends Class {
  studentCount: number;
  streamCount: number;
}

export default function ClassesList() {
  const navigate = useNavigate();
  const [classes, setClasses] = useState<ClassWithCounts[]>([]);
  const [filteredClasses, setFilteredClasses] = useState<ClassWithCounts[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchClasses();
  }, []);

  useEffect(() => {
    filterClasses();
  }, [classes, searchTerm]);

  const fetchClasses = async () => {
    try {
      setLoading(true);
      
      // Fetch classes
      const { data: classesData, error: classesError } = await supabase
        .from('classes')
        .select('*')
        .order('created_at', { ascending: false });

      if (classesError) {
        console.error('Error fetching classes:', classesError);
        toast.error('Failed to fetch classes');
        return;
      }

      // Fetch student counts for each class
      const classesWithCounts = await Promise.all(
        (classesData || []).map(async (classItem) => {
          const [studentCountResult, streamCountResult] = await Promise.all([
            supabase
              .from('students')
              .select('id')
              .eq('class_id', classItem.id),
            supabase
              .from('streams')
              .select('id')
              .eq('class_id', classItem.id)
          ]);

          return {
            ...classItem,
            studentCount: studentCountResult.data?.length || 0,
            streamCount: streamCountResult.data?.length || 0
          };
        })
      );

      setClasses(classesWithCounts);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to fetch classes');
    } finally {
      setLoading(false);
    }
  };

  const filterClasses = () => {
    let filtered = classes;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(classItem =>
        classItem.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        classItem.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        classItem.id?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredClasses(filtered);
  };

  const exportToCSV = () => {
    const headers = ['ID', 'Name', 'Description', 'Students', 'Streams', 'Created At', 'Updated At'];
    const csvData = filteredClasses.map(classItem => [
      classItem.id,
      classItem.name || '',
      classItem.description || '',
      classItem.studentCount,
      classItem.streamCount,
      new Date(classItem.created_at).toLocaleDateString(),
      new Date(classItem.updated_at).toLocaleDateString()
    ]);

    const csvContent = [headers, ...csvData]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'classes.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground">Loading classes...</p>
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
            <h1 className="text-3xl font-bold tracking-tight">Classes List</h1>
            <p className="text-muted-foreground">
              Total: {filteredClasses.length} of {classes.length} classes
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button onClick={exportToCSV} variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Search Classes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 flex-wrap">
            <div className="flex-1 min-w-64">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, description, or ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Classes Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredClasses.length === 0 ? (
          <Card className="col-span-full">
            <CardContent className="text-center py-8">
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg font-medium">No classes found</p>
              <p className="text-muted-foreground">No classes match your search criteria.</p>
            </CardContent>
          </Card>
        ) : (
          filteredClasses.map((classItem) => (
            <Card key={classItem.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{classItem.name || 'Unnamed Class'}</CardTitle>
                    <p className="text-xs text-muted-foreground mt-1">ID: {classItem.id}</p>
                  </div>
                  <BookOpen className="h-5 w-5 text-primary" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {classItem.description && (
                    <p className="text-sm text-muted-foreground">{classItem.description}</p>
                  )}
                  
                  <div className="flex gap-4">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">{classItem.studentCount}</span>
                      <span className="text-xs text-muted-foreground">Students</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">{classItem.streamCount}</span>
                      <span className="text-xs text-muted-foreground">Streams</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">
                      Created: {new Date(classItem.created_at).toLocaleDateString()}
                    </Badge>
                    {classItem.updated_at !== classItem.created_at && (
                      <Badge variant="secondary">
                        Updated: {new Date(classItem.updated_at).toLocaleDateString()}
                      </Badge>
                    )}
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button size="sm" variant="outline" className="flex-1" onClick={() => navigate(`/admin/students?class=${classItem.id}`)}>
                      View Students
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Summary Table */}
      <Card>
        <CardHeader>
          <CardTitle>Classes Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Class Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Students</TableHead>
                  <TableHead>Streams</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClasses.map((classItem) => (
                  <TableRow key={classItem.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{classItem.name || 'Unnamed Class'}</p>
                        <p className="text-xs text-muted-foreground">{classItem.id}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm">{classItem.description || 'No description'}</p>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{classItem.studentCount}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{classItem.streamCount}</Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(classItem.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Button size="sm" variant="outline" onClick={() => navigate(`/admin/students?class=${classItem.id}`)}>
                        View Students
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}