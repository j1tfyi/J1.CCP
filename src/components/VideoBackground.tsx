import React from 'react';

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
}) => (
  <video
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

export default VideoBackground;