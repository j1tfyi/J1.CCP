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

  return error ? (
    <div className={className} style={{ backgroundColor: '#000' }} />
  ) : (
    <video
      ref={videoRef}
      autoPlay={shouldLoad}
      muted
      loop
      playsInline
      webkit-playsinline="true"
      preload={shouldLoad ? preload : 'none'}
      className={className}
      onError={() => setError(true)}
    >
      {shouldLoad && (
        <>
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