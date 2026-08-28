'use client';

import { ParsedBlock, ThemeConfig } from '@/lib/types';
import { StandardLink } from './StandardLink';
import { HeaderText } from './HeaderText';
import { EmbedBlock } from './EmbedBlock';
import { ContactCard } from './ContactCard';

interface Props {
  block: ParsedBlock;
  theme?: ThemeConfig;
}

export function BlockRenderer({ block, theme }: Props) {
  switch (block.type) {
    case 'standard_link':
      return <StandardLink block={block as ParsedBlock<'standard_link'>} theme={theme} />;
    case 'header_text':
      return <HeaderText block={block as ParsedBlock<'header_text'>} theme={theme} />;
    case 'embed_block':
      return <EmbedBlock block={block as ParsedBlock<'embed_block'>} theme={theme} />;
    case 'contact_card':
      return <ContactCard block={block as ParsedBlock<'contact_card'>} theme={theme} />;
    default:
      return null;
  }
}
