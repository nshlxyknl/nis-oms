import { describe, it, expect } from 'vitest';
import { render } from '@/test/test-utils';
import UserOverview from '../UserOverview';

describe('UserOverview', () => {
  describe('Rendering', () => {
    it('renders the user overview page', () => {
      render(<UserOverview />);

      const main = document.querySelector('main');
      expect(main).toBeInTheDocument();
    });

    it('renders within main container with correct styling', () => {
      render(<UserOverview />);

      const main = document.querySelector('main.w-full');
      expect(main).toBeInTheDocument();
      expect(main).toHaveClass('mx-auto', 'px-6', 'py-8');
    });
  });

  describe('Layout Structure', () => {
    it('uses semantic HTML', () => {
      render(<UserOverview />);

      const main = document.querySelector('main');
      expect(main).toBeInTheDocument();
      expect(main?.tagName).toBe('MAIN');
    });

    it('applies correct spacing classes', () => {
      render(<UserOverview />);

      const main = document.querySelector('main');
      expect(main).toHaveClass('px-6', 'py-8');
    });

    it('has full width and centered layout', () => {
      render(<UserOverview />);

      const main = document.querySelector('main');
      expect(main).toHaveClass('w-full', 'mx-auto');
    });
  });

  describe('Component Integration', () => {
    it('renders child components within main', () => {
      const { container } = render(<UserOverview />);

      const main = container.querySelector('main');
      expect(main).toBeInTheDocument();
      expect(main?.children.length).toBeGreaterThan(0);
    });
  });
});
