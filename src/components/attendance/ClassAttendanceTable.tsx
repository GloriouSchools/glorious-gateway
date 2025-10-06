import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen } from "lucide-react";
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
              </TableRow>
            </TableHeader>
            <TableBody>
              {classData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
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
