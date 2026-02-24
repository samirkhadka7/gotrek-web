import { cn } from '@/lib/utils';
import { ReactNode, forwardRef } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  hover?: boolean;
  variant?: 'default' | 'elevated' | 'outlined';
  style?: React.CSSProperties;
}

const variantClasses = {
  default: 'border border-gray-100 bg-white shadow-sm',
  elevated: 'border border-gray-100 bg-white shadow-lg',
  outlined: 'border-2 border-gray-200 bg-white shadow-none',
};

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ children, className, onClick, hover = false, variant = 'default', style }, ref) => (
    <div ref={ref} onClick={onClick} style={style} className={cn(
      'rounded-2xl overflow-hidden', variantClasses[variant],
      hover && 'hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer', className
    )}>{children}</div>
  )
);
Card.displayName = 'Card';
export default Card;
export { Card };
