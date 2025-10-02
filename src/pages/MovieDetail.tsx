import { useState, useMemo, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { MovieRow } from "@/components/entertainment/MovieRow";
import { MovieModal } from "@/components/entertainment/MovieModal";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Play, ArrowLeft } from "lucide-react";
import { Movie } from "@/types/movie";
import { movieData, movieGenres } from "@/data/movieData";

const MovieDetail = () => {
  const { movieId } = useParams<{ movieId: string }>();
  const navigate = useNavigate();
  const { userRole, userName, photoUrl, signOut } = useAuth();
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const movie = useMemo(() => {
    return movieData.find((m, index) => index.toString() === movieId);
  }, [movieId]);

  const relatedMovies = useMemo(() => {
    if (!movie) return [];
    return movieData.filter(
      (m, index) =>
        m.genres.some(genre => movie.genres.includes(genre)) &&
        index.toString() !== movieId
    ).slice(0, 12);
  }, [movie, movieId]);

  const recommendedMovies = useMemo(() => {
    if (!movie) return [];
    return movieData.filter(
      (m, index) => index.toString() !== movieId
    ).slice(0, 12);
  }, [movie, movieId]);

  const moviesByGenre = useMemo(() => {
    const grouped: Record<string, Movie[]> = {};
    movieGenres.forEach(genre => {
      grouped[genre] = movieData.filter(m => m.genres.includes(genre)).slice(0, 12);
    });
    return grouped;
  }, []);

  const handleLogout = async () => {
    try {
      await signOut();
      toast.info("You have been logged out");
      navigate("/login");
    } catch (error: any) {
      toast.error("Failed to log out");
    }
  };

  const handleMovieClick = (clickedMovie: Movie) => {
    const movieIndex = movieData.findIndex(m => m.title === clickedMovie.title);
    const basePath = userRole === "admin" ? "/admin" : userRole === "teacher" ? "/teacher" : "/student";
    navigate(`${basePath}/entertainment/${movieIndex}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePlayMovie = () => {
    setSelectedMovie(movie);
    setIsModalOpen(true);
  };

  const handleBack = () => {
    const basePath = userRole === "admin" ? "/admin" : userRole === "teacher" ? "/teacher" : "/student";
    navigate(`${basePath}/entertainment`);
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [movieId]);

  if (!movie) {
    return (
      <DashboardLayout 
        userRole={userRole || "student"} 
        userName={userName} 
        photoUrl={photoUrl} 
        onLogout={handleLogout}
      >
        <div className="text-center py-24">
          <h2 className="text-2xl font-bold text-foreground mb-4">Movie not found</h2>
          <Button onClick={handleBack}>Back to Entertainment</Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout 
      userRole={userRole || "student"} 
      userName={userName} 
      photoUrl={photoUrl} 
      onLogout={handleLogout}
    >
      <div className="w-full max-w-[100vw] overflow-x-hidden">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
          {/* Back Button */}
          <Button
            variant="ghost"
            onClick={handleBack}
            className="gap-2 hover:bg-muted"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Entertainment
          </Button>

          {/* Hero Card */}
          <Card className="overflow-hidden border-0 shadow-xl">
            <div className="relative bg-gradient-to-br from-muted/50 to-background">
              <CardContent className="p-0">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 p-4 sm:p-6 lg:p-8">
                  
                  {/* Poster Column */}
                  <div className="lg:col-span-3 flex flex-col space-y-4">
                    <div className="w-full max-w-[250px] mx-auto lg:max-w-none">
                      <img 
                        src={movie.thumbnail}
                        alt={movie.title}
                        className="w-full aspect-[2/3] object-cover rounded-lg shadow-lg"
                        onError={(e) => {
                          e.currentTarget.src = "https://via.placeholder.com/300x450/1a1a1a/ffffff?text=Movie+Poster";
                        }}
                      />
                    </div>
                    
                    {/* Desktop CTA */}
                    <div className="hidden lg:block">
                      <Button 
                        size="lg" 
                        onClick={handlePlayMovie}
                        className="w-full gap-2"
                      >
                        <Play className="w-4 h-4 fill-current" />
                        Play Now
                      </Button>
                    </div>
                  </div>

                  {/* Content Column */}
                  <div className="lg:col-span-9 space-y-4 sm:space-y-6">
                    {/* Title & Meta */}
                    <div className="space-y-3">
                      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground leading-tight">
                        {movie.title}
                      </h1>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground flex-wrap">
                        <span className="font-semibold text-foreground">{movie.year}</span>
                        <span>•</span>
                        <span>{movie.genres.join(", ")}</span>
                      </div>
                    </div>

                    {/* Trailer Card */}
                    <Card className="overflow-hidden border-2 border-border/50">
                      <div 
                        className="relative aspect-video bg-black cursor-pointer group"
                        onClick={handlePlayMovie}
                      >
                        <img 
                          src={movie.thumbnail}
                          alt={`${movie.title} trailer`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors" />
                        
                        {/* Play Button */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-primary flex items-center justify-center group-hover:scale-110 transition-transform shadow-2xl">
                            <Play className="w-8 h-8 sm:w-10 sm:h-10 text-primary-foreground fill-current ml-1" />
                          </div>
                        </div>
                      </div>
                    </Card>

                    {/* Mobile CTA */}
                    <div className="lg:hidden">
                      <Button 
                        size="lg" 
                        onClick={handlePlayMovie}
                        className="w-full gap-2"
                      >
                        <Play className="w-5 h-5 fill-current" />
                        Play Now
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </div>
          </Card>

          {/* Description Card */}
          <Card>
            <CardContent className="p-4 sm:p-6 lg:p-8 space-y-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-3">The Story</h2>
                <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                  {movie.extract}
                </p>
              </div>

              {movie.cast && movie.cast.length > 0 && (
                <div>
                  <h3 className="text-lg font-bold text-foreground mb-2">Cast</h3>
                  <p className="text-muted-foreground leading-relaxed text-sm">
                    {movie.cast.join(", ")}
                  </p>
                </div>
              )}

              <div>
                <h3 className="text-lg font-bold text-foreground mb-2">Genres</h3>
                <div className="flex flex-wrap gap-2">
                  {movie.genres.map((genre) => (
                    <span 
                      key={genre}
                      className="px-3 py-1.5 rounded-full bg-muted text-foreground text-xs sm:text-sm font-medium"
                    >
                      {genre}
                    </span>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Related Movies */}
          {relatedMovies.length > 0 && (
            <div>
              <MovieRow 
                title="Related Movies"
                movies={relatedMovies}
                onMovieClick={handleMovieClick}
              />
            </div>
          )}

          {/* Movies You May Like */}
          <div>
            <MovieRow 
              title="Movies You May Like"
              movies={recommendedMovies}
              onMovieClick={handleMovieClick}
            />
          </div>

          {/* Other Categories */}
          {movieGenres.slice(0, 3).map(genre => (
            moviesByGenre[genre].length > 0 && (
              <div key={genre}>
                <MovieRow 
                  title={genre}
                  movies={moviesByGenre[genre]}
                  onMovieClick={handleMovieClick}
                />
              </div>
            )
          ))}
        </div>
      </div>

      <MovieModal 
        movie={selectedMovie}
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </DashboardLayout>
  );
};

export default MovieDetail;

