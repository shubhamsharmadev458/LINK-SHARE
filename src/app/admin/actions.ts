'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { getSession } from '@/lib/auth';

async function getAuthProfile() {
  const session = await getSession();
  if (!session) throw new Error('Unauthorized');
  
  const profile = await prisma.profile.findUnique({
    where: { userId: session.userId },
    select: { id: true, username: true }
  });
  
  if (!profile) throw new Error('Profile not found');
  return profile;
}

async function getNextOrder(profileId: string) {
  const lastBlock = await prisma.block.findFirst({
    where: { profileId },
    orderBy: { order: 'desc' },
  });
  return lastBlock ? lastBlock.order + 1 : 1;
}

export async function addStandardLink(formData: FormData) {
  const title = formData.get('title') as string;
  const url = formData.get('url') as string;
  const thumbnailFile = formData.get('thumbnailFile') as File | null;
  const thumbnailText = formData.get('thumbnail') as string | null;

  if (!title || !url) throw new Error('Title and URL are required');

  let thumbnail = thumbnailText || null;

  if (thumbnailFile && thumbnailFile.size > 0) {
    const bytes = await thumbnailFile.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    const uploadsDir = join(process.cwd(), 'public', 'uploads');
    try { await mkdir(uploadsDir, { recursive: true }); } catch (e) {}

    const filename = `${Date.now()}-${thumbnailFile.name.replace(/\s/g, '_')}`;
    const filepath = join(uploadsDir, filename);
    await writeFile(filepath, buffer);
    
    thumbnail = `/uploads/${filename}`;
  }

  const { id: profileId, username } = await getAuthProfile();
  const order = await getNextOrder(profileId);

  const blockData = {
    title,
    url,
    ...(thumbnail ? { thumbnail } : {}),
  };

  await prisma.block.create({
    data: {
      type: 'standard_link',
      data: JSON.stringify(blockData),
      profileId,
      order,
    }
  });

  revalidatePath('/admin');
  revalidatePath(`/${username}`);
}

export async function addEmbedBlock(formData: FormData) {
  const url = formData.get('url') as string;
  const provider = formData.get('provider') as string;

  if (!url) throw new Error('URL is required');

  const { id: profileId, username } = await getAuthProfile();
  const order = await getNextOrder(profileId);

  await prisma.block.create({
    data: {
      type: 'embed_block',
      data: JSON.stringify({ url, provider: provider || 'youtube' }),
      profileId,
      order,
    }
  });

  revalidatePath('/admin');
  revalidatePath(`/${username}`);
}

export async function deleteBlock(blockId: string) {
  const { username } = await getAuthProfile();
  await prisma.block.delete({
    where: { id: blockId }
  });

  revalidatePath('/admin');
  revalidatePath(`/${username}`);
}

export async function toggleVisibility(blockId: string, currentStatus: boolean) {
  const { username } = await getAuthProfile();
  await prisma.block.update({
    where: { id: blockId },
    data: { isVisible: !currentStatus }
  });

  revalidatePath('/admin');
  revalidatePath(`/${username}`);
}

export async function updateProfile(formData: FormData) {
  const displayName = formData.get('displayName') as string;
  const bio = formData.get('bio') as string;
  const avatarFile = formData.get('avatarFile') as File | null;

  let avatarUrl: string | undefined = undefined;

  if (avatarFile && avatarFile.size > 0) {
    const bytes = await avatarFile.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    const uploadsDir = join(process.cwd(), 'public', 'uploads');
    try { await mkdir(uploadsDir, { recursive: true }); } catch (e) {}

    const filename = `avatar-${Date.now()}-${avatarFile.name.replace(/\s/g, '_')}`;
    const filepath = join(uploadsDir, filename);
    await writeFile(filepath, buffer);
    
    avatarUrl = `/uploads/${filename}`;
  }

  const updateData: any = {};
  if (displayName !== null) updateData.displayName = displayName;
  if (bio !== null) updateData.bio = bio;
  if (avatarUrl) updateData.avatar = avatarUrl;

  const { id: profileId, username } = await getAuthProfile();
  await prisma.profile.update({
    where: { id: profileId },
    data: updateData
  });

  revalidatePath('/admin');
  revalidatePath(`/${username}`);
}

export async function addSocialLink(formData: FormData) {
  const platform = formData.get('platform') as string;
  const url = formData.get('url') as string;

  if (!platform || !url) throw new Error('Platform and URL are required');

  const { id: profileId, username } = await getAuthProfile();
  
  const lastLink = await prisma.socialLink.findFirst({
    where: { profileId },
    orderBy: { order: 'desc' }
  });
  const order = lastLink ? lastLink.order + 1 : 1;

  await prisma.socialLink.create({
    data: {
      platform,
      url,
      profileId,
      order
    }
  });

  revalidatePath('/admin');
  revalidatePath(`/${username}`);
}

export async function deleteSocialLink(id: string) {
  const { username } = await getAuthProfile();
  await prisma.socialLink.delete({
    where: { id }
  });

  revalidatePath('/admin');
  revalidatePath(`/${username}`);
}

// NEW: Theme updates
export async function updateTheme(formData: FormData) {
  const backgroundColor = formData.get('backgroundColor') as string;
  const buttonColor = formData.get('buttonColor') as string;
  const fontFamily = formData.get('fontFamily') as string;
  const glassmorphism = formData.get('glassmorphism') === 'on';

  const { id: profileId, username } = await getAuthProfile();

  // Fetch current theme
  const profile = await prisma.profile.findUnique({ where: { id: profileId } });
  let theme = {};
  try { theme = profile?.themeConfig ? JSON.parse(profile.themeConfig) : {}; } catch(e) {}

  // Update theme properties
  if (backgroundColor) theme = { ...theme, backgroundColor };
  if (buttonColor) theme = { ...theme, buttonColor };
  if (fontFamily) theme = { ...theme, fontFamily };
  theme = { ...theme, glassmorphism };

  await prisma.profile.update({
    where: { id: profileId },
    data: { themeConfig: JSON.stringify(theme) }
  });

  revalidatePath('/admin');
  revalidatePath(`/${username}`);
}

// NEW: Drag and Drop Reordering
export async function updateBlockOrder(orderedIds: string[]) {
  const { username } = await getAuthProfile();
  
  // Update all block orders sequentially based on the new array order
  // In a production app with huge tables, doing a bulk update is better. 
  // Here sequential updates are fine for < 20 links.
  for (let i = 0; i < orderedIds.length; i++) {
    await prisma.block.update({
      where: { id: orderedIds[i] },
      data: { order: i }
    });
  }

  revalidatePath('/admin');
  revalidatePath(`/${username}`);
}
