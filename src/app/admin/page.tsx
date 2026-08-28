import prisma from '@/lib/prisma';
import { addStandardLink, addEmbedBlock, deleteBlock, toggleVisibility, updateProfile, addSocialLink, deleteSocialLink, updateTheme } from './actions';
import { cn } from '@/lib/utils';
import { Trash2 } from 'lucide-react';
import Link from 'next/link';
import ReorderableBlocks from '@/components/admin/ReorderableBlocks';

import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { logout } from '../(auth)/auth-actions';

export default async function AdminDashboard() {
  const session = await getSession();
  if (!session) redirect('/login');

  const profile = await prisma.profile.findUnique({
    where: { userId: session.userId },
    include: {
      blocks: { orderBy: { order: 'asc' } },
      socialLinks: { orderBy: { order: 'asc' } }
    }
  });

  if (!profile) return <div className="p-8">Admin Error: Profile not found for this user.</div>;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 p-8">
      <div className="max-w-5xl mx-auto flex flex-col gap-8">
        
        <header className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <div className="flex items-center gap-4">
            <Link href={`/${profile.username}`} target="_blank" className="text-blue-600 font-semibold hover:underline">
              View Live Profile &rarr;
            </Link>
            <form action={logout}>
              <button type="submit" className="text-sm font-semibold text-gray-600 hover:text-gray-900">
                Log Out
              </button>
            </form>
          </div>
        </header>

        {/* TOP ROW: Profile & Socials */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold mb-4">Profile Settings</h2>
            <form action={updateProfile} className="flex flex-col gap-4">
              <div className="flex items-center gap-4 mb-2">
                {profile.avatar && (
                  <img src={profile.avatar} alt="Avatar" className="w-16 h-16 rounded-full object-cover" />
                )}
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">New Avatar Image (Optional)</label>
                  <input type="file" name="avatarFile" accept="image/*" className="w-full border rounded-md p-1.5 focus:ring-2 focus:ring-blue-500 outline-none text-sm" />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Display Name</label>
                <input type="text" name="displayName" defaultValue={profile.displayName || ''} placeholder="Your Name" className="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                <textarea name="bio" rows={3} defaultValue={profile.bio || ''} placeholder="A short bio about yourself..." className="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none"></textarea>
              </div>
              <button type="submit" className="w-full bg-blue-600 text-white font-semibold py-2 rounded-md hover:bg-blue-700 transition-colors">
                Save Profile
              </button>
            </form>
          </section>

          <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold mb-4">Social Links</h2>
            
            <div className="flex flex-col gap-3 mb-6">
              {profile.socialLinks.length === 0 && <p className="text-gray-500 text-sm">No social links yet.</p>}
              {profile.socialLinks.map(link => (
                <div key={link.id} className="flex items-center justify-between p-3 border rounded-lg bg-gray-50">
                  <div className="flex flex-col">
                    <span className="font-semibold capitalize">{link.platform}</span>
                    <span className="text-xs text-gray-500 truncate max-w-[200px]">{link.url}</span>
                  </div>
                  <form action={async () => {
                    'use server';
                    await deleteSocialLink(link.id);
                  }}>
                    <button type="submit" className="p-2 text-red-500 hover:bg-red-50 rounded-md transition-colors" title="Delete Social Link">
                      <Trash2 size={18} />
                    </button>
                  </form>
                </div>
              ))}
            </div>

            <form action={addSocialLink} className="flex flex-col gap-3 pt-4 border-t">
              <h3 className="font-semibold text-sm">Add New Social Link</h3>
              <div>
                <select name="platform" className="w-full border rounded-md p-2 outline-none mb-3">
                  <option value="twitter">Twitter</option>
                  <option value="instagram">Instagram</option>
                  <option value="github">GitHub</option>
                  <option value="youtube">YouTube</option>
                  <option value="linkedin">LinkedIn</option>
                  <option value="mail">Email</option>
                </select>
                <input type="url" name="url" required placeholder="https://..." className="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <button type="submit" className="w-full bg-gray-900 text-white font-semibold py-2 rounded-md hover:bg-gray-800 transition-colors">
                Add Icon
              </button>
            </form>
          </section>

        </div>

        {/* MIDDLE ROW: Appearance */}
        <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold mb-4">Theme & Appearance</h2>
          <form action={updateTheme} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Background Color</label>
              <input type="color" name="backgroundColor" defaultValue={profile.themeConfig ? JSON.parse(profile.themeConfig).backgroundColor : '#f9fafb'} className="w-full h-10 rounded cursor-pointer" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Button Color</label>
              <input type="color" name="buttonColor" defaultValue={profile.themeConfig ? JSON.parse(profile.themeConfig).buttonColor : '#ffffff'} className="w-full h-10 rounded cursor-pointer" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Font Family</label>
              <select name="fontFamily" defaultValue={profile.themeConfig ? JSON.parse(profile.themeConfig).fontFamily : 'Inter'} className="w-full border rounded-md p-2 outline-none">
                <option value="Inter, sans-serif">Inter (Modern)</option>
                <option value="Georgia, serif">Georgia (Serif)</option>
                <option value="'Comic Sans MS', cursive">Comic Sans (Fun)</option>
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" name="glassmorphism" defaultChecked={profile.themeConfig ? JSON.parse(profile.themeConfig).glassmorphism : false} className="w-4 h-4 text-blue-600 rounded" />
                <span className="text-sm font-medium text-gray-700">Glassmorphism Mode</span>
              </label>
              <button type="submit" className="w-full bg-purple-600 text-white font-semibold py-2 rounded-md hover:bg-purple-700 transition-colors">
                Apply Theme
              </button>
            </div>
          </form>
        </section>

        {/* BOTTOM ROW: Block Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold mb-4">Your Link Blocks</h2>
            <ReorderableBlocks initialBlocks={profile.blocks} />
          </section>

          <div className="flex flex-col gap-8">
            <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold mb-4">Add Standard Link</h2>
              <form action={addStandardLink} className="flex flex-col gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input type="text" name="title" required placeholder="My Awesome Project" className="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">URL</label>
                  <input type="url" name="url" required placeholder="https://example.com" className="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Upload Thumbnail Image (Optional)</label>
                  <input type="file" name="thumbnailFile" accept="image/*" className="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div className="text-center text-xs text-gray-400">or use an image URL</div>
                <div>
                  <input type="url" name="thumbnail" placeholder="https://image-url.jpg" className="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <button type="submit" className="w-full bg-blue-600 text-white font-semibold py-2 rounded-md hover:bg-blue-700 transition-colors">
                  Add Link
                </button>
              </form>
            </section>

            <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold mb-4">Add YouTube / Spotify Embed</h2>
              <form action={addEmbedBlock} className="flex flex-col gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Video / Track URL</label>
                  <input type="url" name="url" required placeholder="https://youtube.com/watch?v=..." className="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Provider</label>
                  <select name="provider" className="w-full border rounded-md p-2 outline-none">
                    <option value="youtube">YouTube</option>
                    <option value="spotify">Spotify</option>
                  </select>
                </div>
                <button type="submit" className="w-full bg-red-600 text-white font-semibold py-2 rounded-md hover:bg-red-700 transition-colors">
                  Add Embed
                </button>
              </form>
            </section>
          </div>
        </div>

      </div>
    </div>
  );
}
