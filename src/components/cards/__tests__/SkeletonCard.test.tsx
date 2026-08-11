import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import SkeletonCard from '../SkeletonCard';

describe('SkeletonCard', () => {
  describe('Rendering', () => {
    it('renders loading skeleton layout', () => {
      render(<SkeletonCard />);

      // Check for main container
      const mainContainer = document.querySelector('.flex.h-screen');
      expect(mainContainer).toBeInTheDocument();
    });

    it('renders sidebar skeleton', () => {
      render(<SkeletonCard />);

      // Check for sidebar
      const sidebar = document.querySelector('aside.w-55');
      expect(sidebar).toBeInTheDocument();
    });

    it('renders header skeleton', () => {
      render(<SkeletonCard />);

      // Check for header
      const header = document.querySelector('header.h-14');
      expect(header).toBeInTheDocument();
    });

    it('renders main content area', () => {
      render(<SkeletonCard />);

      // Check for main content
      const main = document.querySelector('main.flex-1');
      expect(main).toBeInTheDocument();
    });
  });

  describe('Skeleton Components', () => {
    it('renders multiple skeleton elements', () => {
      render(<SkeletonCard />);

      // Check for skeleton class usage
      const skeletons = document.querySelectorAll('.w-9, .w-16, .w-10');
      expect(skeletons.length).toBeGreaterThan(0);
    });

    it('renders user profile skeleton in sidebar', () => {
      render(<SkeletonCard />);

      // Check for user skeleton (9x9 rounded)
      const userSkeleton = document.querySelector('.w-9.h-9.rounded-lg');
      expect(userSkeleton).toBeInTheDocument();
    });

    it('renders navigation item skeletons', () => {
      render(<SkeletonCard />);

      // Should have 5 nav items
      const navItems = document.querySelectorAll('aside .flex.items-center.gap-3.px-2.py-2');
      expect(navItems.length).toBe(5);
    });

    it('renders dashboard header card skeleton', () => {
      render(<SkeletonCard />);

      // Check for dashboard header card
      const headerCard = document.querySelector('.border.rounded-xl.p-5.flex.items-center.gap-4.mb-8');
      expect(headerCard).toBeInTheDocument();
    });

    it('renders Quick Actions section skeletons', () => {
      render(<SkeletonCard />);

      // Check for Quick Actions title skeleton
      const quickActionsTitle = document.querySelector('.w-32.h-5.mb-5');
      expect(quickActionsTitle).toBeInTheDocument();

      // Check for action cards (3 cards in grid)
      const actionCards = document.querySelectorAll('.grid.grid-cols-3 > .border.rounded-xl');
      expect(actionCards.length).toBe(3);
    });

    it('renders Notices section skeletons', () => {
      render(<SkeletonCard />);

      // Check for notices title area
      const noticesSection = document.querySelectorAll('.grid.grid-cols-3.gap-4');
      expect(noticesSection.length).toBeGreaterThan(0);
    });
  });

  describe('Layout Structure', () => {
    it('has correct flex layout for sidebar and main content', () => {
      render(<SkeletonCard />);

      const container = document.querySelector('.flex.h-screen');
      expect(container).toBeInTheDocument();

      const sidebar = container?.querySelector('aside');
      expect(sidebar).toBeInTheDocument();

      const mainArea = container?.querySelector('.flex.flex-col.flex-1');
      expect(mainArea).toBeInTheDocument();
    });

    it('sidebar contains navigation and bottom links', () => {
      render(<SkeletonCard />);

      // Check for bottom links section
      const bottomLinks = document.querySelector('.mt-auto.flex.flex-col.gap-3');
      expect(bottomLinks).toBeInTheDocument();

      // Should have 2 bottom link items
      const bottomLinkItems = bottomLinks?.querySelectorAll('.flex.items-center.gap-2');
      expect(bottomLinkItems?.length).toBe(2);
    });

    it('main content has header and scrollable content', () => {
      render(<SkeletonCard />);

      const mainContainer = document.querySelector('.flex.flex-col.flex-1');
      
      // Check for header
      const header = mainContainer?.querySelector('header');
      expect(header).toBeInTheDocument();

      // Check for scrollable main content
      const main = mainContainer?.querySelector('main.flex-1.overflow-y-auto');
      expect(main).toBeInTheDocument();
    });
  });

  describe('Grid Layouts', () => {
    it('renders Quick Actions in 3-column grid', () => {
      render(<SkeletonCard />);

      const quickActionsGrid = document.querySelector('.grid.grid-cols-3.gap-4');
      expect(quickActionsGrid).toBeInTheDocument();

      const gridItems = quickActionsGrid?.children;
      expect(gridItems?.length).toBe(3);
    });

    it('renders Notices in 3-column grid', () => {
      render(<SkeletonCard />);

      const grids = document.querySelectorAll('.grid.grid-cols-3.gap-4');
      // Should have at least 2 grids (Quick Actions + Notices)
      expect(grids.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('Spacing and Padding', () => {
    it('applies correct padding to sidebar', () => {
      render(<SkeletonCard />);

      const sidebar = document.querySelector('aside.w-55');
      expect(sidebar).toHaveClass('p-4');
    });

    it('applies correct padding to header', () => {
      render(<SkeletonCard />);

      const header = document.querySelector('header.h-14');
      expect(header).toHaveClass('px-7');
    });

    it('applies correct padding to main content', () => {
      render(<SkeletonCard />);

      const main = document.querySelector('main.flex-1');
      expect(main).toHaveClass('p-8');
    });
  });

  describe('Consistent Styling', () => {
    it('uses consistent border and background colors', () => {
      render(<SkeletonCard />);

      // Check for white backgrounds
      const whiteBackgrounds = document.querySelectorAll('.bg-white');
      expect(whiteBackgrounds.length).toBeGreaterThan(0);

      // Check for borders
      const borders = document.querySelectorAll('.border');
      expect(borders.length).toBeGreaterThan(0);
    });

    it('applies rounded corners consistently', () => {
      render(<SkeletonCard />);

      // Check for rounded elements
      const roundedElements = document.querySelectorAll('.rounded-xl, .rounded-lg, .rounded');
      expect(roundedElements.length).toBeGreaterThan(0);
    });
  });
});
