import { describe, it, expect } from 'vitest';
import { statusColors } from '../statuscolor';

describe('statusColors', () => {
  describe('Status Color Mappings', () => {
    it('exports statusColors object', () => {
      expect(statusColors).toBeDefined();
      expect(typeof statusColors).toBe('object');
    });

    it('has correct color for online status', () => {
      expect(statusColors.online).toBe('bg-green-100 text-green-800');
    });

    it('has correct color for offline status', () => {
      expect(statusColors.offline).toBe('bg-gray-100 text-gray-800');
    });

    it('has correct color for available status', () => {
      expect(statusColors.available).toBe('bg-green-100 text-green-800');
    });

    it('has correct color for occupied status', () => {
      expect(statusColors.occupied).toBe('bg-yellow-100 text-yellow-800');
    });

    it('has correct color for maintenance status', () => {
      expect(statusColors.maintenance).toBe('bg-red-100 text-red-800');
    });

    it('has correct color for assigned status', () => {
      expect(statusColors.assigned).toBe('bg-blue-100 text-blue-800');
    });

    it('has correct color for pending status', () => {
      expect(statusColors.pending).toBe('bg-yellow-100 text-yellow-800');
    });

    it('has correct color for approved status', () => {
      expect(statusColors.approved).toBe('bg-green-100 text-green-800');
    });

    it('has correct color for rejected status', () => {
      expect(statusColors.rejected).toBe('bg-red-100 text-red-800');
    });
  });

  describe('Color Pattern Consistency', () => {
    it('all colors follow Tailwind CSS pattern', () => {
      Object.values(statusColors).forEach(color => {
        // Check if color follows "bg-{color}-{shade} text-{color}-{shade}" pattern
        expect(color).toMatch(/^bg-\w+-\d{3} text-\w+-\d{3}$/);
      });
    });

    it('uses consistent color shades (100 for bg, 800 for text)', () => {
      Object.values(statusColors).forEach(color => {
        expect(color).toMatch(/bg-\w+-100/);
        expect(color).toMatch(/text-\w+-800/);
      });
    });

    it('background and text colors match', () => {
      Object.values(statusColors).forEach(color => {
        const bgColor = color.match(/bg-(\w+)-/)?.[1];
        const textColor = color.match(/text-(\w+)-/)?.[1];
        expect(bgColor).toBe(textColor);
      });
    });
  });

  describe('Status Categories', () => {
    it('has positive statuses with green colors', () => {
      const positiveStatuses = ['online', 'available', 'approved'];
      positiveStatuses.forEach(status => {
        expect(statusColors[status]).toContain('green');
      });
    });

    it('has warning/pending statuses with yellow colors', () => {
      const warningStatuses = ['occupied', 'pending'];
      warningStatuses.forEach(status => {
        expect(statusColors[status]).toContain('yellow');
      });
    });

    it('has negative/error statuses with red colors', () => {
      const negativeStatuses = ['maintenance', 'rejected'];
      negativeStatuses.forEach(status => {
        expect(statusColors[status]).toContain('red');
      });
    });

    it('has neutral statuses with gray colors', () => {
      const neutralStatuses = ['offline'];
      neutralStatuses.forEach(status => {
        expect(statusColors[status]).toContain('gray');
      });
    });

    it('has info statuses with blue colors', () => {
      const infoStatuses = ['assigned'];
      infoStatuses.forEach(status => {
        expect(statusColors[status]).toContain('blue');
      });
    });
  });

  describe('Object Structure', () => {
    it('has exactly 9 status mappings', () => {
      const keys = Object.keys(statusColors);
      expect(keys.length).toBe(9);
    });

    it('contains all expected status keys', () => {
      const expectedKeys = [
        'online',
        'offline',
        'available',
        'occupied',
        'maintenance',
        'assigned',
        'pending',
        'approved',
        'rejected',
      ];
      
      expectedKeys.forEach(key => {
        expect(statusColors).toHaveProperty(key);
      });
    });

    it('all values are non-empty strings', () => {
      Object.values(statusColors).forEach(value => {
        expect(typeof value).toBe('string');
        expect(value.length).toBeGreaterThan(0);
      });
    });

    it('can be accessed with bracket notation', () => {
      expect(statusColors['online']).toBe('bg-green-100 text-green-800');
      expect(statusColors['pending']).toBe('bg-yellow-100 text-yellow-800');
    });

    it('can be accessed with dot notation', () => {
      expect(statusColors.online).toBe('bg-green-100 text-green-800');
      expect(statusColors.pending).toBe('bg-yellow-100 text-yellow-800');
    });
  });

  describe('Usage Scenarios', () => {
    it('can be used in className assignments', () => {
      const status = 'approved';
      const className = statusColors[status];
      expect(className).toBe('bg-green-100 text-green-800');
    });

    it('handles dynamic status lookup', () => {
      const statuses = ['online', 'offline', 'pending'];
      statuses.forEach(status => {
        const color = statusColors[status];
        expect(color).toBeDefined();
        expect(typeof color).toBe('string');
      });
    });

    it('can be iterated over', () => {
      const entries = Object.entries(statusColors);
      expect(entries.length).toBeGreaterThan(0);
      
      entries.forEach(([status, color]) => {
        expect(typeof status).toBe('string');
        expect(typeof color).toBe('string');
      });
    });
  });

  describe('Type Safety', () => {
    it('status keys are strings', () => {
      Object.keys(statusColors).forEach(key => {
        expect(typeof key).toBe('string');
      });
    });

    it('status values are strings', () => {
      Object.values(statusColors).forEach(value => {
        expect(typeof value).toBe('string');
      });
    });
  });
});
