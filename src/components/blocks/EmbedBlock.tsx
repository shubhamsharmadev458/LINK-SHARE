'use client';

import { ParsedBlock, ThemeConfig } from '@/lib/types';
import { cn } from '@/lib/utils';

interface Props {
  block: ParsedBlock<'embed_block'>;
  theme?: ThemeConfig;
}

export function EmbedBlock({ block, theme }: Props) {
  const { url, provider } = block.data;
  
  const isRounded = theme?.buttonStyle === 'rounded' || theme?.buttonStyle === 'pill';
  const isGlass = theme?.glassmorphism;

  const shapeStyles = cn(
    !theme?.buttonStyle && "rounded-md",
    isRounded && "rounded-xl"
  );

  const containerStyles = cn(
    "w-full overflow-hidden shadow-md",
    shapeStyles,
    isGlass ? "bg-white/5 border border-white/10" : "bg-gray-100"
  );

  // Heuristic for YouTube embed
  const getEmbedUrl = (sourceUrl: string) => {
    if (provider === 'youtube' || sourceUrl.includes('youtube.com') || sourceUrl.includes('youtu.be')) {
      const videoId = sourceUrl.includes('youtu.be/') 
        ? sourceUrl.split('youtu.be/')[1].split('?')[0]
        : sourceUrl.split('v=')[1]?.split('&')[0];
      
      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}`;
      }
    }
    if (provider === 'spotify' || sourceUrl.includes('spotify.com')) {
      // Basic spotify embed conversion
      // https://open.spotify.com/track/123 -> https://open.spotify.com/embed/track/123
      return sourceUrl.replace('open.spotify.com/', 'open.spotify.com/embed/');
    }
    return sourceUrl;
  };

  return (
    <div className={containerStyles}>
      <iframe
        src={getEmbedUrl(url)}
        className="w-full aspect-video border-0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        loading="lazy"
      ></iframe>
    </div>
  );
}
