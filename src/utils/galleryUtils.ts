// Utility for managing photo gallery with nested folder structure from GitHub

export interface PhotoItem {
  id: string;
  src: string;
  alt: string;
  folder: string;
  folderPath: string;
  category: string;
}

export interface FolderStructure {
  name: string;
  path: string;
  count: number;
  subfolders?: FolderStructure[];
}

// GitHub repository configuration
const GITHUB_REPO = 'Fresh-Teacher/glorious-gateway-65056-78561-35497';
const GITHUB_FOLDER = 'src/assets/Gallery';
const GITHUB_API_URL = `https://api.github.com/repos/${GITHUB_REPO}/contents/${GITHUB_FOLDER}`;
const CACHE_KEY = 'github-gallery-images';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

interface GitHubFile {
  name: string;
  path: string;
  download_url: string | null;
  type: 'file' | 'dir';
  url: string;
}

interface CachedGalleryData {
  images: Record<string, string>;
  timestamp: number;
}

// Recursively fetch all images from GitHub API
const fetchGitHubFolder = async (path: string): Promise<Record<string, string>> => {
  const images: Record<string, string> = {};
  
  try {
    const url = `https://api.github.com/repos/${GITHUB_REPO}/contents/${path}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      console.error(`GitHub API error for ${path}: ${response.status}`);
      return images;
    }
    
    const files: GitHubFile[] = await response.json();
    
    // Process all items in parallel
    const promises = files.map(async (file) => {
      if (file.type === 'dir') {
        // Recursively fetch subdirectory
        const subImages = await fetchGitHubFolder(file.path);
        Object.assign(images, subImages);
      } else if (file.type === 'file' && /\.(jpg|jpeg|png|gif|webp)$/i.test(file.name)) {
        // Add image file
        if (file.download_url) {
          const relativePath = file.path.replace(`${GITHUB_FOLDER}/`, '');
          images[relativePath] = file.download_url;
        }
      }
    });
    
    await Promise.all(promises);
  } catch (error) {
    console.error(`Error fetching GitHub folder ${path}:`, error);
  }
  
  return images;
};

// Get all images from all folders recursively
const getAllImagesRecursive = async (): Promise<Record<string, string>> => {
  // Check cache first
  const cached = localStorage.getItem(CACHE_KEY);
  if (cached) {
    try {
      const { images, timestamp }: CachedGalleryData = JSON.parse(cached);
      if (Date.now() - timestamp < CACHE_DURATION) {
        return images;
      }
    } catch (error) {
      console.error('Error parsing cached gallery data:', error);
    }
  }

  // Fetch from GitHub API
  const images = await fetchGitHubFolder(GITHUB_FOLDER);
  
  // Cache the results
  const cacheData: CachedGalleryData = {
    images,
    timestamp: Date.now()
  };
  localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));

  return images;
};

// Extract folder structure from image paths
export const buildFolderStructure = async (): Promise<FolderStructure> => {
  const images = await getAllImagesRecursive();
  const paths = Object.keys(images);
  
  // Build a tree structure
  const root: FolderStructure = {
    name: 'All Photos',
    path: '',
    count: 0,
    subfolders: []
  };

  const folderMap = new Map<string, FolderStructure>();
  folderMap.set('', root);

  paths.forEach(path => {
    const parts = path.split('/');
    parts.pop(); // Remove filename
    
    if (parts.length === 0) return;
    
    let currentPath = '';
    let parentFolder = root;

    parts.forEach((part, index) => {
      const previousPath = currentPath;
      currentPath = currentPath ? `${currentPath}/${part}` : part;
      
      if (!folderMap.has(currentPath)) {
        const newFolder: FolderStructure = {
          name: part,
          path: currentPath,
          count: 0,
          subfolders: []
        };
        
        folderMap.set(currentPath, newFolder);
        
        if (parentFolder.subfolders) {
          parentFolder.subfolders.push(newFolder);
        }
      }
      
      parentFolder = folderMap.get(currentPath)!;
    });
    
    // Increment count for all parent folders
    let pathToIncrement = '';
    parts.forEach((part, index) => {
      pathToIncrement = pathToIncrement ? `${pathToIncrement}/${part}` : part;
      const folder = folderMap.get(pathToIncrement);
      if (folder) {
        folder.count++;
      }
    });
    root.count++;
  });

  return root;
};

// Get all folder paths in a flat list for dropdown
export const getFlatFolderList = (structure: FolderStructure, level = 0): Array<{label: string, value: string, count: number}> => {
  const result: Array<{label: string, value: string, count: number}> = [];
  
  if (level === 0) {
    result.push({
      label: `All Photos (${structure.count})`,
      value: 'all',
      count: structure.count
    });
  }
  
  if (structure.subfolders) {
    structure.subfolders.forEach(subfolder => {
      const indent = '  '.repeat(level);
      result.push({
        label: `${indent}${subfolder.name} (${subfolder.count})`,
        value: subfolder.path,
        count: subfolder.count
      });
      
      if (subfolder.subfolders && subfolder.subfolders.length > 0) {
        result.push(...getFlatFolderList(subfolder, level + 1));
      }
    });
  }
  
  return result;
};

// Get all photos, optionally filtered by folder
export const getPhotos = async (folderFilter: string = 'all'): Promise<PhotoItem[]> => {
  const images = await getAllImagesRecursive();
  
  return Object.entries(images)
    .filter(([path]) => {
      if (!folderFilter || folderFilter === 'all') return true;
      return path.startsWith(folderFilter + '/');
    })
    .map(([path, url], index) => {
      const parts = path.split('/');
      const filename = parts.pop() || '';
      const folderPath = parts.join('/');
      const folder = parts[parts.length - 1] || 'Root';
      
      return {
        id: `photo-${index}-${filename}`,
        src: url,
        alt: filename.replace(/\.(jpg|jpeg|png|webp)$/, '').replace(/-|_/g, ' '),
        folder,
        folderPath,
        category: parts[0] || 'General'
      };
    });
};

// Shuffle array for random display
export const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};
