import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
  ArrowLeft,
  Loader2,
  Building,
  Users,
  BookOpen
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Stream {
  id: string;
  name: string;
  description?: string;
  class_id?: string;
  created_at: string;
  updated_at: string;
}

interface StreamWithCounts extends Stream {
  studentCount: number;
  className?: string;
}

export default function StreamsList() {
  const navigate = useNavigate();
  const [streams, setStreams] = useState<StreamWithCounts[]>([]);
  const [filteredStreams, setFilteredStreams] = useState<StreamWithCounts[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterClass, setFilterClass] = useState("all");
  const [classes, setClasses] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    fetchStreams();
  }, []);

  useEffect(() => {
    filterStreams();
  }, [streams, searchTerm, filterClass]);

  const fetchStreams = async () => {
    try {
      setLoading(true);
      
      // Fetch classes first
      const { data: classesData, error: classesError } = await supabase
        .from('classes')
        .select('id, name');

      if (classesError) {
        console.error('Error fetching classes:', classesError);
      } else {
        setClasses(classesData || []);
      }
      
      // Fetch streams
      const { data: streamsData, error: streamsError } = await supabase
        .from('streams')
        .select('*')
        .order('created_at', { ascending: false });

      if (streamsError) {
        console.error('Error fetching streams:', streamsError);
        toast.error('Failed to fetch streams');
        return;
      }

      // Fetch student counts for each stream and add class names
      const streamsWithCounts = await Promise.all(
        (streamsData || []).map(async (stream) => {
          const { data: studentData } = await supabase
            .from('students')
            .select('id')
            .eq('stream_id', stream.id);

          const className = classesData?.find(c => c.id === stream.class_id)?.name;

          return {
            ...stream,
            studentCount: studentData?.length || 0,
            className
          };
        })
      );

      setStreams(streamsWithCounts);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to fetch streams');
    } finally {
      setLoading(false);
    }
  };

  const filterStreams = () => {
    let filtered = streams;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(stream =>
        stream.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        stream.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        stream.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        stream.className?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Class filter
    if (filterClass !== "all") {
      filtered = filtered.filter(stream => stream.class_id === filterClass);
    }

    setFilteredStreams(filtered);
  };

  const exportToCSV = () => {
    const headers = ['ID', 'Name', 'Description', 'Class', 'Students', 'Created At', 'Updated At'];
    const csvData = filteredStreams.map(stream => [
      stream.id,
      stream.name || '',
      stream.description || '',
      stream.className || '',
      stream.studentCount,
      new Date(stream.created_at).toLocaleDateString(),
      new Date(stream.updated_at).toLocaleDateString()
    ]);

    const csvContent = [headers, ...csvData]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'streams.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground">Loading streams...</p>
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
            <h1 className="text-3xl font-bold tracking-tight">Streams List</h1>
            <p className="text-muted-foreground">
              Total: {filteredStreams.length} of {streams.length} streams
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
            Filters & Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 flex-wrap">
            <div className="flex-1 min-w-64">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, description, class, or ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filterClass} onValueChange={setFilterClass}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by class" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Classes</SelectItem>
                {classes.map(classItem => (
                  <SelectItem key={classItem.id} value={classItem.id}>
                    {classItem.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Streams Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredStreams.length === 0 ? (
          <Card className="col-span-full">
            <CardContent className="text-center py-8">
              <Building className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg font-medium">No streams found</p>
              <p className="text-muted-foreground">No streams match your search criteria.</p>
            </CardContent>
          </Card>
        ) : (
          filteredStreams.map((stream) => (
            <Card key={stream.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{stream.name || 'Unnamed Stream'}</CardTitle>
                    <p className="text-xs text-muted-foreground mt-1">ID: {stream.id}</p>
                  </div>
                  <Building className="h-5 w-5 text-primary" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stream.description && (
                    <p className="text-sm text-muted-foreground">{stream.description}</p>
                  )}
                  
                  <div className="flex flex-wrap gap-2">
                    {stream.className && (
                      <Badge variant="outline" className="flex items-center gap-1">
                        <BookOpen className="h-3 w-3" />
                        {stream.className}
                      </Badge>
                    )}
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {stream.studentCount} Students
                    </Badge>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">
                      Created: {new Date(stream.created_at).toLocaleDateString()}
                    </Badge>
                    {stream.updated_at !== stream.created_at && (
                      <Badge variant="secondary">
                        Updated: {new Date(stream.updated_at).toLocaleDateString()}
                      </Badge>
                    )}
                  </div>

                    <div className="flex gap-2 pt-2">
                      <Button size="sm" variant="outline" className="flex-1" onClick={() => navigate(`/admin/students?stream=${stream.id}`)}>
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
          <CardTitle>Streams Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Stream Name</TableHead>
                  <TableHead>Class</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Students</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStreams.map((stream) => (
                  <TableRow key={stream.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{stream.name || 'Unnamed Stream'}</p>
                        <p className="text-xs text-muted-foreground">{stream.id}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      {stream.className ? (
                        <Badge variant="outline">{stream.className}</Badge>
                      ) : (
                        <span className="text-muted-foreground">No class</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <p className="text-sm">{stream.description || 'No description'}</p>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{stream.studentCount}</Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(stream.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => navigate(`/admin/students?stream=${stream.id}`)}>
                          View Students
                        </Button>
                      </div>
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