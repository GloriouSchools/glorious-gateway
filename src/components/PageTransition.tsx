import { ReactNode, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

interface PageTransitionProps {
  children: ReactNode;
}

const pageTransitions = [
  'animate-fade-in',
  'animate-slide-in-left',
  'animate-slide-in-right', 
  'animate-slide-up',
  'animate-slide-down',
  'animate-zoom-in',
  'animate-bounce-in',
  'animate-swipe-left',
  'animate-swipe-right',
  'animate-swipe-up',
  'animate-swipe-down',
  'animate-flip-x',
  'animate-flip-y',
  'animate-zoom-bounce',
  'animate-scale-in'
];

const exitTransitions = [
  'animate-fade-out',
  'animate-zoom-out',
  'animate-bounce-out'
];

export function PageTransition({ children }: PageTransitionProps) {
  const location = useLocation();
  const [currentAnimation, setCurrentAnimation] = useState('');
  const [isExiting, setIsExiting] = useState(false);
  const [displayChildren, setDisplayChildren] = useState(children);

  useEffect(() => {
    // Don't animate on initial load
    if (location.pathname === '/' && !currentAnimation) {
      setCurrentAnimation('animate-fade-in');
      setDisplayChildren(children);
      return;
    }

    // Start exit animation
    if (currentAnimation) {
      setIsExiting(true);
      const randomExitAnimation = exitTransitions[Math.floor(Math.random() * exitTransitions.length)];
      setCurrentAnimation(randomExitAnimation);
      
      // After exit animation completes, update content and start enter animation
      const exitTimeout = setTimeout(() => {
        setDisplayChildren(children);
        const randomEnterAnimation = pageTransitions[Math.floor(Math.random() * pageTransitions.length)];
        setCurrentAnimation(randomEnterAnimation);
        setIsExiting(false);
      }, 600); // Longer, smoother exit duration

      return () => clearTimeout(exitTimeout);
    } else {
      // First animation on route change
      const randomAnimation = pageTransitions[Math.floor(Math.random() * pageTransitions.length)];
      setCurrentAnimation(randomAnimation);
      setDisplayChildren(children);
    }
  }, [location.pathname]);

  return (
    <div 
      className={`min-h-screen transition-all duration-700 ease-out ${currentAnimation}`}
      key={location.pathname}
    >
      {displayChildren}
    </div>
  );
}