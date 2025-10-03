import { Movie } from "@/types/movie";
import { Button } from "@/components/ui/button";
import { Play, Info, ChevronLeft, ChevronRight } from "lucide-react";

interface HeroSectionProps {
  movies: Movie[];
  currentIndex: number;
  onPlay: () => void;
  onIndexChange: (index: number) => void;
}

export function HeroSection({ movies, currentIndex, onPlay, onIndexChange }: HeroSectionProps) {
  if (!movies.length) return null;
  
  const movie = movies[currentIndex];

  const handlePrevious = () => {
    onIndexChange(currentIndex === 0 ? movies.length - 1 : currentIndex - 1);
  };

  const handleNext = () => {
    onIndexChange((currentIndex + 1) % movies.length);
  };

  return (
    <div className="relative w-full h-[50vh] sm:h-[60vh] lg:h-[70vh] mb-8 overflow-hidden rounded-2xl mx-2 sm:mx-4 lg:mx-6">
      {/* Background Image with Gradient Overlay */}
      <div className="absolute inset-0">
        <img 
          src={movie.thumbnail}
          alt={movie.title}
          className="w-full h-full object-cover object-center"
          onError={(e) => {
            e.currentTarget.src = "https://via.placeholder.com/1920x1080/1a1a1a/ffffff?text=Movie+Banner";
          }}
        />
        {/* Multi-layer gradient for better readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-transparent to-transparent" />
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={handlePrevious}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 bg-background/80 hover:bg-background/90 backdrop-blur-sm p-2 rounded-full transition-all hover:scale-110 shadow-lg"
        aria-label="Previous movie"
      >
        <ChevronLeft className="w-6 h-6 text-foreground" />
      </button>
      <button
        onClick={handleNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 bg-background/80 hover:bg-background/90 backdrop-blur-sm p-2 rounded-full transition-all hover:scale-110 shadow-lg"
        aria-label="Next movie"
      >
        <ChevronRight className="w-6 h-6 text-foreground" />
      </button>

      {/* Content */}
      <div className="relative h-full flex flex-col justify-end p-6 sm:p-8 lg:p-12 space-y-3 sm:space-y-4 max-w-2xl z-20">
        {/* Title */}
        <h1 className="text-3xl sm:text-4xl lg:text-6xl font-extrabold text-foreground drop-shadow-[0_2px_20px_rgba(0,0,0,0.9)] leading-tight animate-fade-in">
          {movie.title}
        </h1>
        
        {/* Year & Genres */}
        <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm flex-wrap animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <span className="text-foreground font-bold bg-primary/30 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-lg">
            {movie.year}
          </span>
          {movie.genres.slice(0, 3).map((genre, idx) => (
            <span key={idx} className="text-foreground/90 bg-muted/60 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-md">
              {genre}
            </span>
          ))}
        </div>

        {/* Description */}
        <p className="text-sm sm:text-base lg:text-lg text-foreground/90 line-clamp-2 leading-relaxed max-w-xl drop-shadow-lg animate-fade-in hidden sm:block" style={{ animationDelay: '0.2s' }}>
          {movie.extract}
        </p>

        {/* Action Buttons */}
        <div className="flex gap-3 sm:gap-4 pt-1 animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <Button 
            size="lg" 
            onClick={onPlay}
            className="gap-2 text-sm sm:text-base font-bold h-10 sm:h-12 px-6 sm:px-8 rounded-full bg-white text-black hover:bg-white/90 hover:scale-105 transition-all shadow-xl"
          >
            <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
            <span>Play</span>
          </Button>
          <Button 
            size="lg" 
            variant="outline"
            onClick={onPlay}
            className="gap-2 text-sm sm:text-base font-semibold h-10 sm:h-12 px-6 sm:px-8 rounded-full bg-background/40 backdrop-blur-md border-2 border-border/50 hover:bg-background/60 hover:border-primary/50 hover:scale-105 transition-all shadow-lg"
          >
            <Info className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>More Info</span>
          </Button>
        </div>
      </div>

      {/* Dot Indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex gap-2">
        {movies.map((_, index) => (
          <button
            key={index}
            onClick={() => onIndexChange(index)}
            className={`transition-all rounded-full ${
              index === currentIndex
                ? 'w-8 h-2 bg-primary'
                : 'w-2 h-2 bg-foreground/40 hover:bg-foreground/60'
            }`}
            aria-label={`Go to movie ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
