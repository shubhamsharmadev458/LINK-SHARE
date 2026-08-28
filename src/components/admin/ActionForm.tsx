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
        const promise = action(formData);
        
        toast.promise(promise, {
          loading: 'Saving...',
          success: successMessage,
          error: (err) => err.message || 'Something went wrong',
        });
      }}
    >
      {children}
    </form>
  );
}
