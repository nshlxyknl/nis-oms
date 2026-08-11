import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@/test/test-utils';
import UserOverview from '../UserOverview';

// Mock child components
vi.mock('../cards/StatusCard', () => ({
  default: () => <div data-testid="status-card">StatusCard</div>,
}));

vi.mock('../cards/FeaturesCard', () => ({
  default: () => <div data-testid="features-card">FeaturesCard</div>,
}));

vi.mock('../cards/NoticeCard', () => ({
  default: () => <div data-testid="notice-card">NoticeCard</div>,
}));

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

  describe('Child Components', () => {
    it('renders StatusCard component', () => {
      render(<UserOverview />);

      const statusCard = screen.getByTestId('status-card');
      expect(statusCard).toBeInTheDocument();
    });

    it('renders FeaturesCard component', () => {
      render(<UserOverview />);

      const featuresCard = screen.getByTestId('features-card');
      expect(featuresCard).toBeInTheDocument();
    });

    it('renders NoticeCard component', () => {
      render(<UserOverview />);

      const noticeCard = screen.getByTestId('notice-card');
      expect(noticeCard).toBeInTheDocument();
    });

    it('renders components in correct order', () => {
      const { container } = render(<UserOverview />);

      const cards = container.querySelectorAll('[data-testid]');
      expect(cards[0]).toHaveAttribute('data-testid', 'status-card');
      expect(cards[1]).toHaveAttribute('data-testid', 'features-card');
      expect(cards[2]).toHaveAttribute('data-testid', 'notice-card');
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
    it('all child components are present', () => {
      render(<UserOverview />);

      expect(screen.getByTestId('status-card')).toBeInTheDocument();
      expect(screen.getByTestId('features-card')).toBeInTheDocument();
      expect(screen.getByTestId('notice-card')).toBeInTheDocument();
    });
  });
});
