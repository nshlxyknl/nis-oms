import { describe, it, expect } from 'vitest';
import { cn } from '../utils';

describe('utils', () => {
  describe('cn function', () => {
    it('merges class names correctly', () => {
      const result = cn('text-red-500', 'bg-blue-500');
      expect(result).toBe('text-red-500 bg-blue-500');
    });

    it('handles conditional classes with clsx', () => {
      const result = cn('base-class', true && 'conditional-class', false && 'hidden-class');
      expect(result).toContain('base-class');
      expect(result).toContain('conditional-class');
      expect(result).not.toContain('hidden-class');
    });

    it('merges Tailwind classes with twMerge', () => {
      const result = cn('p-4', 'p-8');
      // twMerge should keep only the last padding class
      expect(result).toBe('p-8');
    });

    it('handles conflicting Tailwind classes', () => {
      const result = cn('text-red-500', 'text-blue-500');
      // Should keep only the last color
      expect(result).toBe('text-blue-500');
    });

    it('preserves non-conflicting classes', () => {
      const result = cn('text-red-500', 'bg-blue-500', 'p-4');
      expect(result).toContain('text-red-500');
      expect(result).toContain('bg-blue-500');
      expect(result).toContain('p-4');
    });

    it('handles arrays of classes', () => {
      const result = cn(['text-red-500', 'bg-blue-500'], 'p-4');
      expect(result).toContain('text-red-500');
      expect(result).toContain('bg-blue-500');
      expect(result).toContain('p-4');
    });

    it('handles objects with boolean values', () => {
      const result = cn({
        'text-red-500': true,
        'bg-blue-500': false,
        'p-4': true,
      });
      expect(result).toContain('text-red-500');
      expect(result).not.toContain('bg-blue-500');
      expect(result).toContain('p-4');
    });

    it('handles undefined and null values', () => {
      const result = cn('text-red-500', undefined, null, 'bg-blue-500');
      expect(result).toBe('text-red-500 bg-blue-500');
    });

    it('handles empty strings', () => {
      const result = cn('text-red-500', '', 'bg-blue-500');
      expect(result).toBe('text-red-500 bg-blue-500');
    });

    it('handles complex Tailwind class conflicts', () => {
      const result = cn('px-4 py-2', 'p-8');
      // twMerge should resolve padding conflicts
      expect(result).toBe('p-8');
    });

    it('handles responsive and state variants', () => {
      const result = cn('hover:text-red-500', 'md:text-blue-500');
      expect(result).toContain('hover:text-red-500');
      expect(result).toContain('md:text-blue-500');
    });

    it('handles multiple conflicting responsive classes', () => {
      const result = cn('text-sm', 'md:text-base', 'lg:text-lg');
      expect(result).toContain('text-sm');
      expect(result).toContain('md:text-base');
      expect(result).toContain('lg:text-lg');
    });

    it('returns empty string when no arguments', () => {
      const result = cn();
      expect(result).toBe('');
    });

    it('handles mixed types of inputs', () => {
      const result = cn(
        'base-class',
        { 'conditional-class': true },
        ['array-class-1', 'array-class-2'],
        undefined,
        'final-class'
      );
      expect(result).toContain('base-class');
      expect(result).toContain('conditional-class');
      expect(result).toContain('array-class-1');
      expect(result).toContain('array-class-2');
      expect(result).toContain('final-class');
    });

    it('handles dark mode classes', () => {
      const result = cn('bg-white', 'dark:bg-black');
      expect(result).toContain('bg-white');
      expect(result).toContain('dark:bg-black');
    });

    it('handles arbitrary values', () => {
      const result = cn('text-[#ff0000]', 'bg-[rgb(0,0,255)]');
      expect(result).toContain('text-[#ff0000]');
      expect(result).toContain('bg-[rgb(0,0,255)]');
    });

    it('resolves important modifier conflicts', () => {
      const result = cn('!text-red-500', '!text-blue-500');
      expect(result).toBe('!text-blue-500');
    });

    it('handles peer and group modifiers', () => {
      const result = cn('peer-hover:text-red-500', 'group-hover:bg-blue-500');
      expect(result).toContain('peer-hover:text-red-500');
      expect(result).toContain('group-hover:bg-blue-500');
    });
  });
});
