import { useState, useMemo } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { MovieCard } from "@/components/entertainment/MovieCard";
import { MovieModal } from "@/components/entertainment/MovieModal";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Movie } from "@/types/movie";
import { movieData, movieGenres } from "@/data/movieData";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";

const Entertainment = () => {
  const { userRole, userName, photoUrl, signOut } = useAuth();
  const navigate = useNavigate();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("all");
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);

  const handleLogout = async () => {
    try {
      await signOut();
      toast.info("You have been logged out");
      navigate("/login");
    } catch (error: any) {
      toast.error("Failed to log out");
    }
  };

  // Filter movies
  const filteredMovies = useMemo(() => {
    let filtered = [...movieData];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(movie =>
        movie.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        movie.genres.some(genre => genre.toLowerCase().includes(searchQuery.toLowerCase())) ||
        movie.cast.some(actor => actor.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Genre filter
    if (selectedGenre !== "all") {
      filtered = filtered.filter(movie => movie.genres.includes(selectedGenre));
    }

    return filtered;
  }, [searchQuery, selectedGenre]);

  // Pagination
  const totalPages = Math.ceil(filteredMovies.length / itemsPerPage);
  const paginatedMovies = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredMovies.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredMovies, currentPage, itemsPerPage]);

  // Reset to first page when filters change
  useMemo(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedGenre, itemsPerPage]);

  const handleMovieClick = (movie: Movie) => {
    setSelectedMovie(movie);
    setIsModalOpen(true);
  };

  return (
    <DashboardLayout 
      userRole={userRole || "student"} 
      userName={userName} 
      photoUrl={photoUrl} 
      onLogout={handleLogout}
    >
      <div className="space-y-8 animate-fade-in">
        {/* Header */}
        <div className="text-center space-y-3">
          <h1 className="text-5xl md:text-6xl font-bold gradient-text">🎬 Fun Movies 🍿</h1>
          <p className="text-lg md:text-xl text-muted-foreground font-medium">Watch your favorite movies and have fun!</p>
        </div>

        {/* Search Bar */}
        <div className="max-w-3xl mx-auto">
          <div className="relative">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-6 w-6 text-muted-foreground" />
            <Input
              type="text"
              placeholder="🔍 What movie do you want to watch?"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-14 pr-4 h-16 text-lg rounded-2xl border-2 focus:border-primary shadow-lg"
            />
          </div>
        </div>

        {/* Filters */}
        <div className="max-w-5xl mx-auto space-y-4">
          <p className="text-center text-lg font-semibold text-foreground mb-4">Filter by:</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
            <Select value={selectedGenre} onValueChange={setSelectedGenre}>
              <SelectTrigger className="h-14 text-lg rounded-xl border-2 shadow-md">
                <SelectValue placeholder="🎨 Pick a Genre" />
              </SelectTrigger>
              <SelectContent className="text-base">
                <SelectItem value="all" className="text-base py-3">
                  🎨 All Genres
                </SelectItem>
                {movieGenres.map(genre => (
                  <SelectItem key={genre} value={genre} className="text-base py-3">
                    🎬 {genre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* Clear Filters Button */}
          {(selectedGenre !== "all" || searchQuery) && (
            <div className="text-center">
              <Button 
                onClick={() => {
                  setSelectedGenre("all");
                  setSearchQuery("");
                  toast.success("Filters cleared!");
                }}
                variant="outline"
                size="lg"
                className="rounded-xl px-8 h-12 text-base font-semibold"
              >
                🔄 Clear All Filters
              </Button>
            </div>
          )}
        </div>

        {/* Results count */}
        {(searchQuery || selectedGenre !== "all") && (
          <div className="text-center">
            <div className="inline-block bg-primary/10 px-6 py-3 rounded-full border-2 border-primary/20">
              <p className="text-lg font-bold text-primary">
                🎉 Found {filteredMovies.length} awesome movie{filteredMovies.length !== 1 ? 's' : ''} for you!
              </p>
            </div>
          </div>
        )}

        {/* Movie Grid */}
        {paginatedMovies.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 pb-8">
            {paginatedMovies.map((movie, index) => (
              <MovieCard 
                key={`${movie.title}-${index}`}
                movie={movie}
                onClick={() => handleMovieClick(movie)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-gradient-to-br from-card to-card/50 rounded-3xl border-2 border-dashed border-border shadow-lg">
            <div className="text-6xl mb-4">😕</div>
            <p className="text-2xl font-bold text-card-foreground mb-2">Oops! No movies found</p>
            <p className="text-lg text-muted-foreground mb-6">Try searching for something else or change your filters</p>
            <Button 
              onClick={() => {
                setSelectedGenre("all");
                setSearchQuery("");
              }}
              size="lg"
              className="rounded-xl px-8 h-12 text-base font-semibold"
            >
              🔄 Show All Movies
            </Button>
          </div>
        )}

        {/* Pagination */}
        {filteredMovies.length > 0 && totalPages > 1 && (
          <div className="flex flex-col items-center gap-6 pt-8 pb-4">
            <div className="flex items-center gap-4">
              <Button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                size="lg"
                className="rounded-xl px-6 h-14 text-base font-bold gap-2"
                variant="outline"
              >
                <ChevronLeft className="w-5 h-5" />
                Previous
              </Button>
              
              <div className="bg-primary text-primary-foreground px-8 py-3 rounded-xl shadow-lg">
                <span className="text-lg font-bold">
                  Page {currentPage} of {totalPages}
                </span>
              </div>
              
              <Button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                size="lg"
                className="rounded-xl px-6 h-14 text-base font-bold gap-2"
                variant="outline"
              >
                Next
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>

            <Select 
              value={itemsPerPage.toString()} 
              onValueChange={(value) => setItemsPerPage(parseInt(value))}
            >
              <SelectTrigger className="w-48 h-12 text-base rounded-xl border-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="12" className="text-base py-3">🎬 Show 12 movies</SelectItem>
                <SelectItem value="24" className="text-base py-3">🎬 Show 24 movies</SelectItem>
                <SelectItem value="48" className="text-base py-3">🎬 Show 48 movies</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Movie Modal */}
        <MovieModal 
          movie={selectedMovie}
          open={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedMovie(null);
          }}
        />
      </div>
    </DashboardLayout>
  );
};

export default Entertainment;
