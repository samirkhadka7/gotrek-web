/**
 * Frontend Unit Tests — 30 Test Cases
 * Covers: utils, schemas, services, hooks, and UI components
 */
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

// =============================================
// 1. UTILITY FUNCTIONS (tests 1–8)
// =============================================
import { cn, formatDate, formatDateTime, timeAgo, truncate, formatDuration, getDifficultyColor, getStatusColor } from '@/lib/utils';

describe('Utility Functions', () => {
  it('1. cn() merges class names correctly', () => {
    expect(cn('px-2', 'py-2')).toBe('px-2 py-2');
  });

  it('2. cn() resolves conflicting Tailwind classes', () => {
    const result = cn('px-2', 'px-4');
    expect(result).toBe('px-4');
  });

  it('3. formatDate() formats a valid ISO date', () => {
    const result = formatDate('2025-06-15T00:00:00.000Z');
    expect(result).toMatch(/Jun/);
    expect(result).toMatch(/15/);
    expect(result).toMatch(/2025/);
  });

  it('4. formatDate() returns empty string for undefined', () => {
    expect(formatDate(undefined)).toBe('');
  });

  it('5. formatDateTime() includes time in output', () => {
    const result = formatDateTime('2025-06-15T14:30:00.000Z');
    expect(result).toMatch(/Jun/);
    expect(result).toMatch(/15/);
  });

  it('6. timeAgo() returns "just now" for recent dates', () => {
    const now = new Date().toISOString();
    expect(timeAgo(now)).toBe('just now');
  });

  it('7. truncate() shortens strings beyond the limit', () => {
    expect(truncate('Hello World', 5)).toBe('Hello...');
  });

  it('8. truncate() keeps strings within limit unchanged', () => {
    expect(truncate('Hi', 10)).toBe('Hi');
  });
});

describe('formatDuration()', () => {
  it('9. returns range string for object input', () => {
    expect(formatDuration({ min: 3, max: 5 })).toBe('3-5h');
  });

  it('10. returns empty string for null input', () => {
    expect(formatDuration(null)).toBe('');
  });

  it('11. returns string as-is for string input', () => {
    expect(formatDuration('2 days')).toBe('2 days');
  });
});

describe('getDifficultyColor()', () => {
  it('12. returns "success" for Easy', () => {
    expect(getDifficultyColor('Easy')).toBe('success');
  });

  it('13. returns "danger" for Hard', () => {
    expect(getDifficultyColor('Hard')).toBe('danger');
  });
});

describe('getStatusColor()', () => {
  it('14. returns correct classes for "upcoming"', () => {
    expect(getStatusColor('upcoming')).toContain('blue');
  });

  it('15. returns correct classes for "completed"', () => {
    expect(getStatusColor('completed')).toContain('gray');
  });
});

// =============================================
// 2. VALIDATION SCHEMAS (tests 16–21)
// =============================================
import { loginSchema, registerSchema } from '@/schemas/auth.schema';

describe('loginSchema', () => {
  it('16. validates correct login data', () => {
    const result = loginSchema.safeParse({ email: 'user@test.com', password: 'password123' });
    expect(result.success).toBe(true);
  });

  it('17. rejects invalid email', () => {
    const result = loginSchema.safeParse({ email: 'not-an-email', password: 'password123' });
    expect(result.success).toBe(false);
  });

  it('18. rejects short password', () => {
    const result = loginSchema.safeParse({ email: 'user@test.com', password: '12' });
    expect(result.success).toBe(false);
  });

  it('19. rejects empty email', () => {
    const result = loginSchema.safeParse({ email: '', password: 'password123' });
    expect(result.success).toBe(false);
  });
});

describe('registerSchema', () => {
  it('20. validates correct registration data', () => {
    const result = registerSchema.safeParse({
      name: 'John Doe', email: 'john@test.com', password: 'password123',
    });
    expect(result.success).toBe(true);
  });

  it('21. rejects name shorter than 2 chars', () => {
    const result = registerSchema.safeParse({
      name: 'J', email: 'j@test.com', password: 'password123',
    });
    expect(result.success).toBe(false);
  });
});

// =============================================
// 3. API SERVICE (tests 22–23)
// =============================================
import api, { getImageUrl } from '@/services/api';

describe('getImageUrl()', () => {
  it('22. returns empty string for empty path', () => {
    expect(getImageUrl('')).toBe('');
  });

  it('23. returns full URL for http paths', () => {
    const url = 'https://example.com/img.jpg';
    expect(getImageUrl(url)).toBe(url);
  });
});

// =============================================
// 4. UI COMPONENTS (tests 24–30)
// =============================================
import Badge from '@/components/ui/Badge';
import Spinner from '@/components/ui/Spinner';
import EmptyState from '@/components/ui/EmptyState';
import Pagination from '@/components/ui/Pagination';

describe('Badge Component', () => {
  it('24. renders children text', () => {
    render(<Badge>Active</Badge>);
    expect(screen.getByText('Active')).toBeInTheDocument();
  });

  it('25. renders with dot when dot prop is true', () => {
    const { container } = render(<Badge dot>Status</Badge>);
    const dot = container.querySelector('span span');
    expect(dot).toBeInTheDocument();
  });
});

describe('Spinner Component', () => {
  it('26. renders spinner element', () => {
    const { container } = render(<Spinner />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('27. applies custom className', () => {
    const { container } = render(<Spinner className="mt-4" />);
    const wrapper = container.firstElementChild;
    expect(wrapper?.className).toContain('mt-4');
  });
});

describe('EmptyState Component', () => {
  it('28. renders title and description', () => {
    render(<EmptyState title="No trails" description="Start exploring" />);
    expect(screen.getByText('No trails')).toBeInTheDocument();
    expect(screen.getByText('Start exploring')).toBeInTheDocument();
  });

  it('29. renders action button with label', () => {
    const mockClick = jest.fn();
    render(<EmptyState title="Empty" action={{ label: 'Add', onClick: mockClick }} />);
    const btn = screen.getByText('Add');
    expect(btn).toBeInTheDocument();
    fireEvent.click(btn);
    expect(mockClick).toHaveBeenCalled();
  });
});

describe('Pagination Component', () => {
  it('30. renders page buttons and calls onPageChange', () => {
    const mockChange = jest.fn();
    render(<Pagination currentPage={1} totalPages={5} onPageChange={mockChange} />);
    const page2 = screen.getByText('2');
    fireEvent.click(page2);
    expect(mockChange).toHaveBeenCalledWith(2);
  });
});
