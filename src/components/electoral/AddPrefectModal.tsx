import { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Check, Search } from "lucide-react";
import { saveManualApplication } from "@/utils/electoralStorageUtils";

interface AddPrefectModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const positions = [
  { value: 'head_prefect', label: 'Head Prefect' },
  { value: 'academic_prefect', label: 'Academic Prefect' },
  { value: 'head_monitors', label: 'Head Monitor(es)' },
  { value: 'welfare_prefect', label: 'Welfare Prefect (Mess Prefect)' },
  { value: 'entertainment_prefect', label: 'Entertainment Prefect' },
  { value: 'games_sports_prefect', label: 'Games and Sports Prefect' },
  { value: 'health_sanitation', label: 'Health & Sanitation' },
  { value: 'uniform_uniformity', label: 'Uniform & Uniformity' },
  { value: 'time_keeper', label: 'Time Keeper' },
  { value: 'ict_prefect', label: 'ICT Prefect' },
  { value: 'furniture_prefect', label: 'Furniture Prefect(s)' },
  { value: 'prefect_upper_section', label: 'Prefect for Upper Section' },
  { value: 'prefect_lower_section', label: 'Prefect for Lower Section' },
  { value: 'discipline_prefect', label: 'Prefect in Charge of Discipline' }
];

