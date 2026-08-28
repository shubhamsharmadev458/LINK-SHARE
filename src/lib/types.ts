import { z } from 'zod';

export const ThemeConfigSchema = z.object({
  backgroundColor: z.string().optional(), // Hex color
  backgroundImage: z.string().url().optional(), // URL to image
  fontFamily: z.string().optional(),
  buttonStyle: z.enum(['rounded', 'pill', 'square']).optional(),
  buttonColor: z.string().optional(),
  buttonTextColor: z.string().optional(),
  glassmorphism: z.boolean().optional(),
});
export type ThemeConfig = z.infer<typeof ThemeConfigSchema>;

export const StandardLinkDataSchema = z.object({
  title: z.string(),
  url: z.string().url(),
  icon: z.string().optional(),
  thumbnail: z.string().url().optional(),
  animate: z.boolean().optional(),
});
export type StandardLinkData = z.infer<typeof StandardLinkDataSchema>;

export const HeaderTextDataSchema = z.object({
  text: z.string(),
});
export type HeaderTextData = z.infer<typeof HeaderTextDataSchema>;

export const EmbedBlockDataSchema = z.object({
  url: z.string().url(),
  provider: z.enum(['youtube', 'spotify', 'generic']).optional(),
});
export type EmbedBlockData = z.infer<typeof EmbedBlockDataSchema>;

export const ContactCardDataSchema = z.object({
  title: z.string().optional(),
  emailTo: z.string().email(),
});
export type ContactCardData = z.infer<typeof ContactCardDataSchema>;

export type BlockDataMap = {
  standard_link: StandardLinkData;
  header_text: HeaderTextData;
  embed_block: EmbedBlockData;
  contact_card: ContactCardData;
};

// Extends the Prisma Block with parsed data
export type ParsedBlock<T extends keyof BlockDataMap = keyof BlockDataMap> = {
  id: string;
  type: T;
  data: BlockDataMap[T];
  order: number;
};
