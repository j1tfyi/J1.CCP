import React, { useEffect, useRef } from 'react';

interface VideoBackgroundProps {
  /** Primary video source (mp4). */
  src: string;
  /** Optional fallback video source. */
  fallbackSrc?: string;
  /** CSS classes to apply to the <video> element. */
  className?: string;
  /** Preload strategy, defaults to 'metadata'. */
  preload?: 'auto' | 'metadata' | 'none';
}

export const VideoBackground: React.FC<VideoBackgroundProps> = ({
  src,
  fallbackSrc,
  className = '',
  preload = 'metadata',
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Safari requires explicit play() call after DOM load
    const playVideo = async () => {
      try {
        video.muted = true; // Ensure muted for autoplay
        await video.play();
      } catch (err) {
        // Fallback: try again after interaction or visibility change
        console.log('Video autoplay requires user interaction');
      }
    };

    // Check if Safari
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

    if (isSafari) {
      // Safari-specific handling
      video.setAttribute('webkit-playsinline', 'true');
      video.setAttribute('x-webkit-airplay', 'allow');

      // Wait for metadata to load before playing
      if (video.readyState >= 2) {
        playVideo();
      } else {
        video.addEventListener('loadedmetadata', playVideo, { once: true });
      }
    } else {
      // Other browsers
      if (video.paused) {
        playVideo();
      }
    }

    // Play when visible (for Safari background tabs)
    const handleVisibilityChange = () => {
      if (!document.hidden && video.paused) {
        playVideo();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [src]);

  return (
    <video
      ref={videoRef}
      className={className}
      autoPlay
      muted
      loop
      playsInline
      preload={preload}
      webkit-playsinline="true"
      x-webkit-airplay="allow"
    >
      <source src={src} type="video/mp4" />
      {fallbackSrc && <source src={fallbackSrc} type="video/mp4" />}
      Your browser does not support the video tag.
    </video>
  );
};

export default VideoBackground;