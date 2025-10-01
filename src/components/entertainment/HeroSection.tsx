import { Movie } from "@/types/movie";
import { Button } from "@/components/ui/button";
import { Play, Info } from "lucide-react";

interface HeroSectionProps {
  movie: Movie;
  onPlay: () => void;
}

export function HeroSection({ movie, onPlay }: HeroSectionProps) {
  return (
    <div className="relative w-full h-[50vh] sm:h-[60vh] lg:h-[75vh] mb-4 sm:mb-6 lg:mb-8 overflow-hidden rounded-lg sm:rounded-xl lg:rounded-2xl">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img 
          src={movie.thumbnail}
          alt={movie.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 sm:via-background/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative h-full flex flex-col justify-end p-4 sm:p-8 lg:p-16 space-y-3 sm:space-y-4 lg:space-y-6 max-w-xl lg:max-w-3xl">
        <h1 className="text-2xl sm:text-4xl lg:text-6xl font-bold text-foreground drop-shadow-2xl leading-tight">
          {movie.title}
        </h1>
        
        <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 text-sm sm:text-base lg:text-lg flex-wrap">
          <span className="text-foreground/90 font-semibold">{movie.year}</span>
          <span className="text-foreground/70">•</span>
          <span className="text-foreground/90 line-clamp-1">{movie.genres.slice(0, 3).join(" • ")}</span>
        </div>

        <p className="text-sm sm:text-base lg:text-lg text-foreground/80 line-clamp-2 sm:line-clamp-3 leading-relaxed hidden sm:block">
          {movie.extract}
        </p>

        <div className="flex gap-2 sm:gap-3 lg:gap-4 pt-2">
          <Button 
            size="lg" 
            onClick={onPlay}
            className="gap-2 text-sm sm:text-base lg:text-lg h-10 sm:h-12 lg:h-14 px-4 sm:px-6 lg:px-8 rounded-md sm:rounded-lg bg-white text-black hover:bg-white/90 transition-all"
          >
            <Play className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 fill-current" />
            <span className="hidden sm:inline">Play</span>
            <span className="sm:hidden">▶</span>
          </Button>
          <Button 
            size="lg" 
            variant="outline"
            onClick={onPlay}
            className="gap-2 text-sm sm:text-base lg:text-lg h-10 sm:h-12 lg:h-14 px-4 sm:px-6 lg:px-8 rounded-md sm:rounded-lg bg-white/20 backdrop-blur-sm border-white/40 text-white hover:bg-white/30 transition-all"
          >
            <Info className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
            <span className="hidden sm:inline">More Info</span>
            <span className="sm:hidden">Info</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
