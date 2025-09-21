import React from 'react';
import j1Logo from '../assets/j1ccplogo.svg';

interface J1LogoProps {
  className?: string;
  style?: React.CSSProperties;
}

export const J1Logo: React.FC<J1LogoProps> = ({ className = "w-8 h-8", style }) => {
  return (
    <img
      src={j1Logo}
      alt="J1.CCP"
      className={className}
      style={{
        objectFit: 'contain',
        ...style
      }}
    />
  );
};

export default J1Logo;