export default function AddPrefectModal({ open, onOpenChange, onSuccess }: AddPrefectModalProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [students, setStudents] = useState<any[]>([]);
  const [classes, setClasses] = useState<{ id: string; name: string }[]>([]);
  const [streams, setStreams] = useState<{ id: string; name: string; class_id?: string }[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState({
    student_id: "",
    student_name: "",
    student_email: "",
    student_photo: "",
    position: "",
    class_name: "",
    stream_name: "",
    sex: "",
    age: "",
    class_teacher_name: "",
    class_teacher_tel: "",
    parent_name: "",
    parent_tel: "",
    experience: "",
    qualifications: "",
    why_apply: "",
    status: "pending"
  });

  useEffect(() => {
    if (open) {
      fetchStudents();
    }
  }, [open]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchStudents = async () => {
    try {
      // Fetch students, classes, and streams separately
      const [
        { data: studentsData, error: studentsError },
        { data: classesData, error: classesError },
        { data: streamsData, error: streamsError }
      ] = await Promise.all([
        supabase.from('students').select('id, name, email, class_id, stream_id').order('name'),
        supabase.from('classes').select('id, name'),
        supabase.from('streams').select('id, name, class_id')
      ]);

      if (studentsError) throw studentsError;
      if (classesError) throw classesError;
      if (streamsError) throw streamsError;

      setStudents(studentsData || []);
      setClasses(classesData || []);
      setStreams(streamsData || []);
    } catch (error) {
      console.error('Error fetching students:', error);
      toast({
        title: "Error",
        description: "Failed to fetch students data.",
        variant: "destructive"
      });
    }
  };

  const handleStudentSelect = async (studentId: string, studentName: string) => {
    setSelectedStudent(studentId);
    setSearchQuery(studentName);
    setShowResults(false);
    const student = students.find(s => s.id === studentId);
    
    if (student) {
      const studentClass = classes.find(c => c.id === student.class_id);
      const studentStream = streams.find(s => s.id === student.stream_id);
      
      // Fetch full student data including photo
      const { data: fullStudentData } = await supabase
        .from('students')
        .select('*')
        .eq('id', studentId)
        .single();
      
      setFormData({
        ...formData,
        student_id: student.id,
        student_name: student.name,
        student_email: student.email,
        student_photo: fullStudentData?.photo_url || "",
        class_name: studentClass?.name || "",
        stream_name: studentStream?.name || "",
      });
    }
  };

  const filteredStudents = students.filter(student => {
    const query = searchQuery.toLowerCase();
    return student.name.toLowerCase().includes(query) || 
           student.email.toLowerCase().includes(query);
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Create application data object
      const applicationData = {
        id: `manual_${crypto.randomUUID()}`,
        student_id: formData.student_id,
        student_name: formData.student_name,
        student_email: formData.student_email,
        student_photo: formData.student_photo || null,
        position: formData.position,
        class_name: formData.class_name,
        stream_name: formData.stream_name,
        sex: formData.sex || null,
        age: formData.age ? parseInt(formData.age) : null,
        class_teacher_name: formData.class_teacher_name || null,
        class_teacher_tel: formData.class_teacher_tel || null,
        parent_name: formData.parent_name || null,
        parent_tel: formData.parent_tel ? parseInt(formData.parent_tel) : null,
        experience: formData.experience || null,
        qualifications: formData.qualifications || null,
        why_apply: formData.why_apply || null,
        status: formData.status as 'pending' | 'confirmed' | 'rejected',
        created_at: new Date().toISOString()
      };

      // Store in localStorage using utility function
      const saved = saveManualApplication(applicationData);
      
      if (!saved) {
        throw new Error('Failed to save application to local storage');
      }

      toast({
        title: "Success",
        description: "Prefect application added successfully (stored locally and will persist)."
      });

      // Reset form
      setFormData({
        student_id: "",
        student_name: "",
        student_email: "",
        student_photo: "",
        position: "",
        class_name: "",
        stream_name: "",
        sex: "",
        age: "",
        class_teacher_name: "",
        class_teacher_tel: "",
        parent_name: "",
        parent_tel: "",
        experience: "",
        qualifications: "",
        why_apply: "",
        status: "pending"
      });
      setSelectedStudent("");

      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      console.error('Error adding application:', error);
      
      let errorMessage = "Failed to add prefect application.";
      if (error?.message) {
        errorMessage += ` ${error.message}`;
      }
      if (error?.code === 'PGRST301') {
        errorMessage = "Permission denied. Please check database RLS policies for electoral_applications table.";
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Prefect Application</DialogTitle>
          <DialogDescription>
            Manually add a student's prefect application. This will blend with applications submitted by students.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-4">
            {/* Search Student */}
            <div className="space-y-2" ref={searchRef}>
              <Label htmlFor="search_student">Search Student *</Label>
              <div className="relative">
                <Input
                  id="search_student"
                  type="text"
                  placeholder="Type student name or email..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setSelectedStudent("");
                    setShowResults(true);
                  }}
                  onFocus={() => setShowResults(true)}
                  className="pr-10"
                  autoComplete="off"
                />
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
              
              {/* Results dropdown */}
              {searchQuery && showResults && (
                <div className="relative">
                  <div className="absolute w-full bg-background border rounded-md shadow-lg max-h-60 overflow-y-auto z-50">
                    {filteredStudents.length > 0 ? (
                      <div className="py-1">
                        {filteredStudents.map((student) => {
                          const studentClass = classes.find(c => c.id === student.class_id);
                          const studentStream = streams.find(s => s.id === student.stream_id);
                          return (
                            <button
                              key={student.id}
                              type="button"
                              onClick={() => handleStudentSelect(student.id, student.name)}
                              className="w-full px-4 py-3 text-left hover:bg-accent transition-colors flex items-start gap-2 border-b last:border-b-0"
                            >
                              {selectedStudent === student.id && (
                                <Check className="h-4 w-4 mt-1 text-primary flex-shrink-0" />
                              )}
                              <div className="flex-1 min-w-0">
                                <div className="font-medium text-sm">{student.name}</div>
                                <div className="text-xs text-muted-foreground truncate">
                                  {student.email} • {studentClass?.name || 'No class'} {studentStream?.name || ''}
                                </div>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="px-4 py-3 text-sm text-muted-foreground">
                        No student found.
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Dynamic Fields - Auto-populated */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="student_name">Student Name *</Label>
                <Input
                  id="student_name"
                  required
                  value={formData.student_name}
                  disabled
                  className="bg-muted"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="student_email">Student Email *</Label>
                <Input
                  id="student_email"
                  type="email"
                  required
                  value={formData.student_email}
                  disabled
                  className="bg-muted"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="class_name">Class *</Label>
                <Input
                  id="class_name"
                  required
                  value={formData.class_name}
                  disabled
                  className="bg-muted"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="stream_name">Stream *</Label>
                <Input
                  id="stream_name"
                  required
                  value={formData.stream_name}
                  disabled
                  className="bg-muted"
                />
              </div>
            </div>

            {/* Position and Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="position">Position *</Label>
                <Select value={formData.position} onValueChange={(value) => setFormData({ ...formData, position: value })}>
                  <SelectTrigger className="bg-background">
                    <SelectValue placeholder="Select position" />
                  </SelectTrigger>
                  <SelectContent className="bg-background border z-50">
                    {positions.map((pos) => (
                      <SelectItem key={pos.value} value={pos.value}>
                        {pos.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status *</Label>
                <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                  <SelectTrigger className="bg-background">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent className="bg-background border z-50">
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Manual Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sex">Sex</Label>
                <Select value={formData.sex} onValueChange={(value) => setFormData({ ...formData, sex: value })}>
                  <SelectTrigger className="bg-background">
                    <SelectValue placeholder="Select sex" />
                  </SelectTrigger>
                  <SelectContent className="bg-background border z-50">
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  type="number"
                  placeholder="e.g., 13"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="class_teacher_name">Class Teacher Name</Label>
                <Input
                  id="class_teacher_name"
                  value={formData.class_teacher_name}
                  onChange={(e) => setFormData({ ...formData, class_teacher_name: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="class_teacher_tel">Class Teacher Tel</Label>
                <Input
                  id="class_teacher_tel"
                  value={formData.class_teacher_tel}
                  onChange={(e) => setFormData({ ...formData, class_teacher_tel: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="parent_name">Parent Name</Label>
                <Input
                  id="parent_name"
                  value={formData.parent_name}
                  onChange={(e) => setFormData({ ...formData, parent_name: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="parent_tel">Parent Tel</Label>
                <Input
                  id="parent_tel"
                  value={formData.parent_tel}
                  onChange={(e) => setFormData({ ...formData, parent_tel: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Add Application
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
