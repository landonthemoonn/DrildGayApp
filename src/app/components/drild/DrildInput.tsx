import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface DrildInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
}

export function DrildInput({ className, icon, ...props }: DrildInputProps) {
  return (
    <div className="relative w-full group">
      {icon && (
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8C8279] group-focus-within:text-[#E8E6E3] transition-colors">
          {icon}
        </div>
      )}
      <input
        className={cn(
          "w-full bg-[#232220] text-[#E8E6E3] border-2 border-transparent rounded-2xl h-14",
          icon ? "pl-12 pr-4" : "px-4",
          "placeholder:text-[#52525b] focus:outline-none focus:border-[#5E534B] focus:bg-[#1A1918] transition-all duration-200",
          className
        )}
        {...props}
      />
    </div>
  );
}
