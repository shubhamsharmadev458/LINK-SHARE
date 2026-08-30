'use client';

import React from 'react';
import toast from 'react-hot-toast';

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
          if (err?.message === 'NEXT_REDIRECT' || err?.digest?.startsWith('NEXT_REDIRECT')) {
            redirectError = err;
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
