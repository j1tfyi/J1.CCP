// src/components/VideoBackground.tsx
import React, { useEffect, useRef, useState } from 'react';

interface VideoBackgroundProps {
  src: string;
  fallbackSrc?: string;
  className?: string;
  preload?: 'auto' | 'metadata' | 'none';
  lazyLoad?: boolean;
}

export const VideoBackground: React.FC<VideoBackgroundProps> = ({
  src,
  fallbackSrc,
  className = '',
  preload = 'metadata',
  lazyLoad = false,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState(false);
  const [shouldLoad, setShouldLoad] = useState(!lazyLoad);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!lazyLoad) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      });
    }, { threshold: 0.1, rootMargin: '100px' });
    if (videoRef.current) observer.observe(videoRef.current);
    return () => observer.disconnect();
  }, [lazyLoad]);

  // Cross-browser video playback fix
  useEffect(() => {
    if (!videoRef.current || !shouldLoad) return;

    const video = videoRef.current;
    let playAttempts = 0;
    const maxAttempts = 3;

    const attemptPlay = async () => {
      if (playAttempts >= maxAttempts) return;
      playAttempts++;

      try {
        // Ensure video is muted for autoplay policies
        video.muted = true;
        video.volume = 0;
        video.defaultMuted = true;
        video.setAttribute('muted', '');

        // Set additional attributes for better compatibility
        video.setAttribute('playsinline', '');
        video.setAttribute('webkit-playsinline', '');
        video.setAttribute('x-webkit-airplay', 'allow');

        // For Safari, we need to load the video first
        if (video.readyState === 0) {
          await video.load();
        }

        const playPromise = video.play();

        if (playPromise !== undefined) {
          await playPromise;
          setIsLoaded(true);
        }
      } catch (err) {
        console.warn(`Video autoplay attempt ${playAttempts} failed:`, err);

        // Retry after a short delay
        if (playAttempts < maxAttempts) {
          setTimeout(attemptPlay, 500);
        } else {
          // Final fallback: play on user interaction
          const handleInteraction = () => {
            video.play().catch(() => {});
            document.removeEventListener('click', handleInteraction);
            document.removeEventListener('touchstart', handleInteraction);
            document.removeEventListener('scroll', handleInteraction);
          };
          document.addEventListener('click', handleInteraction, { once: true });
          document.addEventListener('touchstart', handleInteraction, { once: true });
          document.addEventListener('scroll', handleInteraction, { once: true });
        }
      }
    };

    // Handle different video ready states
    const handleCanPlay = () => {
      attemptPlay();
    };

    if (video.readyState >= 2) {
      // Video can play
      attemptPlay();
    } else {
      // Wait for video to be ready
      video.addEventListener('canplay', handleCanPlay);
      video.addEventListener('loadedmetadata', handleCanPlay);

      return () => {
        video.removeEventListener('canplay', handleCanPlay);
        video.removeEventListener('loadedmetadata', handleCanPlay);
      };
    }
  }, [shouldLoad]);

  return error ? (
    <div className={className} style={{ backgroundColor: '#000' }} />
  ) : (
    <video
      ref={videoRef}
      autoPlay
      muted
      loop
      playsInline
      preload={shouldLoad ? preload : 'none'}
      className={`${className} ${!isLoaded ? 'opacity-0' : ''}`}
      onError={(e) => {
        console.error('Video error:', e);
        setError(true);
      }}
      onLoadedData={() => setIsLoaded(true)}
      onCanPlay={() => setIsLoaded(true)}
      style={{
        transition: 'opacity 0.5s ease-in-out',
      }}
    >
      {shouldLoad && (
        <>
          {/* Multiple source formats for better browser compatibility */}
          <source
            src={src}
            type="video/mp4; codecs=avc1.42E01E,mp4a.40.2"
          />
          <source
            src={src}
            type="video/mp4"
          />
          {/* Fallback for WebM if available */}
          {src.replace('.mp4', '.webm') && (
            <source
              src={src.replace('.mp4', '.webm')}
              type="video/webm"
            />
          )}
          {fallbackSrc && (
            <source
              src={fallbackSrc}
              type="video/mp4"
            />
          )}
        </>
      )}
      Your browser does not support the video tag.
    </video>
  );
};

// export default so default import works
export default VideoBackground;