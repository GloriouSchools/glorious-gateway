import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

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
  const [formData, setFormData] = useState({
    student_name: "",
    student_email: "",
    position: "",
    class_name: "",
    stream_name: "",
    sex: "",
    age: "",
    class_teacher_name: "",
    class_teacher_tel: "",
    parent_name: "",
    parent_tel: "",
    status: "pending"
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.from('electoral_applications').insert({
        student_name: formData.student_name,
        student_email: formData.student_email,
        position: formData.position,
        class_name: formData.class_name,
        stream_name: formData.stream_name,
        sex: formData.sex || null,
        age: formData.age ? parseInt(formData.age) : null,
        class_teacher_name: formData.class_teacher_name || null,
        class_teacher_tel: formData.class_teacher_tel || null,
        parent_name: formData.parent_name || null,
        parent_tel: formData.parent_tel ? parseInt(formData.parent_tel) : null,
        status: formData.status,
        submitted_at: new Date().toISOString()
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Prefect application added successfully."
      });

      // Reset form
      setFormData({
        student_name: "",
        student_email: "",
        position: "",
        class_name: "",
        stream_name: "",
        sex: "",
        age: "",
        class_teacher_name: "",
        class_teacher_tel: "",
        parent_name: "",
        parent_tel: "",
        status: "pending"
      });

      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error('Error adding application:', error);
      toast({
        title: "Error",
        description: "Failed to add prefect application.",
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="student_name">Student Name *</Label>
              <Input
                id="student_name"
                required
                value={formData.student_name}
                onChange={(e) => setFormData({ ...formData, student_name: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="student_email">Student Email *</Label>
              <Input
                id="student_email"
                type="email"
                required
                value={formData.student_email}
                onChange={(e) => setFormData({ ...formData, student_email: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="position">Position *</Label>
              <Select value={formData.position} onValueChange={(value) => setFormData({ ...formData, position: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select position" />
                </SelectTrigger>
                <SelectContent>
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
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="class_name">Class *</Label>
              <Input
                id="class_name"
                required
                placeholder="e.g., P.7"
                value={formData.class_name}
                onChange={(e) => setFormData({ ...formData, class_name: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="stream_name">Stream *</Label>
              <Input
                id="stream_name"
                required
                placeholder="e.g., Alpha"
                value={formData.stream_name}
                onChange={(e) => setFormData({ ...formData, stream_name: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sex">Sex</Label>
              <Select value={formData.sex} onValueChange={(value) => setFormData({ ...formData, sex: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select sex" />
                </SelectTrigger>
                <SelectContent>
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
