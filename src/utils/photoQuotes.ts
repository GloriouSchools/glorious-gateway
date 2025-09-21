// Utility to handle photo quotes from the src/assets/Quotations folder
export interface PhotoQuote {
  src: string;
  alt: string;
}

// Get all quote images using Vite's import.meta.glob
const getQuoteImages = () => {
  // Use Vite's import.meta.glob to dynamically import all images
  const images = import.meta.glob('/src/assets/Quotations/*.jpg', { eager: true, as: 'url' });
  return Object.values(images) as string[];
};

// Get the quote of the day (persistent across sessions)
export const getQuoteOfTheDay = (): PhotoQuote => {
  const images = getQuoteImages();
  
  if (images.length === 0) {
    // Fallback if no images found
    return {
      src: '/placeholder.svg',
      alt: 'No quote available'
    };
  }

  // Check if we have a stored quote for today
  const today = new Date().toDateString();
  const storedQuote = localStorage.getItem('quote-of-the-day');
  const storedDate = localStorage.getItem('quote-date');

  if (storedQuote && storedDate === today) {
    try {
      return JSON.parse(storedQuote);
    } catch {
      // If parsing fails, fall through to generate new quote
    }
  }

  // Generate new quote for today
  const randomIndex = Math.floor(Math.random() * images.length);
  const selectedImage = images[randomIndex];
  
  const quote = {
    src: selectedImage,
    alt: `Inspirational quote ${randomIndex + 1}`
  };

  // Store the quote and date
  localStorage.setItem('quote-of-the-day', JSON.stringify(quote));
  localStorage.setItem('quote-date', today);

  return quote;
};

// Get a random photo quote (for when user requests a new one)
export const getRandomPhotoQuote = (): PhotoQuote => {
  const images = getQuoteImages();
  
  if (images.length === 0) {
    // Fallback if no images found
    return {
      src: '/placeholder.svg',
      alt: 'No quote available'
    };
  }
  
  const randomIndex = Math.floor(Math.random() * images.length);
  const selectedImage = images[randomIndex];
  
  const quote = {
    src: selectedImage,
    alt: `Inspirational quote ${randomIndex + 1}`
  };

  // Update stored quote when user requests new one
  const today = new Date().toDateString();
  localStorage.setItem('quote-of-the-day', JSON.stringify(quote));
  localStorage.setItem('quote-date', today);
  
  return quote;
};

// Preload next quote for smooth transitions
export const preloadNextQuote = (): PhotoQuote => {
  const nextQuote = getQuoteOfTheDay();
  
  // Preload the image
  const img = new Image();
  img.src = nextQuote.src;
  
  return nextQuote;
};
