'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface ModalProps { isOpen?: boolean; open?: boolean; onClose: () => void; title: string; children: ReactNode; size?: 'sm' | 'md' | 'lg' | 'xl'; }

const sizeClasses = { sm: 'max-w-sm', md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-4xl' };

export default function Modal({ isOpen, open: openProp, onClose, title, children, size = 'md' }: ModalProps) {
  const isVisible = isOpen ?? openProp ?? false;
  return (
    <Dialog.Root open={isVisible} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm animate-overlayShow" />
        <Dialog.Content className={cn(
          'fixed left-1/2 top-1/2 z-50 w-full -translate-x-1/2 -translate-y-1/2',
          sizeClasses[size],
          'rounded-2xl bg-white p-0 shadow-2xl max-h-[85vh] overflow-hidden animate-contentShow focus:outline-none'
        )}>
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <Dialog.Title className="text-lg font-semibold text-gray-900">{title}</Dialog.Title>
            <Dialog.Close asChild>
              <button className="rounded-lg p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors" aria-label="Close">
                <X className="h-4 w-4" />
              </button>
            </Dialog.Close>
          </div>
          <Dialog.Description className="sr-only">{title}</Dialog.Description>
          <div className="px-6 py-4 overflow-y-auto max-h-[calc(85vh-4rem)]">{children}</div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
