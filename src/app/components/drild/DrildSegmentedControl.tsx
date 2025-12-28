import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { motion } from 'motion/react';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface DrildSegmentedControlProps {
  options: { label: string; value: string }[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function DrildSegmentedControl({ options, value, onChange, className }: DrildSegmentedControlProps) {
  return (
    <div className={cn("relative flex p-1 bg-[#232220] rounded-full h-12 w-full", className)}>
      {options.map((option) => {
        const isActive = value === option.value;
        return (
          <button
            key={option.value}
            onClick={() => onChange(option.value)}
            className={cn(
              "relative flex-1 text-sm font-semibold z-10 transition-colors duration-200",
              isActive ? "text-[#E8E6E3]" : "text-[#8C8279] hover:text-[#B0ABA6]"
            )}
          >
            {option.label}
            {isActive && (
              <motion.div
                layoutId="segment-indicator"
                className="absolute inset-0 bg-[#5E534B] rounded-full shadow-sm -z-10"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
