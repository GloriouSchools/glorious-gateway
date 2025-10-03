import { useState, useMemo, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { HeroSection } from "@/components/entertainment/HeroSection";
import { MovieRow } from "@/components/entertainment/MovieRow";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Movie } from "@/types/movie";
import { movieData, movieGenres } from "@/data/movieData";
import { Search, Filter, X } from "lucide-react";
import { movieTitleToSlug } from "@/utils/movieUtils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Entertainment = () => {
  const { userRole, userName, photoUrl, signOut } = useAuth();
  const navigate = useNavigate();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState<string>("all");
  const [selectedYear, setSelectedYear] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);

  // Get unique years from movie data
  const availableYears = useMemo(() => {
    const years = Array.from(new Set(movieData.map(m => m.year))).sort((a, b) => b - a);
    return years;
  }, []);

  // Shuffle movies once and cache with session storage (excluding restricted genres)
  const shuffledMovies = useMemo(() => {
    const cacheKey = 'shuffled-movies-cache';
    const cached = sessionStorage.getItem(cacheKey);
    
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch {
        // If parse fails, continue to shuffle
      }
    }
    
    const restrictedGenres = ['Romance', 'Erotic', 'Adult'];
    const allowedMovies = movieData.filter(movie => 
      !movie.genres.some(genre => restrictedGenres.includes(genre))
    );
    
    const shuffled = [...allowedMovies];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    
    sessionStorage.setItem(cacheKey, JSON.stringify(shuffled));
    return shuffled;
  }, []);

  // Featured movies (5 random animated movies)
  const featuredMovies = useMemo(() => {
    const animatedMovies = shuffledMovies.filter(movie => movie.genres.includes('Animated'));
    return animatedMovies.slice(0, 5);
  }, [shuffledMovies]);

  // Auto-rotate hero movies every 5 seconds
  useEffect(() => {
    if (featuredMovies.length === 0) return;
    
    const interval = setInterval(() => {
      setCurrentHeroIndex((prev) => (prev + 1) % featuredMovies.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [featuredMovies.length]);

  const featuredMovie = featuredMovies[currentHeroIndex] || shuffledMovies[0];

  const handleLogout = async () => {
    try {
      await signOut();
      toast.info("You have been logged out");
      navigate("/login");
    } catch (error: any) {
      toast.error("Failed to log out");
    }
  };

  // Filter movies based on selected filters (already excludes Romance/Erotic from shuffledMovies)
  const filteredMovies = useMemo(() => {
    let filtered = shuffledMovies;
    
    if (selectedGenre !== "all") {
      filtered = filtered.filter(movie => movie.genres.includes(selectedGenre));
    }
    
    if (selectedYear !== "all") {
      filtered = filtered.filter(movie => movie.year === parseInt(selectedYear));
    }
    
    return filtered;
  }, [shuffledMovies, selectedGenre, selectedYear]);

  // Animated movies
  const animationMovies = useMemo(() => {
    return filteredMovies.filter(movie => movie.genres.includes('Animated')).slice(0, 15);
  }, [filteredMovies]);

  const randomMixedMovies = useMemo(() => {
    return filteredMovies
      .filter(movie => !movie.genres.includes('Animated'))
      .slice(0, 15);
  }, [filteredMovies]);

  const peopleAlsoWatched = useMemo(() => {
    return shuffledMovies.slice(15, 30);
  }, [shuffledMovies]);

  const trendingNow = useMemo(() => {
    return shuffledMovies.slice(30, 45);
  }, [shuffledMovies]);

  const suggestedForYou = useMemo(() => {
    return shuffledMovies.slice(45, 60);
  }, [shuffledMovies]);

  // All movies organized by genre (excluding restricted genres)
  const moviesByGenre = useMemo(() => {
    const restrictedGenres = ['Romance', 'Erotic', 'Adult', 'Animated'];
    const grouped: Record<string, Movie[]> = {};
    
    movieGenres
      .filter(genre => !restrictedGenres.includes(genre))
      .forEach(genre => {
        const genreMovies = filteredMovies.filter(m => m.genres.includes(genre));
        // Shuffle and take up to 15 movies per genre for scrolling
        grouped[genre] = genreMovies.sort(() => Math.random() - 0.5).slice(0, 15);
      });
    
    return grouped;
  }, [filteredMovies]);

  const clearFilters = () => {
    setSelectedGenre("all");
    setSelectedYear("all");
  };

  const hasActiveFilters = selectedGenre !== "all" || selectedYear !== "all";

  // Search results (excluding restricted genres)
  const searchResults = useMemo(() => {
    if (!searchQuery) return null;
    
    const restrictedGenres = ['Romance', 'Erotic', 'Adult'];
    return movieData
      .filter(movie => !movie.genres.some(genre => restrictedGenres.includes(genre)))
      .filter(movie =>
        movie.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        movie.genres.some(genre => genre.toLowerCase().includes(searchQuery.toLowerCase())) ||
        movie.cast.some(actor => actor.toLowerCase().includes(searchQuery.toLowerCase()))
      );
  }, [searchQuery]);

  const handleMovieClick = (movie: Movie) => {
    const movieSlug = movieTitleToSlug(movie.title);
    const basePath = userRole === "admin" ? "/admin" : userRole === "teacher" ? "/teacher" : "/student";
    navigate(`${basePath}/entertainment/${movieSlug}`);
  };


  return (
    <DashboardLayout 
      userRole={userRole || "student"} 
      userName={userName} 
      photoUrl={photoUrl} 
      onLogout={handleLogout}
    >
      <div className="space-y-0 pb-6 sm:pb-8 lg:pb-12 min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
        {/* Search Bar & Filters - Fixed at top */}
        <div className="sticky top-0 z-20 bg-background/98 backdrop-blur-xl py-3 sm:py-4 px-2 sm:px-4 lg:px-8 -mx-2 sm:-mx-4 lg:-mx-8 border-b border-border/30 shadow-lg">
          <div className="max-w-6xl mx-auto space-y-3">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search movies, genres, actors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 sm:pl-12 pr-12 h-10 sm:h-12 rounded-full bg-muted/60 border border-border/50 focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:border-primary/60 text-sm sm:text-base transition-all shadow-sm"
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowFilters(!showFilters)}
                className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 sm:h-8 sm:w-8 rounded-full hover:bg-primary/10"
              >
                <Filter className={`h-4 w-4 ${hasActiveFilters ? 'text-primary' : 'text-muted-foreground'}`} />
              </Button>
            </div>

            {/* Filter Options */}
            {showFilters && (
              <div className="flex flex-wrap gap-2 sm:gap-3 items-center animate-in slide-in-from-top-2 duration-200">
                <Select value={selectedGenre} onValueChange={setSelectedGenre}>
                  <SelectTrigger className="w-[140px] sm:w-[160px] h-9 rounded-full bg-muted/60 border-border/50">
                    <SelectValue placeholder="All Genres" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px] bg-background">
                    <SelectItem value="all">All Genres</SelectItem>
                    {movieGenres.map(genre => (
                      <SelectItem key={genre} value={genre}>{genre}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedYear} onValueChange={setSelectedYear}>
                  <SelectTrigger className="w-[120px] sm:w-[140px] h-9 rounded-full bg-muted/60 border-border/50">
                    <SelectValue placeholder="All Years" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px] bg-background">
                    <SelectItem value="all">All Years</SelectItem>
                    {availableYears.map(year => (
                      <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {hasActiveFilters && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearFilters}
                    className="h-9 rounded-full text-xs"
                  >
                    <X className="h-3 w-3 mr-1" />
                    Clear Filters
                  </Button>
                )}
                
                <span className="text-xs text-muted-foreground ml-auto">
                  {filteredMovies.length} movies
                </span>
              </div>
            )}
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
              movies={featuredMovies}
              currentIndex={currentHeroIndex}
              onPlay={() => handleMovieClick(featuredMovie)}
              onIndexChange={setCurrentHeroIndex}
            />

            {/* Movie Rows */}
            <div className="space-y-6 sm:space-y-8 lg:space-y-10 mt-6 sm:mt-8 lg:mt-10">
              {/* Animated Movies */}
              {animationMovies.length > 0 && (
                <MovieRow 
                  title="Animated"
                  movies={animationMovies}
                  onMovieClick={handleMovieClick}
                />
              )}

              {/* You May Also Like */}
              {randomMixedMovies.length > 0 && (
                <MovieRow 
                  title="You May Also Like"
                  movies={randomMixedMovies}
                  onMovieClick={handleMovieClick}
                />
              )}

              {/* People Also Watched */}
              {peopleAlsoWatched.length > 0 && (
                <MovieRow 
                  title="People Also Watched"
                  movies={peopleAlsoWatched}
                  onMovieClick={handleMovieClick}
                />
              )}

              {/* Trending Now */}
              {trendingNow.length > 0 && (
                <MovieRow 
                  title="Trending Now"
                  movies={trendingNow}
                  onMovieClick={handleMovieClick}
                />
              )}

              {/* Suggested for You */}
              {suggestedForYou.length > 0 && (
                <MovieRow 
                  title="Suggested for You"
                  movies={suggestedForYou}
                  onMovieClick={handleMovieClick}
                />
              )}

              {/* All Genre Rows */}
              {Object.entries(moviesByGenre).map(([genre, movies]) => (
                movies.length > 0 && (
                  <MovieRow 
                    key={genre}
                    title={genre}
                    movies={movies}
                    onMovieClick={handleMovieClick}
                  />
                )
              ))}
            </div>
          </>
        )}

      </div>
    </DashboardLayout>
  );
};

export default Entertainment;
