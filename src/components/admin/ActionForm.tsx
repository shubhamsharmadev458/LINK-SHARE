'use client';

import React from 'react';
import toast from 'react-hot-toast';
import { unstable_rethrow } from 'next/navigation';

interface ActionFormProps extends React.FormHTMLAttributes<HTMLFormElement> {
  action: (formData: FormData) => Promise<any>;
  successMessage?: string;
}

export function ActionForm({ action, successMessage = 'Success!', children, className, ...props }: ActionFormProps) {
  return (
    <form
      className={className}
      {...props}
      action={async (formData) => {
        let redirectError: any = null;

        const promise = action(formData).catch((err) => {
          try {
            // Next.js 15 requires unstable_rethrow to handle NEXT_REDIRECT properly
            unstable_rethrow(err);
          } catch (rethrownErr) {
            // unstable_rethrow will THROW if it's a Next.js internal error (like redirect)
            redirectError = rethrownErr;
            return; // Resolve the promise so toast shows success
          }
          throw err;
        });
        
        await toast.promise(promise, {
          loading: 'Saving...',
          success: successMessage,
          error: (err) => err.message || 'Something went wrong',
        });

        if (redirectError) {
          throw redirectError;
        }
      }}
    >
      {children}
    </form>
  );
}
