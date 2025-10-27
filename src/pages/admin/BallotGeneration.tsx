import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProfessionalCard } from "@/components/ui/professional-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Vote, Users, Loader2, Eye, Download } from "lucide-react";
import { BallotContainer } from "@/components/electoral/ballot";
import jsPDF from "jspdf";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface Candidate {
  id: string;
  name: string;
  email: string;
  photo?: string | null;
  class: string;
  stream: string;
}

interface Position {
  id: string;
  title: string;
  description: string;
  candidates: Candidate[];
}

export default function BallotGeneration() {
  const navigate = useNavigate();
  const { userName, photoUrl } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [positions, setPositions] = useState<Position[]>([]);
  const [showBallotPreview, setShowBallotPreview] = useState(false);
  const [showLayoutDialog, setShowLayoutDialog] = useState(false);
  const [selectedLayout, setSelectedLayout] = useState<"2" | "3" | "4">("2");

  const handleLogout = () => {
    navigate('/login');
  };

  useEffect(() => {
    fetchApprovedCandidates();
  }, []);

  const fetchApprovedCandidates = async () => {
    try {
      setLoading(true);

      // Fetch confirmed candidates from electoral_applications
      const { data: candidatesData, error: candidatesError } = await supabase
        .from('electoral_applications')
        .select('*')
        .eq('status', 'confirmed')
        .order('student_name');

      if (candidatesError) throw candidatesError;

      if (!candidatesData || candidatesData.length === 0) {
        toast({
          title: "No Approved Candidates",
          description: "There are no approved candidates yet. Please approve applications first.",
          variant: "destructive"
        });
        setPositions([]);
        return;
      }

      // Group candidates by position
      const positionsMap = new Map<string, Candidate[]>();
      
      candidatesData.forEach(app => {
        const positionTitle = app.position || 'Unknown Position';
        const candidate: Candidate = {
          id: app.id!,
          name: app.student_name!,
          email: app.student_email!,
          photo: app.student_photo,
          class: app.class_name!,
          stream: app.stream_name!
        };
        
        if (!positionsMap.has(positionTitle)) {
          positionsMap.set(positionTitle, []);
        }
        positionsMap.get(positionTitle)!.push(candidate);
      });

      // Convert map to positions array
      const positionsWithCandidates: Position[] = Array.from(positionsMap.entries()).map(([title, candidates]) => ({
        id: title.toLowerCase().replace(/[^a-z0-9]+/g, '_'),
        title: title.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        description: '',
        candidates
      }));

      setPositions(positionsWithCandidates);

      toast({
        title: "Candidates Loaded",
        description: `Loaded ${candidatesData.length} approved candidates from ${positionsWithCandidates.length} positions.`
      });
    } catch (error) {
      console.error('Error fetching approved candidates:', error);
      toast({
        title: "Error",
        description: "Failed to load approved candidates",
        variant: "destructive"
      });
      setPositions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleVotePosition = async (positionId: string, candidateId: string) => {
    // Mock function for preview - no actual voting
    return Promise.resolve();
  };

  const handleVoteComplete = (votes: Record<string, string>) => {
    // Mock function for preview
    setShowBallotPreview(false);
  };

  const generatePDFBallots = async () => {
    try {
      const { generateBallotPDF } = await import('@/utils/pdfUtils');

      const ballotPositions = positions
        .filter((p) => p.candidates.length > 0)
        .map((p) => ({
          title: p.title,
          candidates: p.candidates.map((c) => ({
            id: c.id,
            name: c.name,
            class: c.class,
            stream: c.stream,
            photo: c.photo || null,
          })),
        }));

      const doc = await generateBallotPDF(ballotPositions, 'Official Ballot Paper', parseInt(selectedLayout));
      doc.save(`ballots-${new Date().toISOString().split('T')[0]}.pdf`);

      setShowLayoutDialog(false);
      toast({
        title: 'PDF Generated',
        description: `Ballot PDF has been downloaded successfully (${selectedLayout} ballots per page)`,
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        title: 'Error',
        description: 'Failed to generate PDF ballots',
        variant: 'destructive',
      });
    }
  };

  const totalCandidates = positions.reduce((sum, pos) => sum + pos.candidates.length, 0);

  if (showBallotPreview) {
    return (
      <div className="relative">
        <Button
          onClick={() => setShowBallotPreview(false)}
          className="absolute top-4 left-4 z-50"
          variant="secondary"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Close Preview
        </Button>
        <BallotContainer
          positions={positions.filter(p => p.candidates.length > 0)}
          onVotePosition={handleVotePosition}
          onVoteComplete={handleVoteComplete}
        />
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
      <div className="w-full min-h-screen">
        <div className="container mx-auto px-4 py-6 max-w-7xl">
          <div className="space-y-6">
            {/* Header */}
            <ProfessionalCard variant="elevated" className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
              <CardHeader>
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => navigate('/admin/electoral/applications')}
                      >
                        <ArrowLeft className="h-5 w-5" />
                      </Button>
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Vote className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                          Ballot Generation
                        </h1>
                        <p className="text-muted-foreground text-sm mt-1">
                          Preview and generate ballots for approved candidates
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => setShowBallotPreview(true)}
                        disabled={totalCandidates === 0}
                        size="lg"
                        className="gap-2"
                        variant="secondary"
                      >
                        <Eye className="h-5 w-5" />
                        Preview Ballot
                      </Button>
                      <Button
                        onClick={() => setShowLayoutDialog(true)}
                        disabled={totalCandidates === 0}
                        size="lg"
                        className="gap-2"
                      >
                        <Download className="h-5 w-5" />
                        Generate PDF Ballots
                      </Button>
                    </div>
                  </div>
                </div>
              </CardHeader>
            </ProfessionalCard>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ProfessionalCard variant="elevated">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Positions</p>
                      <p className="text-2xl font-bold">{positions.length}</p>
                    </div>
                    <Vote className="h-8 w-8 text-primary" />
                  </div>
                </CardContent>
              </ProfessionalCard>

              <ProfessionalCard variant="elevated">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Approved Candidates</p>
                      <p className="text-2xl font-bold">{totalCandidates}</p>
                    </div>
                    <Users className="h-8 w-8 text-green-500" />
                  </div>
                </CardContent>
              </ProfessionalCard>
            </div>

            {/* Positions and Candidates */}
            {loading ? (
              <div className="flex items-center justify-center min-h-96">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <div className="space-y-6">
                {positions.length === 0 ? (
                  <Card>
                    <CardContent className="p-12 text-center">
                      <Vote className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No Positions Available</h3>
                      <p className="text-muted-foreground">
                        No electoral positions have been created yet
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  positions.map((position) => (
                    <ProfessionalCard key={position.id} variant="bordered">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle className="text-xl">{position.title}</CardTitle>
                            {position.description && (
                              <p className="text-sm text-muted-foreground mt-1">
                                {position.description}
                              </p>
                            )}
                          </div>
                          <Badge variant={position.candidates.length > 0 ? "default" : "secondary"}>
                            {position.candidates.length} {position.candidates.length === 1 ? 'Candidate' : 'Candidates'}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        {position.candidates.length === 0 ? (
                          <div className="text-center py-8 text-muted-foreground">
                            <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
                            <p>No approved candidates for this position</p>
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {position.candidates.map((candidate) => (
                              <div
                                key={candidate.id}
                                className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                              >
                                <div className="flex items-start gap-3">
                                  {candidate.photo ? (
                                    <img
                                      src={candidate.photo}
                                      alt={candidate.name}
                                      className="w-12 h-12 rounded-full object-cover"
                                    />
                                  ) : (
                                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                                      <Users className="h-6 w-6 text-primary" />
                                    </div>
                                  )}
                                  <div className="flex-1 min-w-0">
                                    <h4 className="font-semibold truncate">{candidate.name}</h4>
                                    <p className="text-sm text-muted-foreground truncate">
                                      {candidate.class} - {candidate.stream}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </ProfessionalCard>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Layout Selection Dialog */}
      <Dialog open={showLayoutDialog} onOpenChange={setShowLayoutDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Select Ballot Layout</DialogTitle>
            <DialogDescription>
              Choose how many ballots to print per page. More ballots per page saves paper but may be smaller.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <RadioGroup value={selectedLayout} onValueChange={(value) => setSelectedLayout(value as "2" | "3" | "4")}>
              <div className="space-y-4">
                {/* Option 1: 2 per page */}
                <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                  <RadioGroupItem value="2" id="layout-2" className="mt-1" />
                  <Label htmlFor="layout-2" className="flex-1 cursor-pointer">
                    <div className="font-semibold mb-1">2 Ballots Per Page (Recommended)</div>
                    <div className="text-sm text-muted-foreground">
                      Side by side layout • 90mm × 270mm each • Clear and readable • Saves 50% paper
                    </div>
                  </Label>
                </div>

                {/* Option 2: 3 per page */}
                <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                  <RadioGroupItem value="3" id="layout-3" className="mt-1" />
                  <Label htmlFor="layout-3" className="flex-1 cursor-pointer">
                    <div className="font-semibold mb-1">3 Ballots Per Page</div>
                    <div className="text-sm text-muted-foreground">
                      Horizontal strips • 190mm × 90mm each • Compact • Saves 66% paper
                    </div>
                  </Label>
                </div>

                {/* Option 3: 4 per page */}
                <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                  <RadioGroupItem value="4" id="layout-4" className="mt-1" />
                  <Label htmlFor="layout-4" className="flex-1 cursor-pointer">
                    <div className="font-semibold mb-1">4 Ballots Per Page (Maximum Savings)</div>
                    <div className="text-sm text-muted-foreground">
                      2×2 grid layout • 90mm × 135mm each • More compact • Saves 75% paper
                    </div>
                  </Label>
                </div>
              </div>
            </RadioGroup>

            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setShowLayoutDialog(false)}>
                Cancel
              </Button>
              <Button onClick={generatePDFBallots}>
                <Download className="h-4 w-4 mr-2" />
                Generate PDF
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
