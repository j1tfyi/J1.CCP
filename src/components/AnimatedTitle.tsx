import React, { useState, useEffect } from 'react';

interface AnimatedTitleProps {
  className?: string;
  style?: React.CSSProperties;
}

export const AnimatedTitle: React.FC<AnimatedTitleProps> = ({ className, style }) => {
  const [currentFrame, setCurrentFrame] = useState(0);
  const totalFrames = 75; // Total number of PNG frames
  const frameRate = 30; // 30 fps for smooth animation
  const frameDelay = 1000 / frameRate;

  useEffect(() => {
    // Preload all images
    const preloadImages = () => {
      for (let i = 0; i < totalFrames; i++) {
        const img = new Image();
        const frameNumber = i.toString().padStart(2, '0');
        img.src = `/j1crosschain-portal-all-2025-10-04/frames-${frameNumber}.png`;
      }
    };

    preloadImages();

    // Start animation
    const interval = setInterval(() => {
      setCurrentFrame((prevFrame) => (prevFrame + 1) % totalFrames);
    }, frameDelay);

    return () => clearInterval(interval);
  }, []);

  const frameNumber = currentFrame.toString().padStart(2, '0');
  const imageSrc = `/j1crosschain-portal-all-2025-10-04/frames-${frameNumber}.png`;

  return (
    <img
      src={imageSrc}
      alt="J1.CrossChain Portal"
      className={className}
      style={style}
    />
  );
};