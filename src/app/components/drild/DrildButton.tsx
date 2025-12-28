import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface DrildButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'icon';
  size?: 'sm' | 'md' | 'lg' | 'icon';
}

export function DrildButton({ 
  children, 
  className, 
  variant = 'primary', 
  size = 'md',
  ...props 
}: DrildButtonProps) {
  // Matches the "DRILD" logo text color (Dark Taupe)
  const variants = {
    primary: "bg-[#5E534B] text-[#E8E6E3] hover:bg-[#6E635B] active:scale-95 shadow-lg shadow-[#5E534B]/20",
    secondary: "bg-[#232220] text-[#E8E6E3] hover:bg-[#2E2D2B] active:scale-95",
    ghost: "bg-transparent text-[#8C8279] hover:text-[#E8E6E3] hover:bg-white/5 active:scale-95",
    icon: "bg-[#232220] text-[#E8E6E3] hover:bg-[#2E2D2B] active:scale-95 flex items-center justify-center aspect-square rounded-full p-0"
  };

  const sizes = {
    sm: "h-8 px-4 text-xs",
    md: "h-12 px-6 text-sm font-semibold",
    lg: "h-14 px-8 text-base font-bold",
    icon: "h-12 w-12"
  };

  return (
    <button
      className={cn(
        "rounded-full transition-all duration-200 ease-out flex items-center justify-center gap-2",
        variants[variant],
        variant !== 'icon' && sizes[size],
        variant === 'icon' && sizes.icon,
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
