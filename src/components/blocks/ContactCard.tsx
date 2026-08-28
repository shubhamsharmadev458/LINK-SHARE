'use client';

import { useState } from 'react';
import { ParsedBlock, ThemeConfig } from '@/lib/types';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface Props {
  block: ParsedBlock<'contact_card'>;
  theme?: ThemeConfig;
}

export function ContactCard({ block, theme }: Props) {
  const { title = "Contact Me", emailTo } = block.data;
  
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle');

  const isRounded = theme?.buttonStyle === 'rounded' || theme?.buttonStyle === 'pill';
  const isGlass = theme?.glassmorphism;

  const shapeStyles = cn(
    !theme?.buttonStyle && "rounded-md",
    isRounded && "rounded-xl"
  );

  const containerStyles = cn(
    "w-full p-6 shadow-md flex flex-col gap-4",
    shapeStyles,
    isGlass ? "bg-white/10 backdrop-blur-md border border-white/20 text-white" : "bg-white text-gray-900"
  );

  const inputStyles = cn(
    "w-full p-3 rounded-md border focus:outline-none focus:ring-2",
    isGlass 
      ? "bg-white/5 border-white/20 focus:ring-white/50 placeholder:text-white/50 text-white" 
      : "bg-gray-50 border-gray-200 focus:ring-gray-400 placeholder:text-gray-400 text-gray-900"
  );

  const buttonStyles = cn(
    "w-full py-3 px-4 font-semibold transition-all flex items-center justify-center",
    shapeStyles,
    isGlass 
      ? "bg-white text-gray-900 hover:bg-white/90" 
      : "bg-gray-900 text-white hover:bg-gray-800"
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    // Simulate sending
    setTimeout(() => {
      setStatus('sent');
      setEmail('');
      setMessage('');
      setTimeout(() => setStatus('idle'), 3000);
    }, 1000);
  };

  return (
    <div className={containerStyles}>
      <h3 className="text-xl font-bold tracking-tight text-center">{title}</h3>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          type="email"
          required
          placeholder="Your Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={inputStyles}
        />
        <textarea
          required
          placeholder="Your Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={3}
          className={cn(inputStyles, "resize-none")}
        />
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={status !== 'idle'}
          className={buttonStyles}
        >
          {status === 'idle' ? 'Send Message' : status === 'sending' ? 'Sending...' : 'Sent!'}
        </motion.button>
      </form>
    </div>
  );
}
