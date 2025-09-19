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

    // Set source programmatically for Safari
    const source = video.querySelector('source');
    if (source) {
      source.src = src;
    }

    // Force load
    video.load();

    // Play after a short delay
    const playVideo = () => {
      video.muted = true;
      video.play().catch(err => {
        console.log('Video play failed:', err);
        // Retry on user interaction
        const retry = () => {
          video.play().catch(() => {});
          document.removeEventListener('click', retry);
        };
        document.addEventListener('click', retry, { once: true });
      });
    };

    // Wait for video to be ready
    if (video.readyState >= 2) {
      playVideo();
    } else {
      video.addEventListener('loadeddata', playVideo, { once: true });
    }

    // Backup play attempts
    setTimeout(playVideo, 100);
    setTimeout(playVideo, 500);
  }, [src]);

  return (
    <video
      ref={videoRef}
      className={className}
      autoPlay
      muted
      loop
      playsInline
      webkit-playsinline="true"
      preload={preload}
    >
      <source type="video/mp4" />
      {fallbackSrc && <source src={fallbackSrc} type="video/mp4" />}
      Your browser does not support the video tag.
    </video>
  );
};

export default VideoBackground;