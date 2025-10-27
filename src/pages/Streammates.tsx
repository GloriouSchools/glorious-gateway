import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Monitor, Search, Loader2, Mail } from "lucide-react";

interface Streammate {
  id: string;
  name: string;
  email: string;
  class_id: string;
  stream_id: string;
  class_name?: string;
  stream_name?: string;
  photo_url?: string;
}

export default function Streammates() {
  const { userName, photoUrl, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [streammates, setStreammates] = useState<Streammate[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentStream, setCurrentStream] = useState<string>("");

  useEffect(() => {
    if (user?.id) {
      fetchStreammates();
    }
  }, [user?.id]);

  const fetchStreammates = async () => {
    try {
      setLoading(true);

      // Get current student's stream_id
      const { data: currentStudent, error: currentError } = await supabase
        .from('students')
        .select('stream_id')
        .eq('id', user?.id)
        .single();

      if (currentError) throw currentError;

      // Get stream name
      const { data: streamData, error: streamError } = await supabase
        .from('streams')
        .select('name')
        .eq('id', currentStudent.stream_id)
        .single();

      if (streamError) throw streamError;
      setCurrentStream(streamData.name);

      // Fetch all students in the same stream
      const { data: studentsData, error: studentsError } = await supabase
        .from('students')
        .select('id, name, email, class_id, stream_id, photo_url')
        .eq('stream_id', currentStudent.stream_id)
        .neq('id', user?.id);

      if (studentsError) throw studentsError;

      // Get class and stream names for all students
      const classIds = [...new Set(studentsData?.map(s => s.class_id))];
      const streamIds = [...new Set(studentsData?.map(s => s.stream_id))];

      const [classesResult, streamsResult] = await Promise.all([
        supabase.from('classes').select('id, name').in('id', classIds),
        supabase.from('streams').select('id, name').in('id', streamIds)
      ]);

      const classMap = new Map(classesResult.data?.map(c => [c.id, c.name]));
      const streamMap = new Map(streamsResult.data?.map(s => [s.id, s.name]));

      const enrichedStudents = studentsData?.map(student => ({
        ...student,
        class_name: classMap.get(student.class_id),
        stream_name: streamMap.get(student.stream_id)
      })) || [];

      setStreammates(enrichedStudents);
    } catch (error) {
      console.error('Error fetching streammates:', error);
      toast({
        title: "Error",
        description: "Failed to load streammates",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredStreammates = streammates.filter(streammate =>
    streammate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    streammate.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (streammate.class_name && streammate.class_name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <DashboardLayout
      userRole="student"
      userName={userName}
      photoUrl={photoUrl}
      onLogout={() => navigate('/login')}
    >
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-100">
                  <Monitor className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <CardTitle className="text-2xl">My Streammates</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    {currentStream && `Stream ${currentStream} • `}
                    {streammates.length} {streammates.length === 1 ? 'streammate' : 'streammates'}
                  </p>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search streammates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Streammates List */}
            {loading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : filteredStreammates.length === 0 ? (
              <div className="text-center py-12">
                <Monitor className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  {searchTerm ? 'No streammates found' : 'No streammates'}
                </h3>
                <p className="text-muted-foreground">
                  {searchTerm ? 'Try a different search term' : 'No other students in your stream'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredStreammates.map((streammate) => (
                  <Card key={streammate.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={streammate.photo_url || undefined} alt={streammate.name} />
                          <AvatarFallback>{streammate.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold truncate">{streammate.name}</h4>
                          <p className="text-sm text-muted-foreground truncate">{streammate.email}</p>
                          {streammate.class_name && (
                            <Badge variant="secondary" className="mt-1">
                              {streammate.class_name}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2 mt-3">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() => window.location.href = `mailto:${streammate.email}`}
                        >
                          <Mail className="h-4 w-4 mr-1" />
                          Email
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
