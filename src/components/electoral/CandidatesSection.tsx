import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { CandidateCard } from "./CandidateCard";
import { CandidateProfileDialog } from "./CandidateProfileDialog";
import { useToast } from "@/hooks/use-toast";
import { Search, Filter, Loader2, Users } from "lucide-react";
import { dummyCandidates } from "@/data/dummyElectoralCandidates";
import { mockElectoralVotes } from "@/data/mockElectoralVotes";

interface Application {
  id: string;
  student_name: string;
  student_email: string;
  student_photo: string | null;
  position: string;
  class_name: string;
  stream_name: string;
  sex?: string;
  status: string;
}

interface CandidateWithVotes extends Application {
  votes: number;
  rank: number;
  totalCandidates: number;
}

export function CandidatesSection() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterPosition, setFilterPosition] = useState("all");
  const [filterSex, setFilterSex] = useState("all");
  const [filterClass, setFilterClass] = useState("all");
  const [filterStream, setFilterStream] = useState("all");
  const [sortBy, setSortBy] = useState<"name" | "votes">("votes");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [selectedCandidate, setSelectedCandidate] = useState<CandidateWithVotes | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Use dummy data
  const applications = dummyCandidates;
  const votes = mockElectoralVotes;

  // Calculate candidates with votes and rankings
  const candidatesWithVotes = useMemo(() => {
    const voteCounts: Record<string, number> = {};
    votes.forEach(vote => {
      voteCounts[vote.candidate_id] = (voteCounts[vote.candidate_id] || 0) + 1;
    });

    // Group by position to calculate ranks
    const candidatesByPosition: Record<string, CandidateWithVotes[]> = {};

    applications.forEach(app => {
      const voteCount = voteCounts[app.id] || 0;
      const position = app.position;

      if (!candidatesByPosition[position]) {
        candidatesByPosition[position] = [];
      }

      candidatesByPosition[position].push({
        ...app,
        votes: voteCount,
        rank: 0, // Will be calculated
        totalCandidates: 0 // Will be calculated
      });
    });

    // Calculate ranks within each position
    Object.keys(candidatesByPosition).forEach(position => {
      const candidates = candidatesByPosition[position];
      candidates.sort((a, b) => b.votes - a.votes);
      candidates.forEach((candidate, index) => {
        candidate.rank = index + 1;
        candidate.totalCandidates = candidates.length;
      });
    });

    // Flatten back to array
    return Object.values(candidatesByPosition).flat();
  }, []);

  // Get unique values for filters
  const positions = useMemo(() => 
    [...new Set(applications.map(app => app.position))].sort(),
    [applications]
  );

  const classes = useMemo(() => 
    [...new Set(applications.map(app => app.class_name))].sort(),
    [applications]
  );

  const streams = useMemo(() => 
    [...new Set(applications.map(app => app.stream_name))].sort(),
    [applications]
  );

  // Filter and sort candidates
  const filteredCandidates = useMemo(() => {
    let filtered = candidatesWithVotes.filter(candidate => {
      const matchesSearch = 
        candidate.student_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        candidate.position.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesPosition = filterPosition === "all" || candidate.position === filterPosition;
      const matchesSex = filterSex === "all" || candidate.sex === filterSex;
      const matchesClass = filterClass === "all" || candidate.class_name === filterClass;
      const matchesStream = filterStream === "all" || candidate.stream_name === filterStream;

      return matchesSearch && matchesPosition && matchesSex && matchesClass && matchesStream;
    });

    // Sort
    if (sortBy === "name") {
      filtered.sort((a, b) => a.student_name.localeCompare(b.student_name));
    } else {
      filtered.sort((a, b) => b.votes - a.votes);
    }

    return filtered;
  }, [candidatesWithVotes, searchQuery, filterPosition, filterSex, filterClass, filterStream, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filteredCandidates.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = itemsPerPage === 999999 ? filteredCandidates.length : startIndex + itemsPerPage;
  const paginatedCandidates = filteredCandidates.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filterPosition, filterSex, filterClass, filterStream, sortBy, itemsPerPage]);

  const handleCandidateClick = (candidate: CandidateWithVotes) => {
    setSelectedCandidate(candidate);
    setDialogOpen(true);
  };

  const getPositionCandidates = (position: string) => {
    return candidatesWithVotes
      .filter(c => c.position === position)
      .sort((a, b) => b.votes - a.votes)
      .map(c => ({
        name: c.student_name,
        votes: c.votes,
        rank: c.rank
      }));
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setFilterPosition("all");
    setFilterSex("all");
    setFilterClass("all");
    setFilterStream("all");
    setSortBy("votes");
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="flex flex-col items-center justify-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Loading candidates...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Electoral Candidates Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by candidate name or position..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            <Select value={filterPosition} onValueChange={setFilterPosition}>
              <SelectTrigger>
                <SelectValue placeholder="All Positions" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Positions</SelectItem>
                {positions.map(pos => (
                  <SelectItem key={pos} value={pos}>{pos}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filterSex} onValueChange={setFilterSex}>
              <SelectTrigger>
                <SelectValue placeholder="All Genders" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Genders</SelectItem>
                <SelectItem value="Male">Male</SelectItem>
                <SelectItem value="Female">Female</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterClass} onValueChange={setFilterClass}>
              <SelectTrigger>
                <SelectValue placeholder="All Classes" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Classes</SelectItem>
                {classes.map(cls => (
                  <SelectItem key={cls} value={cls}>{cls}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filterStream} onValueChange={setFilterStream}>
              <SelectTrigger>
                <SelectValue placeholder="All Streams" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Streams</SelectItem>
                {streams.map(stream => (
                  <SelectItem key={stream} value={stream}>{stream}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={(value) => setSortBy(value as "name" | "votes")}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="votes">Sort by Votes</SelectItem>
                <SelectItem value="name">Sort by Name (A-Z)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Active Filters & Clear */}
          <div className="flex items-center justify-between flex-wrap gap-2">
            <p className="text-sm text-muted-foreground">
              Showing {paginatedCandidates.length} of {filteredCandidates.length} candidates
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearFilters}
            >
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Candidates Grid */}
      {paginatedCandidates.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <div className="text-center space-y-2">
              <Users className="h-12 w-12 mx-auto text-muted-foreground" />
              <h3 className="text-lg font-medium">No candidates found</h3>
              <p className="text-sm text-muted-foreground">
                Try adjusting your search or filters
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {paginatedCandidates.map(candidate => (
            <CandidateCard
              key={candidate.id}
              id={candidate.id}
              name={candidate.student_name}
              photo={candidate.student_photo}
              position={candidate.position}
              votes={candidate.votes}
              rank={candidate.rank}
              className={candidate.class_name}
              stream={candidate.stream_name}
              onClick={() => handleCandidateClick(candidate)}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {filteredCandidates.length > 12 && (
        <Card>
          <CardContent className="py-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              {/* Items per page */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Show:</span>
                <Select 
                  value={itemsPerPage.toString()} 
                  onValueChange={(value) => setItemsPerPage(Number(value))}
                >
                  <SelectTrigger className="w-24">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="12">12</SelectItem>
                    <SelectItem value="24">24</SelectItem>
                    <SelectItem value="48">48</SelectItem>
                    <SelectItem value="999999">All</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Pagination Controls */}
              {itemsPerPage !== 999999 && (
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                    
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }
                      
                      return (
                        <PaginationItem key={pageNum}>
                          <PaginationLink
                            onClick={() => setCurrentPage(pageNum)}
                            isActive={currentPage === pageNum}
                            className="cursor-pointer"
                          >
                            {pageNum}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    })}
                    
                    <PaginationItem>
                      <PaginationNext 
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Candidate Profile Dialog */}
      <CandidateProfileDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        candidate={selectedCandidate}
        positionCandidates={selectedCandidate ? getPositionCandidates(selectedCandidate.position) : []}
      />
    </div>
  );
}
