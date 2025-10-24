import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { PhotoDialog } from "@/components/ui/photo-dialog";
import { 
  Trophy, 
  Award, 
  Vote, 
  User, 
  Mail, 
  GraduationCap, 
  Users as UsersIcon,
  TrendingUp,
  Target
} from "lucide-react";

interface Candidate {
  id: string;
  student_name: string;
  student_email: string;
  student_photo: string | null;
  position: string;
  class_name: string;
  stream_name: string;
  sex?: string;
  votes: number;
  rank: number;
  totalCandidates: number;
}

interface CandidateProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  candidate: Candidate | null;
  positionCandidates: Array<{
    name: string;
    votes: number;
    rank: number;
  }>;
}

export function CandidateProfileDialog({
  open,
  onOpenChange,
  candidate,
  positionCandidates
}: CandidateProfileDialogProps) {
  if (!candidate) return null;

  const getRankBadge = (rank: number) => {
    if (rank === 1) {
      return (
        <Badge className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white border-none text-base px-4 py-2">
          <Trophy className="h-4 w-4 mr-2" />
          1st Place Leader
        </Badge>
      );
    }
    if (rank === 2) {
      return (
        <Badge className="bg-gradient-to-r from-gray-400 to-gray-500 text-white border-none text-base px-4 py-2">
          <Award className="h-4 w-4 mr-2" />
          2nd Place
        </Badge>
      );
    }
    if (rank === 3) {
      return (
        <Badge className="bg-gradient-to-r from-orange-500 to-orange-600 text-white border-none text-base px-4 py-2">
          <Award className="h-4 w-4 mr-2" />
          3rd Place
        </Badge>
      );
    }
    return (
      <Badge variant="outline" className="text-base px-4 py-2">
        Position #{rank} of {candidate.totalCandidates}
      </Badge>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Candidate Profile</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header Section with Photo and Basic Info */}
          <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
            <PhotoDialog
              photoUrl={candidate.student_photo}
              userName={candidate.student_name}
              size="h-32 w-32 ring-4 ring-primary/20"
            />
            
            <div className="flex-1 space-y-3 text-center sm:text-left">
              <div>
                <h2 className="text-2xl font-bold">{candidate.student_name}</h2>
                <p className="text-muted-foreground">{candidate.student_email}</p>
              </div>
              {getRankBadge(candidate.rank)}
            </div>
          </div>

          <Separator />

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="border-l-4 border-l-primary">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Vote className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-primary">{candidate.votes}</p>
                    <p className="text-xs text-muted-foreground">Total Votes</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-blue-500">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <Target className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">#{candidate.rank}</p>
                    <p className="text-xs text-muted-foreground">Position</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-purple-500">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                    <UsersIcon className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{candidate.totalCandidates}</p>
                    <p className="text-xs text-muted-foreground">Candidates</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Separator />

          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <User className="h-5 w-5" />
              Personal Information
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Position</p>
                <Badge variant="secondary" className="text-sm">{candidate.position}</Badge>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Gender</p>
                <p className="font-medium">{candidate.sex || 'Not specified'}</p>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <GraduationCap className="h-4 w-4" />
                  Class
                </p>
                <p className="font-medium">{candidate.class_name}</p>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Stream</p>
                <p className="font-medium">{candidate.stream_name}</p>
              </div>
              
              <div className="space-y-1 sm:col-span-2">
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <Mail className="h-4 w-4" />
                  Email
                </p>
                <p className="font-medium">{candidate.student_email}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Position Competition */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              {candidate.position} - Competition
            </h3>
            
            <div className="space-y-2">
              {positionCandidates.map((comp, index) => (
                <Card 
                  key={index} 
                  className={`${
                    comp.name === candidate.student_name 
                      ? 'border-primary bg-primary/5' 
                      : ''
                  }`}
                >
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted font-bold text-sm">
                          {comp.rank}
                        </div>
                        <div>
                          <p className={`font-medium ${
                            comp.name === candidate.student_name 
                              ? 'text-primary' 
                              : ''
                          }`}>
                            {comp.name}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="font-mono">
                          {comp.votes} votes
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
