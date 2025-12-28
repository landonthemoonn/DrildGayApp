import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface DrildCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  noPadding?: boolean;
}

export function DrildCard({ children, className, noPadding = false, ...props }: DrildCardProps) {
  return (
    <div
      className={cn(
        "bg-[#232220] rounded-[32px] shadow-lg shadow-black/80 overflow-hidden",
        !noPadding && "p-6",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
