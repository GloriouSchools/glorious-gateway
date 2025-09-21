import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { AnimatedCard } from "@/components/ui/animated-card";
import { useAuth } from "@/hooks/useAuth";
import { 
  BookOpen, 
  Search, 
  Filter,
  Star,
  Clock,
  Eye,
  Download,
  Heart,
  Users,
  Calendar,
  Award,
  Zap,
  Sparkles,
  Trophy,
  Target,
  CheckCircle,
  BookmarkPlus,
  Play,
  Headphones,
  Image,
  FileText,
  Video
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Book {
  id: string;
  title: string;
  author: string;
  cover?: string;
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  pages: number;
  rating: number;
  reads: number;
  description: string;
  isAvailable: boolean;
  type: 'book' | 'audiobook' | 'interactive';
  tags: string[];
  dateAdded: string;
  isPopular: boolean;
  isNew: boolean;
}

interface ReadingChallenge {
  id: string;
  title: string;
  description: string;
  target: number;
  current: number;
  reward: string;
  endDate: string;
  participants: number;
  color: string;
}

// Mock library data
const mockBooks: Book[] = [
  {
    id: 'B001',
    title: 'The Magic School Adventures',
    author: 'Sarah Wonder',
    cover: null,
    category: 'adventure',
    level: 'beginner',
    pages: 120,
    rating: 4.8,
    reads: 234,
    description: 'Join Emma and her friends on magical adventures through their enchanted school! 🏫✨',
    isAvailable: true,
    type: 'book',
    tags: ['magic', 'friendship', 'school'],
    dateAdded: '2024-01-15',
    isPopular: true,
    isNew: false
  },
  {
    id: 'B002',
    title: 'Space Explorers Club',
    author: 'Dr. Rocket Smith',
    cover: null,
    category: 'science',
    level: 'intermediate',
    pages: 156,
    rating: 4.9,
    reads: 189,
    description: 'Blast off to amazing planets and discover the wonders of space! 🚀🌟',
    isAvailable: true,
    type: 'interactive',
    tags: ['space', 'science', 'exploration'],
    dateAdded: '2024-01-20',
    isPopular: true,
    isNew: true
  },
  {
    id: 'B003',
    title: 'Friendship Forest Tales',
    author: 'Luna Storyteller',
    cover: null,
    category: 'fantasy',
    level: 'beginner',
    pages: 98,
    rating: 4.7,
    reads: 298,
    description: 'Meet talking animals and learn about kindness in this heartwarming forest! 🦊🌳',
    isAvailable: false,
    type: 'audiobook',
    tags: ['animals', 'friendship', 'nature'],
    dateAdded: '2024-01-10',
    isPopular: true,
    isNew: false
  },
  {
    id: 'B004',
    title: 'Young Scientists Handbook',
    author: 'Professor Curious',
    cover: null,
    category: 'science',
    level: 'intermediate',
    pages: 200,
    rating: 4.6,
    reads: 145,
    description: 'Fun experiments and amazing discoveries await young scientists! 🧪⚗️',
    isAvailable: true,
    type: 'book',
    tags: ['experiments', 'learning', 'fun'],
    dateAdded: '2024-01-25',
    isPopular: false,
    isNew: true
  },
  {
    id: 'B005',
    title: 'Art & Creativity Corner',
    author: 'Miss Rainbow',
    cover: null,
    category: 'arts',
    level: 'beginner',
    pages: 80,
    rating: 4.5,
    reads: 167,
    description: 'Unleash your creativity with colors, shapes, and amazing art projects! 🎨🖌️',
    isAvailable: true,
    type: 'interactive',
    tags: ['art', 'creativity', 'projects'],
    dateAdded: '2024-01-18',
    isPopular: false,
    isNew: false
  },
  {
    id: 'B006',
    title: 'Math Magic Kingdom',
    author: 'Count Numbers',
    cover: null,
    category: 'mathematics',
    level: 'intermediate',
    pages: 134,
    rating: 4.4,
    reads: 123,
    description: 'Make math fun with magical numbers and exciting problem-solving adventures! 🔢✨',
    isAvailable: true,
    type: 'book',
    tags: ['math', 'problem-solving', 'games'],
    dateAdded: '2024-01-22',
    isPopular: false,
    isNew: true
  }
];

const mockChallenges: ReadingChallenge[] = [
  {
    id: 'C001',
    title: '📚 Summer Reading Champion',
    description: 'Read 10 books this summer and become a reading superhero!',
    target: 10,
    current: 7,
    reward: '🏆 Golden Reading Badge + Special Certificate',
    endDate: '2024-08-31',
    participants: 156,
    color: 'from-yellow-400 to-orange-400'
  },
  {
    id: 'C002',
    title: '🌟 Science Explorer Challenge',
    description: 'Discover 5 science books and unlock the mysteries of the universe!',
    target: 5,
    current: 3,
    reward: '🔬 Junior Scientist Badge + Lab Kit',
    endDate: '2024-07-15',
    participants: 89,
    color: 'from-blue-400 to-purple-400'
  },
  {
    id: 'C003',
    title: '🎨 Creative Stories Quest',
    description: 'Read 8 creative and fantasy books to spark your imagination!',
    target: 8,
    current: 5,
    reward: '🎭 Imagination Master Badge + Art Supplies',
    endDate: '2024-09-30',
    participants: 112,
    color: 'from-pink-400 to-purple-400'
  }
];

const categories = [
  { id: 'all', name: 'All Books', icon: BookOpen, color: 'from-purple-400 to-pink-400' },
  { id: 'adventure', name: 'Adventure', icon: Zap, color: 'from-red-400 to-orange-400' },
  { id: 'science', name: 'Science & Discovery', icon: Target, color: 'from-blue-400 to-cyan-400' },
  { id: 'fantasy', name: 'Fantasy & Magic', icon: Sparkles, color: 'from-purple-400 to-pink-400' },
  { id: 'arts', name: 'Arts & Creativity', icon: Heart, color: 'from-pink-400 to-rose-400' },
  { id: 'mathematics', name: 'Math & Logic', icon: Trophy, color: 'from-green-400 to-emerald-400' }
];

const Library = () => {
  const { userRole, userName, photoUrl, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState("books");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterLevel, setFilterLevel] = useState("all");
  const [filterType, setFilterType] = useState("all");

  const filteredBooks = useMemo(() => {
    return mockBooks.filter(book => {
      const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           book.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           book.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCategory = filterCategory === "all" || book.category === filterCategory;
      const matchesLevel = filterLevel === "all" || book.level === filterLevel;
      const matchesType = filterType === "all" || book.type === filterType;
      
      return matchesSearch && matchesCategory && matchesLevel && matchesType;
    });
  }, [searchTerm, filterCategory, filterLevel, filterType]);

  const availableBooks = mockBooks.filter(b => b.isAvailable).length;
  const totalReads = mockBooks.reduce((sum, book) => sum + book.reads, 0);
  const activeChallenges = mockChallenges.length;

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300';
      case 'intermediate': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300';
      case 'advanced': return 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'audiobook': return <Headphones className="h-4 w-4" />;
      case 'interactive': return <Play className="h-4 w-4" />;
      default: return <BookOpen className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'audiobook': return 'from-purple-400 to-indigo-400';
      case 'interactive': return 'from-green-400 to-teal-400';
      default: return 'from-blue-400 to-cyan-400';
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Failed to logout:", error);
    }
  };

  if (!userRole) return null;

  return (
    <DashboardLayout 
      userRole={userRole} 
      userName={userName || "Student"}
      photoUrl={photoUrl}
      onLogout={handleLogout}
    >
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center items-center gap-2">
            <BookOpen className="h-16 w-16 text-blue-400 animate-pulse" />
            <Star className="h-8 w-8 text-yellow-400 animate-bounce" />
            <Sparkles className="h-12 w-12 text-pink-400 animate-pulse" style={{ animationDelay: '0.2s' }} />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-600 bg-clip-text text-transparent animate-scale-in">
            📚 School Library 📚
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Welcome to our magical library! Discover amazing stories, learn new things, 
            and join exciting reading adventures! 🌟📖
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <AnimatedCard hoverAnimation="bounce" className="text-center">
            <CardContent className="p-6">
              <div className="bg-gradient-to-r from-blue-400 to-purple-400 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-blue-500">{mockBooks.length}</h3>
              <p className="text-muted-foreground">Total Books</p>
            </CardContent>
          </AnimatedCard>
          
          <AnimatedCard hoverAnimation="bounce" delay={100} className="text-center">
            <CardContent className="p-6">
              <div className="bg-gradient-to-r from-green-400 to-emerald-400 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-green-500">{availableBooks}</h3>
              <p className="text-muted-foreground">Available</p>
            </CardContent>
          </AnimatedCard>
          
          <AnimatedCard hoverAnimation="bounce" delay={200} className="text-center">
            <CardContent className="p-6">
              <div className="bg-gradient-to-r from-yellow-400 to-orange-400 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <Eye className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-yellow-500">{totalReads}</h3>
              <p className="text-muted-foreground">Total Reads</p>
            </CardContent>
          </AnimatedCard>
          
          <AnimatedCard hoverAnimation="bounce" delay={300} className="text-center">
            <CardContent className="p-6">
              <div className="bg-gradient-to-r from-pink-400 to-red-400 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <Award className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-pink-500">{activeChallenges}</h3>
              <p className="text-muted-foreground">Challenges</p>
            </CardContent>
          </AnimatedCard>
        </div>

        {/* Category Overview */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((category, index) => {
            const count = category.id === 'all' 
              ? mockBooks.length 
              : mockBooks.filter(b => b.category === category.id).length;
            
            return (
              <AnimatedCard 
                key={category.id} 
                hoverAnimation="bounce"
                delay={index * 100}
                className={`cursor-pointer transition-all duration-300 ${
                  filterCategory === category.id 
                    ? 'ring-2 ring-primary ring-offset-2 scale-105' 
                    : 'hover:scale-105'
                }`}
                onClick={() => setFilterCategory(category.id)}
              >
                <CardContent className="p-4 text-center">
                  <div className={`mx-auto w-12 h-12 rounded-full bg-gradient-to-r ${category.color} flex items-center justify-center mb-3`}>
                    <category.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-sm mb-1">{category.name}</h3>
                  <Badge variant="secondary" className="text-xs">
                    {count} books
                  </Badge>
                </CardContent>
              </AnimatedCard>
            );
          })}
        </div>

        {/* Main Library Interface */}
        <Card className="overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30">
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              Library Collection 📚
            </CardTitle>
            <CardDescription>
              Discover, read, and grow with our amazing collection of books and challenges!
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <div className="border-b p-4">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="books" className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    Books & Stories
                  </TabsTrigger>
                  <TabsTrigger value="challenges" className="flex items-center gap-2">
                    <Trophy className="h-4 w-4" />
                    Reading Challenges
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="books" className="p-6 space-y-4">
                {/* Search and Filters */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                      placeholder="Search books... 🔍"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={filterLevel} onValueChange={setFilterLevel}>
                    <SelectTrigger>
                      <SelectValue placeholder="All levels" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Levels</SelectItem>
                      <SelectItem value="beginner">🟢 Beginner</SelectItem>
                      <SelectItem value="intermediate">🟡 Intermediate</SelectItem>
                      <SelectItem value="advanced">🔴 Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger>
                      <SelectValue placeholder="All types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="book">📖 Regular Books</SelectItem>
                      <SelectItem value="audiobook">🎧 Audiobooks</SelectItem>
                      <SelectItem value="interactive">🎮 Interactive</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline">
                    <Filter className="h-4 w-4 mr-2" />
                    More Filters
                  </Button>
                </div>

                {/* Books Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredBooks.length === 0 ? (
                    <div className="col-span-full text-center py-12 text-muted-foreground">
                      <BookOpen className="h-16 w-16 mx-auto mb-4 opacity-50" />
                      <p className="text-lg">No books found</p>
                      <p className="text-sm">Try adjusting your search or filters!</p>
                    </div>
                  ) : (
                    filteredBooks.map((book, index) => (
                      <AnimatedCard
                        key={book.id}
                        hoverAnimation="float"
                        delay={index * 100}
                        className="overflow-hidden cursor-pointer group"
                      >
                        {/* Book Cover */}
                        <div className={`aspect-[3/4] bg-gradient-to-br ${getTypeColor(book.type)} relative`}>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <BookOpen className="h-16 w-16 text-white/80" />
                          </div>
                          <div className="absolute top-2 left-2">
                            {book.isNew && (
                              <Badge className="bg-green-500 text-white text-xs">NEW!</Badge>
                            )}
                          </div>
                          <div className="absolute top-2 right-2">
                            <div className={`bg-gradient-to-r ${getTypeColor(book.type)} rounded-full p-2`}>
                              {getTypeIcon(book.type)}
                            </div>
                          </div>
                          <div className="absolute bottom-2 left-2 right-2">
                            <div className="flex justify-between items-center">
                              <Badge className="bg-black/50 text-white text-xs">
                                {book.pages} pages
                              </Badge>
                              {book.isPopular && (
                                <Badge className="bg-yellow-500 text-white text-xs">
                                  <Star className="h-3 w-3 mr-1" />
                                  Popular
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Book Info */}
                        <CardContent className="p-4">
                          <div className="space-y-3">
                            <div>
                              <h3 className="font-bold text-lg line-clamp-2 group-hover:text-primary transition-colors">
                                {book.title}
                              </h3>
                              <p className="text-sm text-muted-foreground">by {book.author}</p>
                            </div>
                            
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {book.description}
                            </p>

                            <div className="flex flex-wrap gap-2">
                              <Badge className={getLevelColor(book.level)}>
                                {book.level}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                ⭐ {book.rating}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                👀 {book.reads} reads
                              </Badge>
                            </div>

                            <div className="flex flex-wrap gap-1">
                              {book.tags.slice(0, 3).map((tag) => (
                                <Badge key={tag} variant="secondary" className="text-xs">
                                  #{tag}
                                </Badge>
                              ))}
                            </div>

                            <div className="flex gap-2 pt-2">
                              <Button 
                                className="flex-1" 
                                disabled={!book.isAvailable}
                                variant={book.isAvailable ? "default" : "secondary"}
                              >
                                {book.isAvailable ? (
                                  <>
                                    <Eye className="h-4 w-4 mr-2" />
                                    Read Now
                                  </>
                                ) : (
                                  <>
                                    <Clock className="h-4 w-4 mr-2" />
                                    Reserved
                                  </>
                                )}
                              </Button>
                              <Button variant="ghost" size="sm">
                                <BookmarkPlus className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </AnimatedCard>
                    ))
                  )}
                </div>
              </TabsContent>

              <TabsContent value="challenges" className="p-6 space-y-6">
                <div className="text-center mb-6">
                  <h3 className="text-lg font-semibold mb-2">Reading Challenges 🏆</h3>
                  <p className="text-muted-foreground">Join fun challenges and earn amazing rewards!</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {mockChallenges.map((challenge, index) => (
                    <AnimatedCard
                      key={challenge.id}
                      hoverAnimation="bounce"
                      delay={index * 150}
                      className="overflow-hidden"
                    >
                      <div className={`h-4 bg-gradient-to-r ${challenge.color}`} />
                      <CardContent className="p-6">
                        <div className="space-y-4">
                          <div className="text-center">
                            <h3 className="text-lg font-bold mb-2">{challenge.title}</h3>
                            <p className="text-sm text-muted-foreground mb-4">
                              {challenge.description}
                            </p>
                          </div>

                          {/* Progress Bar */}
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Progress</span>
                              <span>{challenge.current}/{challenge.target}</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-3">
                              <div 
                                className={`bg-gradient-to-r ${challenge.color} h-3 rounded-full transition-all duration-300`}
                                style={{ width: `${(challenge.current / challenge.target) * 100}%` }}
                              />
                            </div>
                            <div className="text-center text-sm text-muted-foreground">
                              {Math.round((challenge.current / challenge.target) * 100)}% Complete
                            </div>
                          </div>

                          <div className="space-y-3">
                            <div className="bg-yellow-50 dark:bg-yellow-950/30 rounded-lg p-3">
                              <div className="flex items-center gap-2 mb-1">
                                <Trophy className="h-4 w-4 text-yellow-600" />
                                <span className="text-sm font-medium text-yellow-700 dark:text-yellow-300">Reward</span>
                              </div>
                              <p className="text-sm text-yellow-600 dark:text-yellow-400">
                                {challenge.reward}
                              </p>
                            </div>

                            <div className="flex justify-between items-center text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                Ends {challenge.endDate}
                              </span>
                              <span className="flex items-center gap-1">
                                <Users className="h-4 w-4" />
                                {challenge.participants} joined
                              </span>
                            </div>

                            <Button className={`w-full bg-gradient-to-r ${challenge.color} text-white`}>
                              <Award className="h-4 w-4 mr-2" />
                              Join Challenge
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </AnimatedCard>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Inspirational Footer */}
        <Card className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-500 text-white overflow-hidden">
          <CardContent className="p-8 text-center relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-pink-600/20" />
            <div className="relative z-10">
              <BookOpen className="h-12 w-12 mx-auto mb-4 animate-bounce" />
              <h3 className="text-2xl font-bold mb-2">Reading Opens New Worlds! 🌟</h3>
              <p className="text-lg opacity-90">
                Every book is a new adventure waiting to be discovered. 
                Keep reading, keep dreaming, and keep growing! 📚✨
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Library;