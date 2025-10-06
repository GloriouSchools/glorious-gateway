import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, TrendingUp, TrendingDown } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface ClassData {
  id: string;
  name: string;
  totalStudents: number;
  present: number;
  absent: number;
  attendanceRate: number;
}

interface ClassAttendanceTableProps {
  classData: ClassData[];
  onClassClick: (classId: string) => void;
}

export const ClassAttendanceTable = ({ classData, onClassClick }: ClassAttendanceTableProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5" />
          Class-wise Attendance
        </CardTitle>
        <CardDescription>
          Overview of attendance across all classes and streams
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Class/Stream</TableHead>
                <TableHead className="text-center">Total Students</TableHead>
                <TableHead className="text-center">Present</TableHead>
                <TableHead className="text-center">Absent</TableHead>
                <TableHead>Attendance Rate</TableHead>
                <TableHead className="text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {classData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No attendance data available
                  </TableCell>
                </TableRow>
              ) : (
                classData.map((classItem) => (
                  <TableRow 
                    key={classItem.id}
                    className="cursor-pointer hover:bg-accent/50 transition-colors"
                    onClick={() => onClassClick(classItem.id)}
                  >
                    <TableCell className="font-medium">{classItem.name}</TableCell>
                    <TableCell className="text-center">{classItem.totalStudents}</TableCell>
                    <TableCell className="text-center">
                      <span className="text-emerald-600 font-semibold">{classItem.present}</span>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="text-red-600 font-semibold">{classItem.absent}</span>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Progress value={classItem.attendanceRate} className="h-2" />
                          <span className="text-sm font-medium min-w-[3rem]">
                            {classItem.attendanceRate}%
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      {classItem.attendanceRate >= 90 ? (
                        <Badge className="bg-emerald-500/10 text-emerald-700 border-emerald-200">
                          <TrendingUp className="h-3 w-3 mr-1" />
                          Excellent
                        </Badge>
                      ) : classItem.attendanceRate >= 75 ? (
                        <Badge className="bg-blue-500/10 text-blue-700 border-blue-200">
                          Good
                        </Badge>
                      ) : classItem.attendanceRate >= 60 ? (
                        <Badge className="bg-yellow-500/10 text-yellow-700 border-yellow-200">
                          Fair
                        </Badge>
                      ) : (
                        <Badge className="bg-red-500/10 text-red-700 border-red-200">
                          <TrendingDown className="h-3 w-3 mr-1" />
                          Low
                        </Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
