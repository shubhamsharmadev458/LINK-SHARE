'use client';

import { ParsedBlock, ThemeConfig } from '@/lib/types';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface Props {
  block: ParsedBlock<'standard_link'>;
  theme?: ThemeConfig;
}

export function StandardLink({ block, theme }: Props) {
  const { title, url, animate, thumbnail } = block.data;
  const linkId = block.id;

  const redirectUrl = `/api/r/${linkId}`;

  const isRounded = theme?.buttonStyle === 'rounded';
  const isPill = theme?.buttonStyle === 'pill';
  const isGlass = theme?.glassmorphism;

  const baseStyles = "w-full flex items-center justify-center p-4 text-center transition-all hover:scale-[1.02] active:scale-95";
  
  const shapeStyles = cn(
    !theme?.buttonStyle && "rounded-md",
    isRounded && "rounded-xl",
    isPill && "rounded-full"
  );

  const colorStyles = isGlass
    ? "bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 text-white shadow-xl"
    : "shadow-md hover:shadow-lg";

  // Dynamic colors if set
  const customBg = !isGlass && theme?.buttonColor ? { backgroundColor: theme.buttonColor } : {};
  const customText = !isGlass && theme?.buttonTextColor ? { color: theme.buttonTextColor } : {};

  // If animate is on, we can add a simple bounce config for framer motion
  const animationProps = animate
    ? {
        animate: { y: [0, -5, 0] },
        transition: { repeat: Infinity, duration: 2 }
      }
    : {};

  return (
    <motion.a
      href={redirectUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(baseStyles, shapeStyles, colorStyles, !isGlass && !theme?.buttonColor && 'bg-white text-gray-900', 'relative')}
      style={{ ...customBg, ...customText }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.95 }}
      {...animationProps}
    >
      {thumbnail && (
        <img 
          src={thumbnail} 
          alt={title} 
          className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 object-cover rounded-sm" 
        />
      )}
      <span className="font-semibold text-lg">{title}</span>
    </motion.a>
  );
}
