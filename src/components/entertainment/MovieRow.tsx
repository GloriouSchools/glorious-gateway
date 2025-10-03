import { Movie } from "@/types/movie";
import { ArrowLeft, ArrowRight, Play } from "lucide-react";
import { useRef, useState, useEffect, memo } from "react";
import { Button } from "@/components/ui/button";

interface MovieRowProps {
  title: string;
  movies: Movie[];
  onMovieClick: (movie: Movie) => void;
}

export const MovieRow = memo(function MovieRow({ title, movies, onMovieClick }: MovieRowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const rowRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isVisible, setIsVisible] = useState(false);

  // Intersection Observer for lazy loading
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect();
          }
        });
      },
      { rootMargin: '200px' }
    );

    if (rowRef.current) {
      observer.observe(rowRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Check scroll state on mount and when content loads
  useEffect(() => {
    if (!scrollRef.current || !isVisible) return;
    
    const checkScroll = () => {
      handleScroll();
    };
    
    // Check immediately
    checkScroll();
    
    // Check after images might have loaded
    const timer = setTimeout(checkScroll, 100);
    
    return () => clearTimeout(timer);
  }, [isVisible, movies]);

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
    <div ref={rowRef} className="space-y-3 sm:space-y-4 lg:space-y-5 py-2">
      <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground px-2 sm:px-4 lg:px-8 tracking-tight">
        {title}
      </h2>
      
      {!isVisible ? (
        <div className="h-48 sm:h-56 md:h-64 lg:h-72 bg-muted/20 animate-pulse rounded-lg mx-2 sm:mx-4 lg:mx-8" />
      ) : (
      <div className="relative group/row">
        {/* Left Arrow */}
        {canScrollLeft && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-2 sm:left-4 lg:left-6 top-1/2 -translate-y-1/2 z-10 h-12 w-12 sm:h-14 sm:w-14 lg:h-16 lg:w-16 rounded-full bg-background/95 backdrop-blur-md opacity-0 group-hover/row:opacity-100 transition-all duration-300 shadow-2xl hover:scale-110 hover:bg-primary/20 border-2 border-primary/40"
            onClick={() => scroll('left')}
          >
            <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-primary" />
          </Button>
        )}

        {/* Movies Container */}
        <div 
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex gap-2 sm:gap-3 lg:gap-4 overflow-x-auto scrollbar-hide px-2 sm:px-4 lg:px-8 pb-4 sm:pb-5 snap-x snap-mandatory scroll-smooth"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {movies.map((movie, index) => (
            <div
              key={`${movie.title}-${index}`}
              className="flex-shrink-0 w-32 sm:w-40 md:w-48 lg:w-56 snap-start cursor-pointer group/card transition-all duration-300 hover:scale-110 hover:z-10"
              onClick={() => onMovieClick(movie)}
            >
              <div className="relative aspect-[2/3] rounded-lg overflow-hidden shadow-xl group-hover/card:shadow-2xl transition-all duration-300 group-hover/card:ring-4 group-hover/card:ring-primary/60">
                <img 
                  src={movie.thumbnail}
                  alt={movie.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover/card:scale-110"
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.src = "https://via.placeholder.com/300x450/e5e7eb/6b7280?text=Movie";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-0 group-hover/card:opacity-100 transition-all duration-300 flex items-center justify-center">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-full bg-white/95 flex items-center justify-center shadow-2xl scale-0 group-hover/card:scale-100 transition-all duration-300 animate-pulse">
                    <Play className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-black fill-black ml-1" />
                  </div>
                </div>
              </div>
              <h3 className="text-xs sm:text-sm lg:text-base font-semibold text-foreground mt-2 sm:mt-3 line-clamp-2 px-1 leading-snug group-hover/card:text-primary transition-colors">
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
            className="absolute right-2 sm:right-4 lg:right-6 top-1/2 -translate-y-1/2 z-10 h-12 w-12 sm:h-14 sm:w-14 lg:h-16 lg:w-16 rounded-full bg-background/95 backdrop-blur-md opacity-0 group-hover/row:opacity-100 transition-all duration-300 shadow-2xl hover:scale-110 hover:bg-primary/20 border-2 border-primary/40"
            onClick={() => scroll('right')}
          >
            <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-primary" />
          </Button>
        )}
      </div>
      )}
    </div>
  );
});
