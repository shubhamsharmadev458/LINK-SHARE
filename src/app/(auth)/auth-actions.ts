'use server';

import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { setSession, clearSession } from '@/lib/auth';
import { redirect } from 'next/navigation';

export async function login(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) throw new Error('Email and password are required');

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !user.password) throw new Error('Invalid credentials');

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) throw new Error('Invalid credentials');

  await setSession(user.id);
  redirect('/admin');
}

export async function register(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const username = formData.get('username') as string;

  if (!email || !password || !username) throw new Error('All fields are required');

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) throw new Error('Email already exists');

  const existingProfile = await prisma.profile.findUnique({ where: { username } });
  if (existingProfile) throw new Error('Username is taken');

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      profile: {
        create: {
          username,
          displayName: username,
          themeConfig: JSON.stringify({ backgroundColor: '#f9fafb' }),
        }
      }
    }
  });

  await setSession(newUser.id);
  redirect('/admin');
}

export async function logout() {
  await clearSession();
  redirect('/login');
}
