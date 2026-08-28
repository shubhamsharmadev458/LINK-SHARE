import { ParsedBlock, ThemeConfig } from '@/lib/types';
import { cn } from '@/lib/utils';

interface Props {
  block: ParsedBlock<'header_text'>;
  theme?: ThemeConfig;
}

export function HeaderText({ block, theme }: Props) {
  const { text } = block.data;
  
  const isGlass = theme?.glassmorphism;
  const textColor = isGlass ? 'text-white' : 'text-gray-900';

  return (
    <div className="w-full flex items-center justify-center my-6">
      <h2 className={cn("text-xl font-bold tracking-tight text-center", textColor)}>
        {text}
      </h2>
    </div>
  );
}
