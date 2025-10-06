// Utility for fetching movie thumbnails from GitHub with 24-hour caching

const GITHUB_REPO = 'Fresh-Teacher/glorious-gateway-65056-78561-35497';
const GITHUB_FOLDER = 'src/assets/thumbnails';
const GITHUB_API_URL = `https://api.github.com/repos/${GITHUB_REPO}/contents/${GITHUB_FOLDER}`;
const CACHE_KEY = 'github-movie-thumbnails';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

interface GitHubFile {
  name: string;
  download_url: string | null;
  type: string;
}

interface CachedThumbnails {
  thumbnails: Record<string, string>;
  timestamp: number;
}

// Fetch all thumbnails from GitHub API
const fetchThumbnailsFromGitHub = async (): Promise<Record<string, string>> => {
  const thumbnails: Record<string, string> = {};
  
  try {
    const response = await fetch(GITHUB_API_URL);
    
    if (!response.ok) {
      console.error(`GitHub API error: ${response.status}`);
      return thumbnails;
    }
    
    const files: GitHubFile[] = await response.json();
    
    files.forEach(file => {
      if (file.type === 'file' && /\.(jpg|jpeg|png|gif|webp)$/i.test(file.name)) {
        if (file.download_url) {
          thumbnails[file.name] = file.download_url;
        }
      }
    });
  } catch (error) {
    console.error('Error fetching thumbnails from GitHub:', error);
  }
  
  return thumbnails;
};

// Get all thumbnails with caching
export const getMovieThumbnails = async (): Promise<Record<string, string>> => {
  // Check cache first
  const cached = localStorage.getItem(CACHE_KEY);
  if (cached) {
    try {
      const { thumbnails, timestamp }: CachedThumbnails = JSON.parse(cached);
      if (Date.now() - timestamp < CACHE_DURATION) {
        return thumbnails;
      }
    } catch (error) {
      console.error('Error parsing cached thumbnails:', error);
    }
  }

  // Fetch from GitHub API
  const thumbnails = await fetchThumbnailsFromGitHub();
  
  // Cache the results
  const cacheData: CachedThumbnails = {
    thumbnails,
    timestamp: Date.now()
  };
  localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));

  return thumbnails;
};

// Get thumbnail URL by filename
export const getThumbnailUrl = async (filename: string): Promise<string> => {
  const thumbnails = await getMovieThumbnails();
  return thumbnails[filename] || `https://via.placeholder.com/300x450/1a1a1a/ffffff?text=Movie+Poster`;
};

// Extract filename from old thumbnail path
export const extractThumbnailFilename = (thumbnailPath: string): string => {
  // Extract filename from paths like:
  // "https://gloriouschools.github.io/glorious-gateway/src/assets/thumbnails/Dr_dolittle_two_ver2.jpg"
  // "/assets/thumbnails/Dr_dolittle_two_ver2.jpg"
  // "thumbnails/Dr_dolittle_two_ver2.jpg"
  const parts = thumbnailPath.split('/');
  return parts[parts.length - 1];
};
