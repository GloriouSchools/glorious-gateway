import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Search, 
  Filter, 
  Eye, 
  CheckCircle, 
  XCircle, 
  Clock,
  Users,
  FileText,
  ArrowLeft,
  Loader2,
  Printer,
  Download
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import ApplicationPreview from "@/components/electoral/ApplicationPreview";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useAuth } from "@/hooks/useAuth";

interface ElectoralApplication {
  id: string;
  student_name: string;
  student_email: string;
  student_photo: string | null;
  position: string;
  class_name: string;
  stream_name: string;
  experience: string;
  qualifications: string;
  why_apply: string;
  status: 'pending' | 'confirmed' | 'rejected';
  created_at: string;
}

export default function ElectoralApplications() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { userName, photoUrl } = useAuth();
  const [applications, setApplications] = useState<ElectoralApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [selectedApplication, setSelectedApplication] = useState<ElectoralApplication | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);
  const [showFormalPreview, setShowFormalPreview] = useState(false);
  
  const handleLogout = () => {
    navigate('/login');
  };

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('electoral_applications')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setApplications((data || []).map(app => ({
        ...app,
        status: app.status as 'pending' | 'confirmed' | 'rejected'
      })));
    } catch (error) {
      console.error('Error fetching applications:', error);
      toast({
        title: "Error",
        description: "Failed to load applications. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateApplicationStatus = async (applicationId: string, newStatus: 'confirmed' | 'rejected') => {
    try {
      setUpdating(applicationId);
      const { error } = await supabase
        .from('electoral_applications')
        .update({ status: newStatus })
        .eq('id', applicationId);

      if (error) throw error;

      // Update local state
      setApplications(apps => 
        apps.map(app => 
          app.id === applicationId ? { ...app, status: newStatus } : app
        )
      );

      toast({
        title: "Status Updated",
        description: `Application has been ${newStatus}.`,
      });
    } catch (error) {
      console.error('Error updating application:', error);
      toast({
        title: "Error",
        description: "Failed to update application status.",
        variant: "destructive"
      });
    } finally {
      setUpdating(null);
    }
  };

  const filteredApplications = applications.filter(app => {
    const matchesSearch = app.student_name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
                         app.student_email.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
                         app.position.toLowerCase().includes(debouncedSearchTerm.toLowerCase());
    
    if (filterType === "all") return matchesSearch;
    
    const [filterCategory, filterValue] = filterType.split("-");
    if (filterCategory === "status") {
      return matchesSearch && app.status === filterValue;
    } else if (filterCategory === "position") {
      return matchesSearch && app.position === filterValue;
    }
    
    return matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-500';
      case 'rejected':
        return 'bg-red-500';
      default:
        return 'bg-yellow-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="h-4 w-4" />;
      case 'rejected':
        return <XCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text('Electoral Applications Report', 20, 20);
    doc.setFontSize(12);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 30);
    doc.text(`Total Applications: ${filteredApplications.length}`, 20, 40);

    const tableData = filteredApplications.map(app => [
      app.student_photo ? 'Photo' : 'No Photo',
      app.student_name,
      app.student_email,
      app.position.replace(/_/g, ' ')
    ]);

    (doc as any).autoTable({
      head: [['Avatar', 'Name', 'Email', 'Position']],
      body: tableData,
      startY: 50,
      styles: { fontSize: 10 },
      headStyles: { fillColor: [59, 130, 246] },
    });

    doc.save('electoral-applications-report.pdf');
  };

  const uniquePositions = [...new Set(applications.map(app => app.position))];

  const filterOptions = useMemo(() => {
    const statusOptions = [
      { value: "status-pending", label: "Pending" },
      { value: "status-confirmed", label: "Confirmed" },
      { value: "status-rejected", label: "Rejected" }
    ];
    
    const positionOptions = uniquePositions.map(position => ({
      value: `position-${position}`,
      label: position.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
    }));

    return [
      { label: "Status", options: statusOptions },
      { label: "Position", options: positionOptions }
    ];
  }, [uniquePositions]);

  const stats = {
    total: applications.length,
    pending: applications.filter(app => app.status === 'pending').length,
    confirmed: applications.filter(app => app.status === 'confirmed').length,
    rejected: applications.filter(app => app.status === 'rejected').length
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary mr-3" />
          <span>Loading electoral applications...</span>
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout 
      userRole="admin" 
      userName={userName} 
      photoUrl={photoUrl} 
      onLogout={handleLogout}
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Electoral Applications</h1>
            <p className="text-muted-foreground">Manage student applications for leadership positions</p>
          </div>
          <Button onClick={downloadPDF} className="gap-2">
            <FileText className="h-4 w-4" />
            Download PDF
          </Button>
        </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Confirmed</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.confirmed}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rejected</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Search & Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, email, or position..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="All Filters" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Applications</SelectItem>
                {filterOptions.map((group) => (
                  group.options.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Applications List */}
      <div className="grid gap-4">
        {filteredApplications.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No Applications Found</h3>
              <p className="text-muted-foreground">
                {applications.length === 0 
                  ? "No electoral applications have been submitted yet."
                  : "No applications match your current filters."
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredApplications.map((application) => (
            <Card key={application.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <img
                      src={application.student_photo || "/src/assets/default-avatar.png"}
                      alt={`${application.student_name}'s photo`}
                      className="w-12 h-12 rounded-lg object-cover border"
                      onError={(e) => {
                        e.currentTarget.src = "/src/assets/default-avatar.png";
                      }}
                    />
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-lg">{application.student_name}</h3>
                          <p className="text-muted-foreground text-sm">{application.student_email}</p>
                        </div>
                        <Badge className={getStatusColor(application.status)}>
                          {getStatusIcon(application.status)}
                          <span className="ml-1 capitalize">{application.status}</span>
                        </Badge>
                      </div>
                      
                      <div className="grid md:grid-cols-3 gap-4 mb-4">
                        <div>
                          <label className="text-xs text-muted-foreground">Position</label>
                          <p className="font-medium">
                            {application.position.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </p>
                        </div>
                        <div>
                          <label className="text-xs text-muted-foreground">Class & Stream</label>
                          <p className="font-medium">{application.class_name} - {application.stream_name}</p>
                        </div>
                        <div>
                          <label className="text-xs text-muted-foreground">Applied On</label>
                          <p className="font-medium">
                            {new Date(application.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => setSelectedApplication(application)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View Details
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => {
                            setSelectedApplication(application);
                            setShowFormalPreview(true);
                          }}
                        >
                          <Printer className="h-4 w-4 mr-1" />
                          Formal Application
                        </Button>
                        
                        {application.status === 'pending' && (
                          <>
                            <Button 
                              size="sm" 
                              className="bg-green-600 hover:bg-green-700"
                              onClick={() => updateApplicationStatus(application.id, 'confirmed')}
                              disabled={updating === application.id}
                            >
                              {updating === application.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <CheckCircle className="h-4 w-4 mr-1" />
                              )}
                              Confirm
                            </Button>
                            <Button 
                              size="sm" 
                              variant="destructive"
                              onClick={() => updateApplicationStatus(application.id, 'rejected')}
                              disabled={updating === application.id}
                            >
                              {updating === application.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <XCircle className="h-4 w-4 mr-1" />
                              )}
                              Reject
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Application Details Modal */}
      {selectedApplication && !showFormalPreview && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Application Details</span>
                <Button variant="ghost" size="sm" onClick={() => setSelectedApplication(null)}>
                  ×
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Student Info */}
              <div className="flex items-center gap-4 p-4 bg-muted/20 rounded-lg">
                <img
                  src={selectedApplication.student_photo || "/src/assets/default-avatar.png"}
                  alt={`${selectedApplication.student_name}'s photo`}
                  className="w-16 h-16 rounded-lg object-cover border"
                  onError={(e) => {
                    e.currentTarget.src = "/src/assets/default-avatar.png";
                  }}
                />
                <div>
                  <h3 className="font-bold text-lg">{selectedApplication.student_name}</h3>
                  <p className="text-muted-foreground">{selectedApplication.student_email}</p>
                  <p className="text-sm">{selectedApplication.class_name} - {selectedApplication.stream_name}</p>
                </div>
              </div>

              {/* Position */}
              <div>
                <label className="font-medium text-sm">Position Applied For</label>
                <p className="text-lg font-semibold">
                  {selectedApplication.position.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </p>
              </div>

              {/* Experience */}
              <div>
                <label className="font-medium text-sm">Experience</label>
                <p className="mt-1 whitespace-pre-wrap bg-muted/20 p-3 rounded-lg">
                  {selectedApplication.experience || 'Not provided'}
                </p>
              </div>

              {/* Qualifications */}
              <div>
                <label className="font-medium text-sm">Qualifications</label>
                <p className="mt-1 whitespace-pre-wrap bg-muted/20 p-3 rounded-lg">
                  {selectedApplication.qualifications || 'Not provided'}
                </p>
              </div>

              {/* Why Apply */}
              <div>
                <label className="font-medium text-sm">Why do you want this position?</label>
                <p className="mt-1 whitespace-pre-wrap bg-muted/20 p-3 rounded-lg">
                  {selectedApplication.why_apply || 'Not provided'}
                </p>
              </div>

              {/* Actions */}
              {selectedApplication.status === 'pending' && (
                <div className="flex gap-2 pt-4 border-t">
                  <Button 
                    className="flex-1 bg-green-600 hover:bg-green-700"
                    onClick={() => {
                      updateApplicationStatus(selectedApplication.id, 'confirmed');
                      setSelectedApplication(null);
                    }}
                    disabled={updating === selectedApplication.id}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Confirm Application
                  </Button>
                  <Button 
                    variant="destructive"
                    className="flex-1"
                    onClick={() => {
                      updateApplicationStatus(selectedApplication.id, 'rejected');
                      setSelectedApplication(null);
                    }}
                    disabled={updating === selectedApplication.id}
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Reject Application
                  </Button>
        </div>
      )}

      {/* Formal Application Preview Modal */}
      {selectedApplication && showFormalPreview && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="max-w-4xl w-full max-h-[90vh] overflow-y-auto bg-background rounded-lg">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">Formal Application - {selectedApplication.student_name}</h2>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => {
                    setSelectedApplication(null);
                    setShowFormalPreview(false);
                  }}
                >
                  ×
                </Button>
              </div>
              <ApplicationPreview 
                application={{
                  student_name: selectedApplication.student_name,
                  student_email: selectedApplication.student_email,
                  student_photo: selectedApplication.student_photo,
                  position: selectedApplication.position,
                  class_name: selectedApplication.class_name,
                  stream_name: selectedApplication.stream_name,
                  experience: selectedApplication.experience,
                  qualifications: selectedApplication.qualifications,
                  why_apply: selectedApplication.why_apply,
                  submitted_at: selectedApplication.created_at,
                  status: selectedApplication.status
                }}
                onClose={() => {
                  setSelectedApplication(null);
                  setShowFormalPreview(false);
                }}
              />
            </div>
          </div>
        </div>
      )}
            </CardContent>
          </Card>
        </div>
      )}
     </div>
   </DashboardLayout>
 );
}