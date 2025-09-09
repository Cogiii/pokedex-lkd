import React from 'react';
import Image from 'next/image';
import Logo from '../../../public/pokemon-logo.png';

interface LoadingProps {
  message?: string;
  showLogo?: boolean;
}

export const Loading: React.FC<LoadingProps> = ({ 
  message = 'Loading Pokédex...', 
  showLogo = true 
}) => {
  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-white">
      {showLogo && (
        <Image 
          src={Logo} 
          alt="Pokemon Logo" 
          width={200} 
          height={200} 
          className="animate-spin" 
        />
      )}
      <div className="text-2xl font-bold text-black">{message}</div>
    </div>
  );
};
