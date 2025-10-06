import { useState, useEffect, useRef, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, UserCheck, UserX } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { parseStudentCSV } from '@/utils/csvParser';
import studentsCSV from '@/data/students.csv?raw';

interface StudentAttendance {
  id: string;
  name: string;
  email: string;
  class: string;
  stream: string;
  photoUrl?: string;
  status: 'present' | 'absent' | 'not-marked';
  timeMarked?: string;
}

interface StudentAttendanceListProps {
  students: StudentAttendance[];
}

export const StudentAttendanceList = ({ students }: StudentAttendanceListProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [selectedClass, setSelectedClass] = useState("all");
  const [selectedStream, setSelectedStream] = useState("all");
  const [displayedStudents, setDisplayedStudents] = useState<StudentAttendance[]>([]);
  const [page, setPage] = useState(1);
  const observerTarget = useRef<HTMLDivElement>(null);
  const ITEMS_PER_PAGE = 20;

  // Get unique classes and streams
  const allStudentsData = parseStudentCSV(studentsCSV);
  const classes = Array.from(new Set(allStudentsData.map(s => s.class_id))).sort();
  const streams = Array.from(new Set(allStudentsData.map(s => s.stream_id))).sort();

  // Filter students based on selected criteria
  let filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.class.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Apply filter type
  if (filterType === "class" && selectedClass !== "all") {
    filteredStudents = filteredStudents.filter(s => s.class === selectedClass);
  } else if (filterType === "stream" && selectedStream !== "all") {
    filteredStudents = filteredStudents.filter(s => s.stream === selectedStream);
  }

  // Sort chronologically (by class then stream) for "all" filter
  if (filterType === "all") {
    filteredStudents = filteredStudents.sort((a, b) => {
      const classCompare = a.class.localeCompare(b.class);
      if (classCompare !== 0) return classCompare;
      return a.stream.localeCompare(b.stream);
    });
  }

  // Infinite scroll implementation
  useEffect(() => {
    setDisplayedStudents(filteredStudents.slice(0, ITEMS_PER_PAGE * page));
  }, [filteredStudents, page]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && displayedStudents.length < filteredStudents.length) {
          setPage(prev => prev + 1);
        }
      },
      { threshold: 1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [displayedStudents.length, filteredStudents.length]);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [searchTerm, filterType, selectedClass, selectedStream]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'present':
        return (
          <Badge className="bg-emerald-500/10 text-emerald-700 border-emerald-200">
            <UserCheck className="h-3 w-3 mr-1" />
            Present
          </Badge>
        );
      case 'absent':
        return (
          <Badge className="bg-red-500/10 text-red-700 border-red-200">
            <UserX className="h-3 w-3 mr-1" />
            Absent
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="text-muted-foreground">
            Not Marked
          </Badge>
        );
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Individual Student Tracking</CardTitle>
        <CardDescription>
          View attendance status for each student
        </CardDescription>
        <div className="space-y-4 mt-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search by name, email, or class..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select value={filterType} onValueChange={(value) => {
              setFilterType(value);
              setSelectedClass("all");
              setSelectedStream("all");
            }}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Students</SelectItem>
                <SelectItem value="class">Specific Class</SelectItem>
                <SelectItem value="stream">Specific Stream</SelectItem>
              </SelectContent>
            </Select>

            {filterType === "class" && (
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger>
                  <SelectValue placeholder="Select class" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Classes</SelectItem>
                  {classes.map(cls => (
                    <SelectItem key={cls} value={cls}>{cls}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            {filterType === "stream" && (
              <Select value={selectedStream} onValueChange={setSelectedStream}>
                <SelectTrigger>
                  <SelectValue placeholder="Select stream" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Streams</SelectItem>
                  {streams.map(stream => (
                    <SelectItem key={stream} value={stream}>{stream}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 max-h-[500px] overflow-y-auto">
          {displayedStudents.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No students found matching your search
            </div>
          ) : (
            <>
              {displayedStudents.map((student) => (
              <div
                key={student.id}
                className="flex items-center gap-4 p-4 rounded-lg border bg-card hover:bg-accent/20 transition-colors"
              >
                <Avatar className="h-12 w-12">
                  <AvatarImage src={student.photoUrl} alt={student.name} />
                  <AvatarFallback>
                    {student.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold truncate">{student.name}</h4>
                  <p className="text-sm text-muted-foreground truncate">{student.email}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {student.class} - {student.stream}
                  </p>
                </div>

                <div className="flex flex-col items-end gap-1">
                  {getStatusBadge(student.status)}
                  {student.timeMarked && (
                    <span className="text-xs text-muted-foreground">
                      {new Date(student.timeMarked).toLocaleTimeString()}
                    </span>
                  )}
                </div>
              </div>
              ))
              }
              {displayedStudents.length < filteredStudents.length && (
                <div ref={observerTarget} className="text-center py-4">
                  <div className="inline-block h-6 w-6 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
                  <p className="text-sm text-muted-foreground mt-2">Loading more...</p>
                </div>
              )}
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
