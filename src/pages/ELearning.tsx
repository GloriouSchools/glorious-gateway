import { useState, useMemo } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { VideoCard } from "@/components/elearning/VideoCard";
import { VideoModal } from "@/components/elearning/VideoModal";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Video } from "@/types/video";
import { videoData, curriculum } from "@/data/videoData";
import { Search, Shuffle, BookOpen, FlaskConical, Pencil, Globe, Church, Palette, ChevronLeft, ChevronRight } from "lucide-react";

const subjectIcons: Record<string, any> = {
  "Maths": BookOpen,
  "Science": FlaskConical,
  "English": Pencil,
  "Social Studies": Globe,
  "Religious Education": Church,
  "Art & Craft": Palette
};

const ELearning = () => {
  const { userRole, userName, photoUrl, signOut } = useAuth();
  const navigate = useNavigate();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClass, setSelectedClass] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedTopic, setSelectedTopic] = useState("all");
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
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

  // Get unique classes, categories, and topics
  const classes = ["all", ...Object.keys(curriculum)];
  const categories = useMemo(() => {
    if (selectedClass === "all") return ["all"];
    return ["all", ...Object.keys(curriculum[selectedClass] || {})];
  }, [selectedClass]);
  
  const topics = useMemo(() => {
    if (selectedClass === "all" || selectedCategory === "all") return ["all"];
    return ["all", ...(curriculum[selectedClass]?.[selectedCategory] || [])];
  }, [selectedClass, selectedCategory]);

  // Filter videos
  const filteredVideos = useMemo(() => {
    let filtered = [...videoData];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(video =>
        video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        video.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        video.topic.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Class filter
    if (selectedClass !== "all") {
      filtered = filtered.filter(video => video.class === selectedClass);
    }

    // Category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter(video => video.category === selectedCategory);
    }

    // Topic filter
    if (selectedTopic !== "all") {
      filtered = filtered.filter(video => video.topic === selectedTopic);
    }

    return filtered;
  }, [searchQuery, selectedClass, selectedCategory, selectedTopic]);

  // Pagination
  const totalPages = Math.ceil(filteredVideos.length / itemsPerPage);
  const paginatedVideos = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredVideos.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredVideos, currentPage, itemsPerPage]);

  // Reset to first page when filters change
  useMemo(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedClass, selectedCategory, selectedTopic, itemsPerPage]);

  const handleVideoClick = (video: Video) => {
    setSelectedVideo(video);
    setIsModalOpen(true);
  };

  const handleShuffle = () => {
    const shuffled = [...videoData].sort(() => Math.random() - 0.5);
    // You could implement state for shuffled videos if needed
    toast.success("Videos shuffled!");
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
          <h1 className="text-5xl md:text-6xl font-bold gradient-text">🎥 Learning Videos 📹</h1>
          <p className="text-lg md:text-xl text-muted-foreground font-medium">Watch fun videos and learn amazing things!</p>
        </div>

        {/* Search Bar - Larger and More Prominent */}
        <div className="max-w-3xl mx-auto">
          <div className="relative">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-6 w-6 text-muted-foreground" />
            <Input
              type="text"
              placeholder="🔍 What do you want to learn today?"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-14 pr-4 h-16 text-lg rounded-2xl border-2 focus:border-primary shadow-lg"
            />
          </div>
        </div>

        {/* Filters - Simplified with Visual Icons */}
        <div className="max-w-5xl mx-auto space-y-4">
          <p className="text-center text-lg font-semibold text-foreground mb-4">Filter by:</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select value={selectedClass} onValueChange={setSelectedClass}>
              <SelectTrigger className="h-14 text-lg rounded-xl border-2 shadow-md">
                <SelectValue placeholder="📚 Choose Your Class" />
              </SelectTrigger>
              <SelectContent className="text-base">
                {classes.map(cls => (
                  <SelectItem key={cls} value={cls} className="text-base py-3">
                    {cls === "all" ? "📚 All Classes" : `📖 ${cls}`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select 
              value={selectedCategory} 
              onValueChange={setSelectedCategory}
              disabled={selectedClass === "all"}
            >
              <SelectTrigger className="h-14 text-lg rounded-xl border-2 shadow-md">
                <SelectValue placeholder="🎨 Pick a Subject" />
              </SelectTrigger>
              <SelectContent className="text-base">
                {categories.map(cat => {
                  const Icon = subjectIcons[cat];
                  return (
                    <SelectItem key={cat} value={cat} className="text-base py-3">
                      <div className="flex items-center gap-2">
                        {Icon && <Icon className="w-4 h-4" />}
                        {cat === "all" ? "🎨 All Subjects" : cat}
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>

            <Select 
              value={selectedTopic} 
              onValueChange={setSelectedTopic}
              disabled={selectedCategory === "all"}
            >
              <SelectTrigger className="h-14 text-lg rounded-xl border-2 shadow-md">
                <SelectValue placeholder="✨ Select a Topic" />
              </SelectTrigger>
              <SelectContent className="text-base">
                {topics.map(topic => (
                  <SelectItem key={topic} value={topic} className="text-base py-3">
                    {topic === "all" ? "✨ All Topics" : `⭐ ${topic}`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* Clear Filters Button */}
          {(selectedClass !== "all" || selectedCategory !== "all" || selectedTopic !== "all" || searchQuery) && (
            <div className="text-center">
              <Button 
                onClick={() => {
                  setSelectedClass("all");
                  setSelectedCategory("all");
                  setSelectedTopic("all");
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

        {/* Results count with emoji */}
        {(searchQuery || selectedClass !== "all" || selectedCategory !== "all") && (
          <div className="text-center">
            <div className="inline-block bg-primary/10 px-6 py-3 rounded-full border-2 border-primary/20">
              <p className="text-lg font-bold text-primary">
                🎉 Found {filteredVideos.length} awesome video{filteredVideos.length !== 1 ? 's' : ''} for you!
              </p>
            </div>
          </div>
        )}

        {/* Video Grid - More Spacious */}
        {paginatedVideos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 pb-8">
            {paginatedVideos.map((video, index) => (
              <VideoCard 
                key={`${video.src}-${index}`}
                video={video}
                onClick={() => handleVideoClick(video)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-gradient-to-br from-card to-card/50 rounded-3xl border-2 border-dashed border-border shadow-lg">
            <div className="text-6xl mb-4">😕</div>
            <p className="text-2xl font-bold text-card-foreground mb-2">Oops! No videos found</p>
            <p className="text-lg text-muted-foreground mb-6">Try searching for something else or change your filters</p>
            <Button 
              onClick={() => {
                setSelectedClass("all");
                setSelectedCategory("all");
                setSelectedTopic("all");
                setSearchQuery("");
              }}
              size="lg"
              className="rounded-xl px-8 h-12 text-base font-semibold"
            >
              🔄 Show All Videos
            </Button>
          </div>
        )}

        {/* Pagination - Larger and More Visual */}
        {filteredVideos.length > 0 && totalPages > 1 && (
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
                <SelectItem value="12" className="text-base py-3">📺 Show 12 videos</SelectItem>
                <SelectItem value="24" className="text-base py-3">📺 Show 24 videos</SelectItem>
                <SelectItem value="48" className="text-base py-3">📺 Show 48 videos</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Video Modal */}
        <VideoModal 
          video={selectedVideo}
          open={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedVideo(null);
          }}
        />
      </div>
    </DashboardLayout>
  );
};

export default ELearning;
