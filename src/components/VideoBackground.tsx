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

    // Simple play attempt for all browsers
    const playVideo = () => {
      if (video.paused) {
        video.play().catch(() => {
          // Silent fail - video will show first frame at least
        });
      }
    };

    // Try to play when ready
    if (video.readyState >= 3) {
      playVideo();
    } else {
      video.addEventListener('canplay', playVideo, { once: true });
    }
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
    >
      <source src={src} type="video/mp4" />
      {fallbackSrc && <source src={fallbackSrc} type="video/mp4" />}
      Your browser does not support the video tag.
    </video>
  );
};

export default VideoBackground;