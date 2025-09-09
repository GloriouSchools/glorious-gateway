import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { User, Mail, Phone, Calendar, MapPin } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface PersonalInfoProps {
  userName: string;
  userRole: string | null;
  userEmail: string | undefined;
  personalEmail: string | null;
}

interface StudentData {
  class_name?: string;
  stream_name?: string;
}

export function PersonalInfo({ userName, userRole, userEmail, personalEmail }: PersonalInfoProps) {
  const { user } = useAuth();
  const [studentData, setStudentData] = useState<StudentData>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (userRole === 'student' && user?.id) {
      fetchStudentClassAndStream();
    }
  }, [userRole, user?.id]);

  const fetchStudentClassAndStream = async () => {
    if (!user?.id) {
      console.log('No authenticated user found');
      return;
    }
    
    console.log('Fetching student data for user ID:', user.id);
    
    setIsLoading(true);
    try {
      // First get the student's class_id and stream_id
      const { data: student, error } = await supabase
        .from('students')
        .select('class_id, stream_id, name')
        .eq('id', user.id)
        .maybeSingle();

      console.log('Student query result:', { student, error });

      if (student) {
        // Fetch class and stream names separately since joins are complex
        let className = 'Not assigned';
        let streamName = 'Not assigned';
        
        if (student.class_id) {
          try {
            const { data: classData } = await supabase
              .from('classes')
              .select('name')
              .eq('id', student.class_id)
              .maybeSingle();
            if (classData) {
              className = classData.name;
            }
          } catch (error) {
            console.error('Error fetching class:', error);
          }
        }
        
        if (student.stream_id) {
          try {
            const { data: streamData } = await supabase
              .from('streams')
              .select('name')
              .eq('id', student.stream_id)
              .maybeSingle();
            if (streamData) {
              streamName = streamData.name;
            }
          } catch (error) {
            console.error('Error fetching stream:', error);
          }
        }

        setStudentData({
          class_name: className,
          stream_name: streamName
        });
      } else {
        console.log('No student found with ID:', user.id);
        // Try to find student by name or other means as fallback
        const allStudents = await supabase
          .from('students')
          .select('id, name, class_id, stream_id')
          .limit(5);
        console.log('Sample students for debugging:', allStudents.data);
      }
    } catch (error) {
      console.error('Error fetching student data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Personal Information</CardTitle>
        <CardDescription>
          Your account details are managed by the school administration and cannot be changed here.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">
              <User className="inline mr-2 h-4 w-4" />
              Full Name
            </Label>
            <Input id="name" value={userName} disabled />
          </div>
          
          {userRole === 'student' && (
            <>
              <div className="space-y-2">
                <Label htmlFor="class">Class</Label>
                {isLoading ? (
                  <Skeleton className="h-10 w-full" />
                ) : (
                  <Input id="class" value={studentData.class_name || 'Not assigned'} disabled />
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="stream">Stream</Label>
                {isLoading ? (
                  <Skeleton className="h-10 w-full" />
                ) : (
                  <Input id="stream" value={studentData.stream_name || 'Not assigned'} disabled />
                )}
              </div>
            </>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="schoolEmail">
              <Mail className="inline mr-2 h-4 w-4" />
              School Email
            </Label>
            <Input id="schoolEmail" value={userEmail || ""} disabled />
          </div>

          <div className="space-y-2">
            <Label htmlFor="personalEmailDisplay">
              <Mail className="inline mr-2 h-4 w-4" />
              Personal Email
            </Label>
            <Input 
              id="personalEmailDisplay" 
              value={personalEmail || "Not set"} 
              disabled 
              className={!personalEmail ? "text-muted-foreground" : ""}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}