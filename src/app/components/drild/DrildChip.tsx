import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface DrildChipProps extends React.HTMLAttributes<HTMLDivElement> {
  active?: boolean;
}

export function DrildChip({ children, className, active = false, ...props }: DrildChipProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center justify-center h-9 px-4 rounded-full text-xs font-semibold tracking-wide transition-colors cursor-pointer select-none",
        active 
          ? "bg-[#5E534B] text-[#E8E6E3] shadow-lg shadow-[#5E534B]/20" 
          : "bg-[#232220] text-[#8C8279] hover:bg-[#2E2D2B] hover:text-[#E8E6E3]",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
