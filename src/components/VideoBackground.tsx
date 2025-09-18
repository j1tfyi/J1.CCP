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

  // Safari-specific video playback fix
  useEffect(() => {
    if (!videoRef.current || !shouldLoad) return;

    const video = videoRef.current;

    // Force Safari to start playing
    const playVideo = async () => {
      try {
        // Set volume to 0 for Safari autoplay policy
        video.muted = true;
        video.volume = 0;

        // Try to play the video
        const playPromise = video.play();

        if (playPromise !== undefined) {
          await playPromise;
        }
      } catch (err) {
        console.log('Video autoplay failed:', err);
        // Try again after user interaction
        const handleInteraction = () => {
          video.play().catch(() => {});
          document.removeEventListener('click', handleInteraction);
          document.removeEventListener('touchstart', handleInteraction);
        };
        document.addEventListener('click', handleInteraction);
        document.addEventListener('touchstart', handleInteraction);
      }
    };

    // Safari needs the video to be loaded before playing
    if (video.readyState >= 3) {
      playVideo();
    } else {
      video.addEventListener('loadeddata', playVideo);
      return () => video.removeEventListener('loadeddata', playVideo);
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
      className={className}
      onError={() => setError(true)}
      // Safari-specific attributes
      {...{
        'webkit-playsinline': 'true',
        'x-webkit-airplay': 'allow',
      } as any}
    >
      {shouldLoad && (
        <>
          <source src={src} type="video/mp4; codecs=avc1.42E01E,mp4a.40.2" />
          <source src={src} type="video/mp4" />
          {fallbackSrc && <source src={fallbackSrc} type="video/mp4" />}
        </>
      )}
      Your browser does not support the video tag.
    </video>
  );
};

// export default so default import works
export default VideoBackground;