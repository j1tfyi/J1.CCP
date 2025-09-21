import React, { useEffect, useRef } from 'react';

interface VideoBackgroundProps {
  /** Primary video source (without extension). */
  src: string;
  /** Optional fallback video source. */
  fallbackSrc?: string;
  /** CSS classes to apply to the <video> element. */
  className?: string;
  /** Preload strategy, defaults to 'metadata'. */
  preload?: 'auto' | 'metadata' | 'none';
  /** Poster image to show before video loads */
  poster?: string;
  /** Priority loading (for above-fold videos) */
  priority?: boolean;
}

export const VideoBackground: React.FC<VideoBackgroundProps> = ({
  src,
  fallbackSrc,
  className = '',
  preload = 'metadata',
  poster,
  priority = false,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isInView, setIsInView] = React.useState(priority);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Use Intersection Observer for lazy loading non-priority videos
    if (!priority) {
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            setIsInView(true);
            observer.disconnect();
          }
        },
        { rootMargin: '50px' }
      );
      observer.observe(video);
      return () => observer.disconnect();
    }
  }, [priority]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !isInView) return;

    // Mobile detection
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

    // Force video attributes for mobile
    if (isMobile) {
      video.setAttribute('playsinline', 'true');
      video.setAttribute('webkit-playsinline', 'true');
      video.setAttribute('x5-playsinline', 'true');
      video.setAttribute('x5-video-player-type', 'h5');
      video.setAttribute('x5-video-player-fullscreen', 'false');
    }

    // Play video function
    const playVideo = async () => {
      try {
        video.muted = true;
        video.defaultMuted = true;

        // On mobile and Safari, we need to be more aggressive
        if (isMobile || isSafari) {
          video.currentTime = 0;
        }

        await video.play();
      } catch (err) {
        console.log('Video play attempt failed:', err);

        // On mobile, try playing on first user interaction
        if (isMobile) {
          const handleFirstInteraction = async () => {
            try {
              video.muted = true;
              await video.play();
            } catch (e) {
              console.log('Video play on interaction failed:', e);
            }
            document.removeEventListener('touchstart', handleFirstInteraction);
            document.removeEventListener('click', handleFirstInteraction);
          };

          document.addEventListener('touchstart', handleFirstInteraction, { once: true });
          document.addEventListener('click', handleFirstInteraction, { once: true });
        }
      }
    };

    // Force load the video
    video.load();

    // Try to play when ready
    const handleCanPlay = () => {
      playVideo();
    };

    video.addEventListener('canplaythrough', handleCanPlay, { once: true });

    // Fallback play attempts with delays
    setTimeout(playVideo, 100);
    setTimeout(playVideo, 500);
    if (isMobile || isSafari) {
      setTimeout(playVideo, 1000);
      setTimeout(playVideo, 2000);
    }

    // Play when page becomes visible (for mobile browsers)
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

  // Get base filename without extension
  const baseSrc = src.replace(/\.(mp4|mov|webm)$/, '');

  return (
    <video
      ref={videoRef}
      className={className}
      autoPlay
      muted
      defaultMuted
      loop
      playsInline
      disablePictureInPicture
      webkit-playsinline="true"
      x5-playsinline="true"
      preload={isInView ? preload : 'none'}
      poster={poster}
      controlsList="nodownload noplaybackrate nopictureinpicture"
    >
      {isInView && (
        <>
          {/* WebM for modern browsers (smallest file size) */}
          <source src={`${baseSrc}.webm`} type="video/webm" />
          {/* MP4 for wide compatibility */}
          <source src={`${baseSrc}.mp4`} type="video/mp4" />
          {/* MOV for Safari/iOS */}
          <source src={`${baseSrc}.mov`} type="video/quicktime" />
          {/* Fallback sources if provided */}
          {fallbackSrc && (
            <>
              <source src={`${fallbackSrc.replace(/\.(mp4|mov|webm)$/, '')}.webm`} type="video/webm" />
              <source src={`${fallbackSrc.replace(/\.(mp4|mov|webm)$/, '')}.mp4`} type="video/mp4" />
              <source src={`${fallbackSrc.replace(/\.(mp4|mov|webm)$/, '')}.mov`} type="video/quicktime" />
            </>
          )}
        </>
      )}
      Your browser does not support the video tag.
    </video>
  );
};

export default VideoBackground;