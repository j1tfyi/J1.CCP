import React from 'react';
import comboLogo from '../assets/comboj1ccplogo.svg';

interface J1ComboLogoProps {
  className?: string;
  style?: React.CSSProperties;
}

export const J1ComboLogo: React.FC<J1ComboLogoProps> = ({ className = "h-12", style }) => {
  return (
    <img
      src={comboLogo}
      alt="J1.CCP"
      className={className}
      style={{
        objectFit: 'contain',
        ...style
      }}
    />
  );
};

export default J1ComboLogo;