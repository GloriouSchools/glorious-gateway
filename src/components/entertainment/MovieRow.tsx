import { Movie } from "@/types/movie";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";

interface MovieRowProps {
  title: string;
  movies: Movie[];
  onMovieClick: (movie: Movie) => void;
}

export function MovieRow({ title, movies, onMovieClick }: MovieRowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    
    const scrollAmount = scrollRef.current.clientWidth * 0.8;
    const newScrollLeft = scrollRef.current.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount);
    
    scrollRef.current.scrollTo({
      left: newScrollLeft,
      behavior: 'smooth'
    });
  };

  const handleScroll = () => {
    if (!scrollRef.current) return;
    
    setCanScrollLeft(scrollRef.current.scrollLeft > 0);
    setCanScrollRight(
      scrollRef.current.scrollLeft < scrollRef.current.scrollWidth - scrollRef.current.clientWidth - 10
    );
  };

  return (
    <div className="space-y-2 sm:space-y-3 lg:space-y-4 group/row">
      <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground px-2 sm:px-4 lg:px-8">
        {title}
      </h2>
      
      <div className="relative">
        {/* Left Arrow */}
        {canScrollLeft && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 h-full w-8 sm:w-10 lg:w-12 rounded-none bg-background/80 hover:bg-background/95 backdrop-blur-sm opacity-0 group-hover/row:opacity-100 transition-all duration-300 border-r border-border/50"
            onClick={() => scroll('left')}
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-foreground" />
          </Button>
        )}

        {/* Movies Container */}
        <div 
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex gap-1.5 sm:gap-2 lg:gap-3 overflow-x-auto scrollbar-hide px-2 sm:px-4 lg:px-8 pb-3 sm:pb-4 snap-x snap-mandatory scroll-smooth"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {movies.map((movie, index) => (
            <div
              key={`${movie.title}-${index}`}
              className="flex-shrink-0 w-28 sm:w-36 md:w-44 lg:w-52 snap-start cursor-pointer group/card transition-transform duration-300 hover:scale-105"
              onClick={() => onMovieClick(movie)}
            >
              <div className="relative aspect-[2/3] rounded-md overflow-hidden shadow-lg group-hover/card:shadow-2xl transition-all duration-300 group-hover/card:ring-2 group-hover/card:ring-primary/50">
                <img 
                  src={movie.thumbnail}
                  alt={movie.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.src = "https://via.placeholder.com/300x450/e5e7eb/6b7280?text=Movie";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/0 to-black/0 opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-full bg-white/95 flex items-center justify-center shadow-xl scale-0 group-hover/card:scale-100 transition-transform duration-300">
                    <div className="w-0 h-0 border-t-[6px] sm:border-t-[8px] border-t-transparent border-l-[10px] sm:border-l-[12px] border-l-black border-b-[6px] sm:border-b-[8px] border-b-transparent ml-1" />
                  </div>
                </div>
              </div>
              <h3 className="text-xs sm:text-sm font-medium text-foreground mt-1.5 sm:mt-2 line-clamp-2 px-0.5 leading-tight">
                {movie.title}
              </h3>
            </div>
          ))}
        </div>

        {/* Right Arrow */}
        {canScrollRight && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 h-full w-8 sm:w-10 lg:w-12 rounded-none bg-background/80 hover:bg-background/95 backdrop-blur-sm opacity-0 group-hover/row:opacity-100 transition-all duration-300 border-l border-border/50"
            onClick={() => scroll('right')}
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-foreground" />
          </Button>
        )}
      </div>
    </div>
  );
}
