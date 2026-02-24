import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';

const badgeVariants = cva(
  'inline-flex items-center gap-1 rounded-full font-semibold transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-gray-50 text-gray-700 border border-gray-200',
        success: 'bg-green-50 text-green-700 border border-green-200',
        warning: 'bg-amber-50 text-amber-700 border border-amber-200',
        danger: 'bg-red-50 text-red-700 border border-red-200',
        info: 'bg-blue-50 text-blue-700 border border-blue-200',
      },
      size: {
        sm: 'px-2 py-0.5 text-[10px]',
        md: 'px-2.5 py-0.5 text-xs',
      },
    },
    defaultVariants: { variant: 'default', size: 'md' },
  }
);

interface BadgeProps extends VariantProps<typeof badgeVariants> {
  children: React.ReactNode;
  className?: string;
  dot?: boolean;
}

export default function Badge({ children, className, variant = 'default', size = 'md', dot }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant, size }), className)}>
      {dot && <span className="w-1.5 h-1.5 rounded-full bg-current" />}
      {children}
    </span>
  );
}
