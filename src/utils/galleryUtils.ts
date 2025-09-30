// Utility for managing photo gallery with nested folder structure

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

// Get all images from all folders recursively
const getAllImagesRecursive = () => {
  const images = import.meta.glob('/src/assets/Gallery/**/*.{jpg,jpeg,png,webp}', { 
    eager: true, 
    as: 'url' 
  });
  return images;
};

// Extract folder structure from image paths
export const buildFolderStructure = (): FolderStructure => {
  const images = getAllImagesRecursive();
  const paths = Object.keys(images);
  
  // Build a tree structure
  const root: FolderStructure = {
    name: 'All Quotes',
    path: '',
    count: 0,
    subfolders: []
  };

  const folderMap = new Map<string, FolderStructure>();
  folderMap.set('', root);

  paths.forEach(path => {
    // Extract folder path (remove /src/assets/Gallery/ prefix and filename)
    const relativePath = path.replace('/src/assets/Gallery/', '');
    const parts = relativePath.split('/');
    parts.pop(); // Remove filename
    
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
      label: `All Quotes (${structure.count})`,
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
export const getPhotos = (folderFilter: string = 'all'): PhotoItem[] => {
  const images = getAllImagesRecursive();
  
  return Object.entries(images)
    .filter(([path]) => {
      if (!folderFilter || folderFilter === 'all') return true;
      const relativePath = path.replace('/src/assets/Gallery/', '');
      return relativePath.startsWith(folderFilter + '/');
    })
    .map(([path, url], index) => {
      const relativePath = path.replace('/src/assets/Gallery/', '');
      const parts = relativePath.split('/');
      const filename = parts.pop() || '';
      const folderPath = parts.join('/');
      const folder = parts[parts.length - 1] || 'Root';
      
      return {
        id: `photo-${index}-${filename}`,
        src: url as string,
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
