import { useEffect, useRef, useState } from 'react';

interface UseVideoLazyLoadOptions {
  threshold?: number;
  rootMargin?: string;
}

export const useVideoLazyLoad = (options: UseVideoLazyLoadOptions = {}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isInView, setIsInView] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasLoaded) {
            setIsInView(true);
            // Start loading the video
            video.load();
            setHasLoaded(true);
          }
        });
      },
      {
        threshold: options.threshold || 0.1,
        rootMargin: options.rootMargin || '50px',
      }
    );

    observer.observe(video);

    return () => {
      observer.disconnect();
    };
  }, [hasLoaded, options.threshold, options.rootMargin]);

  return { videoRef, isInView, hasLoaded };
};