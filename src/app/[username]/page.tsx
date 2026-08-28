import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import prisma from '@/lib/prisma';
import { BlockRenderer } from '@/components/blocks/BlockRenderer';
import { ParsedBlock, ThemeConfig } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Mail } from 'lucide-react';
import { FaInstagram, FaGithub, FaLinkedin, FaYoutube, FaTwitter } from 'react-icons/fa';

const ICONS: Record<string, any> = {
  instagram: FaInstagram,
  github: FaGithub,
  linkedin: FaLinkedin,
  youtube: FaYoutube,
  twitter: FaTwitter,
  x: FaTwitter,
  email: Mail,
};

type Props = {
  params: Promise<{ username: string }>;
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { username } = await props.params;
  const profile = await prisma.profile.findUnique({
    where: { username },
    select: { displayName: true, bio: true }
  });

  if (!profile) return { title: 'Not Found' };

  return {
    title: `${profile.displayName || username} | Link-in-Bio`,
    description: profile.bio || `Check out ${profile.displayName || username}'s links`,
    openGraph: {
      title: profile.displayName || username,
      description: profile.bio || '',
      type: 'profile',
      url: `/${username}`
    }
  };
}

export default async function ProfilePage(props: Props) {
  const { username } = await props.params;
  
  // Track Page View safely without blocking rendering
  try {
    const profileId = await prisma.profile.findUnique({ where: { username }, select: { id: true } });
    if (profileId) {
      await prisma.analyticsEvent.create({
        data: {
          type: 'page_view',
          profileId: profileId.id,
        }
      });
    }
  } catch (error) {
    console.error('Failed to track page view:', error);
  }

  const profile = await prisma.profile.findUnique({
    where: { username },
    include: {
      socialLinks: { orderBy: { order: 'asc' } },
      blocks: { orderBy: { order: 'asc' } },
    }
  });

  if (!profile) notFound();

  const theme: ThemeConfig = profile.themeConfig ? JSON.parse(profile.themeConfig) : {};
  const isGlass = theme.glassmorphism;

  const bgStyles = theme.backgroundImage
    ? { backgroundImage: `url(${theme.backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }
    : { backgroundColor: theme.backgroundColor || '#f9fafb' };

  return (
    <div 
      className="min-h-screen w-full flex flex-col items-center py-12 px-4 transition-all"
      style={{ ...bgStyles, fontFamily: theme.fontFamily }}
    >
      {/* Profile Header */}
      <div className="w-full max-w-md flex flex-col items-center text-center mb-8">
        {profile.avatar && (
          <img 
            src={profile.avatar} 
            alt={profile.displayName || username} 
            className="w-24 h-24 rounded-full mb-4 shadow-lg object-cover border-2 border-white/50"
          />
        )}
        <h1 className={cn("text-2xl font-bold tracking-tight", isGlass ? "text-white" : "text-gray-900")}>
          {profile.displayName || username}
        </h1>
        {profile.bio && (
          <p className={cn("mt-2 font-medium", isGlass ? "text-white/80" : "text-gray-600")}>
            {profile.bio}
          </p>
        )}
      </div>

      {/* Social Icons Bar */}
      {profile.socialLinks.length > 0 && (
        <div className="flex gap-4 mb-8">
          {profile.socialLinks.map(link => {
            const Icon = ICONS[link.platform.toLowerCase()] || Mail;
            return (
              <a 
                key={link.id} 
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "p-3 rounded-full shadow-sm transition-transform hover:scale-110 flex items-center justify-center",
                  isGlass ? "bg-white/20 text-white hover:bg-white/30 backdrop-blur-md" : "bg-white text-gray-800 hover:text-black hover:bg-gray-50"
                )}
              >
                <Icon size={24} />
              </a>
            )
          })}
        </div>
      )}

      {/* Blocks */}
      <div className="w-full max-w-md flex flex-col gap-4">
        {profile.blocks.filter(block => block.isVisible).map(block => {
          let parsedData: any = {};
          try {
            parsedData = JSON.parse(block.data);
          } catch(e) {}
          
          const parsedBlock: ParsedBlock = {
            id: block.id,
            type: block.type as any,
            data: parsedData,
            order: block.order
          };

          return <BlockRenderer key={block.id} block={parsedBlock} theme={theme} />;
        })}
      </div>
      
      {/* Footer Branding */}
      <div className={cn("mt-12 text-sm font-medium opacity-60 flex gap-1 items-center", isGlass ? "text-white" : "text-gray-500")}>
        Powered by <span className="font-bold">Link-in-Bio</span>
      </div>
    </div>
  );
}
