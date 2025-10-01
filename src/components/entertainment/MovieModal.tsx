import { Movie } from "@/types/movie";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface MovieModalProps {
  movie: Movie | null;
  open: boolean;
  onClose: () => void;
}

export function MovieModal({ movie, open, onClose }: MovieModalProps) {
  if (!movie) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-[95vw] max-h-[90vh] p-0 overflow-y-auto rounded-3xl">
        <DialogHeader className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground p-6">
          <DialogTitle className="text-xl md:text-2xl font-bold pr-10 leading-relaxed">
            🎬 {movie.title}
          </DialogTitle>
          <p className="text-primary-foreground/80 text-base mt-2">
            {movie.year} • {movie.genres.join(", ")}
          </p>
        </DialogHeader>
        
        <div className="relative w-full pt-[56.25%] bg-black">
          <video 
            className="absolute top-0 left-0 w-full h-full"
            controls 
            autoPlay
            poster={movie.thumbnail}
          >
            <source src={movie.href} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
        
        <div className="p-6 space-y-4">
          {movie.cast && movie.cast.length > 0 && (
            <div>
              <h4 className="font-bold text-lg mb-2">⭐ Cast</h4>
              <p className="text-muted-foreground">{movie.cast.join(", ")}</p>
            </div>
          )}
          
          <div>
            <h4 className="font-bold text-lg mb-2">📖 Story</h4>
            <p className="text-muted-foreground leading-relaxed">{movie.extract}</p>
          </div>
        </div>
        
        <div className="p-6 bg-gradient-to-b from-background to-muted/20">
          <p className="text-center text-lg text-muted-foreground font-medium">
            🍿 Enjoy the movie! Click outside to close
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
