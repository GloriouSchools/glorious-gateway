import { useState, useMemo } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { HeroSection } from "@/components/entertainment/HeroSection";
import { MovieRow } from "@/components/entertainment/MovieRow";
import { Input } from "@/components/ui/input";
import { Movie } from "@/types/movie";
import { movieData, movieGenres } from "@/data/movieData";
import { Search } from "lucide-react";

const Entertainment = () => {
  const { userRole, userName, photoUrl, signOut } = useAuth();
  const navigate = useNavigate();
  
  const [searchQuery, setSearchQuery] = useState("");

  // Featured movie (first movie)
  const featuredMovie = movieData[0];

  const handleLogout = async () => {
    try {
      await signOut();
      toast.info("You have been logged out");
      navigate("/login");
    } catch (error: any) {
      toast.error("Failed to log out");
    }
  };

  // Group movies by genre - optimized to only compute once
  const moviesByGenre = useMemo(() => {
    const grouped: Record<string, Movie[]> = {};
    
    // Initialize empty arrays for each genre
    movieGenres.forEach(genre => {
      grouped[genre] = [];
    });
    
    // Single pass through movies instead of filtering for each genre
    movieData.forEach(movie => {
      movie.genres.forEach(genre => {
        if (grouped[genre]) {
          grouped[genre].push(movie);
        }
      });
    });
    
    return grouped;
  }, []); // Empty deps since movieData and movieGenres are static

  // Search results
  const searchResults = useMemo(() => {
    if (!searchQuery) return null;
    
    return movieData.filter(movie =>
      movie.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      movie.genres.some(genre => genre.toLowerCase().includes(searchQuery.toLowerCase())) ||
      movie.cast.some(actor => actor.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [searchQuery]);

  const handleMovieClick = (movie: Movie) => {
    const movieIndex = movieData.findIndex(m => m.title === movie.title);
    const basePath = userRole === "admin" ? "/admin" : userRole === "teacher" ? "/teacher" : "/student";
    navigate(`${basePath}/entertainment/${movieIndex}`);
  };

  return (
    <DashboardLayout 
      userRole={userRole || "student"} 
      userName={userName} 
      photoUrl={photoUrl} 
      onLogout={handleLogout}
    >
      <div className="space-y-4 sm:space-y-6 lg:space-y-8 pb-6 sm:pb-8 lg:pb-12 min-h-screen">
        {/* Search Bar - Fixed at top */}
        <div className="sticky top-0 z-20 bg-background/95 backdrop-blur-md py-3 sm:py-4 px-2 sm:px-4 lg:px-8 -mx-2 sm:-mx-4 lg:-mx-8 border-b border-border/50">
          <div className="max-w-3xl mx-auto">
            <div className="relative">
              <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search movies, genres, actors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 sm:pl-12 pr-4 h-10 sm:h-12 rounded-full bg-muted/50 border-0 focus-visible:ring-2 focus-visible:ring-primary/50 text-sm sm:text-base transition-all"
              />
            </div>
          </div>
        </div>

        {/* Search Results */}
        {searchResults && searchResults.length > 0 ? (
          <div className="space-y-3 sm:space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold text-foreground px-2 sm:px-4 lg:px-8">
              Search Results ({searchResults.length})
            </h2>
            <MovieRow 
              title=""
              movies={searchResults}
              onMovieClick={handleMovieClick}
            />
          </div>
        ) : searchQuery ? (
          <div className="text-center py-12 sm:py-16 lg:py-24 px-4">
            <div className="text-4xl sm:text-5xl lg:text-6xl mb-3 sm:mb-4">🔍</div>
            <p className="text-lg sm:text-xl font-semibold text-foreground mb-2">No results found</p>
            <p className="text-sm sm:text-base text-muted-foreground">Try searching for something else</p>
          </div>
        ) : (
          <>
            {/* Hero Section */}
            <HeroSection 
              movie={featuredMovie}
              onPlay={() => handleMovieClick(featuredMovie)}
            />

            {/* Movie Rows by Genre */}
            <div className="space-y-4 sm:space-y-6 lg:space-y-8">
              <MovieRow 
                title="Trending Now"
                movies={movieData.slice(0, 10)}
                onMovieClick={handleMovieClick}
              />

              {movieGenres.slice(0, 5).map(genre => (
                moviesByGenre[genre]?.length > 0 && (
                  <MovieRow 
                    key={genre}
                    title={genre}
                    movies={moviesByGenre[genre].slice(0, 12)}
                    onMovieClick={handleMovieClick}
                  />
                )
              ))}

              <MovieRow 
                title="Popular Picks"
                movies={movieData.slice().reverse().slice(0, 10)}
                onMovieClick={handleMovieClick}
              />
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Entertainment;
