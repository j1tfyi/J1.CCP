import React, { useEffect, useRef, useState } from 'react';

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
  const [isSafari] = useState(() => {
    return typeof window !== 'undefined' &&
           /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
  });

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const attemptPlay = async () => {
      try {
        // Ensure video is muted for autoplay
        video.muted = true;
        video.defaultMuted = true;
        video.setAttribute('muted', '');

        if (isSafari) {
          // Safari-specific: Load and play explicitly
          video.load();
          // Wait a moment for load to start
          await new Promise(resolve => setTimeout(resolve, 50));
        }

        // Try to play
        const playPromise = video.play();
        if (playPromise !== undefined) {
          await playPromise;
        }
      } catch (error) {
        // Try alternative play method for Safari
        if (isSafari) {
          setTimeout(() => {
            video.play().catch(() => {});
          }, 500);
        }
      }
    };

    // For Safari, we need to be more aggressive
    if (isSafari) {
      // Try multiple times with delays
      attemptPlay();
      setTimeout(attemptPlay, 100);
      setTimeout(attemptPlay, 500);
      setTimeout(attemptPlay, 1000);

      // Also try on user interaction
      const handleInteraction = () => {
        attemptPlay();
        document.removeEventListener('click', handleInteraction);
        document.removeEventListener('touchstart', handleInteraction);
      };
      document.addEventListener('click', handleInteraction, { once: true });
      document.addEventListener('touchstart', handleInteraction, { once: true });
    } else {
      // Standard browsers
      attemptPlay();
    }

    // Try again when window gets focus
    const handleFocus = () => attemptPlay();
    window.addEventListener('focus', handleFocus);

    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, [src, isSafari]);

  // For Safari, use specific attributes
  const videoProps = isSafari ? {
    'autoPlay': true,
    'muted': true,
    'playsInline': true,
    'loop': true,
    'webkit-playsinline': 'true',
    'x5-playsinline': 'true',
    'x5-video-player-type': 'h5',
    'x-webkit-airplay': 'allow',
    'preload': preload,
    'defaultMuted': true
  } : {
    autoPlay: true,
    muted: true,
    loop: true,
    playsInline: true,
    preload: preload
  };

  return (
    <video
      ref={videoRef}
      className={className}
      {...videoProps}
    >
      <source src={src} type="video/mp4" />
      {fallbackSrc && <source src={fallbackSrc} type="video/mp4" />}
      Your browser does not support the video tag.
    </video>
  );
};

export default VideoBackground;