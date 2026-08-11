import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@/test/test-utils';
import AdminOverview from '../AdminOverview';

// Mock child components
vi.mock('../cards/FeaturesCard', () => ({
  default: () => <div data-testid="features-card">FeaturesCard</div>,
}));

vi.mock('../cards/NoticeCard', () => ({
  default: () => <div data-testid="notice-card">NoticeCard</div>,
}));

describe('AdminOverview', () => {
  describe('Rendering', () => {
    it('renders the admin overview page', () => {
      render(<AdminOverview />);

      expect(screen.getByText('Admin Dashboard')).toBeInTheDocument();
    });

    it('displays admin dashboard header with icon', () => {
      render(<AdminOverview />);

      const header = screen.getByText('Admin Dashboard');
      expect(header).toBeInTheDocument();
      expect(header).toHaveClass('text-xl', 'font-display', 'font-bold');
    });

    it('displays dashboard description', () => {
      render(<AdminOverview />);

      const description = screen.getByText('Manage approvals, employees, rooms and assets.');
      expect(description).toBeInTheDocument();
      expect(description).toHaveClass('text-sm', 'text-muted-foreground');
    });

    it('renders within main container with correct styling', () => {
      render(<AdminOverview />);

      const main = document.querySelector('main.w-full');
      expect(main).toBeInTheDocument();
      expect(main).toHaveClass('mx-auto', 'px-6', 'py-8');
    });
  });

  describe('Child Components', () => {
    it('renders FeaturesCard component', () => {
      render(<AdminOverview />);

      const featuresCard = screen.getByTestId('features-card');
      expect(featuresCard).toBeInTheDocument();
    });

    it('renders NoticeCard component', () => {
      render(<AdminOverview />);

      const noticeCard = screen.getByTestId('notice-card');
      expect(noticeCard).toBeInTheDocument();
    });
  });

  describe('Layout Structure', () => {
    it('renders header card with correct styling', () => {
      render(<AdminOverview />);

      const headerCard = document.querySelector('.rounded-xl.border.border-border.bg-card');
      expect(headerCard).toBeInTheDocument();
      expect(headerCard).toHaveClass('p-5', 'mb-8');
    });

    it('displays icon container with correct styling', () => {
      render(<AdminOverview />);

      const iconContainer = document.querySelector('.w-12.h-12.rounded-xl');
      expect(iconContainer).toBeInTheDocument();
      expect(iconContainer).toHaveClass('bg-primary\\/10');
    });

    it('uses flex layout for header content', () => {
      render(<AdminOverview />);

      const headerCard = document.querySelector('.rounded-xl.border.border-border.bg-card');
      expect(headerCard).toHaveClass('flex', 'items-center', 'gap-4');
    });
  });

  describe('Typography', () => {
    it('uses correct heading styles', () => {
      render(<AdminOverview />);

      const heading = screen.getByText('Admin Dashboard');
      expect(heading.tagName).toBe('H1');
    });

    it('uses correct description styles', () => {
      render(<AdminOverview />);

      const description = screen.getByText('Manage approvals, employees, rooms and assets.');
      expect(description.tagName).toBe('P');
      expect(description).toHaveClass('mt-0.5');
    });
  });

  describe('Accessibility', () => {
    it('has semantic HTML structure', () => {
      render(<AdminOverview />);

      const main = document.querySelector('main');
      expect(main).toBeInTheDocument();

      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toHaveTextContent('Admin Dashboard');
    });

    it('header text is readable', () => {
      render(<AdminOverview />);

      const heading = screen.getByText('Admin Dashboard');
      expect(heading).toBeVisible();
    });
  });
});
