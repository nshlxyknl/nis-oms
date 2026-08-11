import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@/test/test-utils';
import TotalCards, { BaseItems, User } from '../cards/TotalCards';
import { Package } from 'lucide-react';

const mockItems: BaseItems[] = [
  { id: 1, name: 'Laptop', status: 'available' },
  { id: 2, name: 'Monitor', status: 'assigned' },
  { id: 3, name: 'Keyboard', status: 'maintenance' },
];

const mockUsers: User[] = [
  { id: 1, name: 'Alice Johnson', role: 'USER' },
  { id: 2, name: 'Bob Smith', role: 'ADMIN' },
];

describe('TotalCards', () => {
  it('renders all items correctly', () => {
    render(
      <TotalCards
        items={mockItems}
        title="Assets"
        icon={<Package />}
        iconBg="bg-blue-100"
        accentColor="border-blue-500"
        renderSubtitle={(item) => `ID: ${item.id}`}
      />
    );

    expect(screen.getByText('Laptop')).toBeInTheDocument();
    expect(screen.getByText('Monitor')).toBeInTheDocument();
    expect(screen.getByText('Keyboard')).toBeInTheDocument();
  });

  it('displays correct status for each item', () => {
    render(
      <TotalCards
        items={mockItems}
        title="Assets"
        icon={<Package />}
        iconBg="bg-blue-100"
        accentColor="border-blue-500"
        renderSubtitle={(item) => `ID: ${item.id}`}
      />
    );

    expect(screen.getByText('available')).toBeInTheDocument();
    expect(screen.getByText('assigned')).toBeInTheDocument();
    expect(screen.getByText('maintenance')).toBeInTheDocument();
  });

  it('calls onStatusChange when status is changed', async () => {
    const mockOnStatusChange = vi.fn();
    
    render(
      <TotalCards
        items={mockItems}
        title="Assets"
        icon={<Package />}
        iconBg="bg-blue-100"
        accentColor="border-blue-500"
        renderSubtitle={(item) => `ID: ${item.id}`}
        onStatusChange={mockOnStatusChange}
        type="asset"
      />
    );

    // Find the maintenance item and change its status back to available
    const selects = screen.getAllByRole('combobox');
    const maintenanceSelect = selects[2]; // Keyboard with maintenance status
    
    fireEvent.click(maintenanceSelect);
    
    await waitFor(() => {
      const availableOption = screen.getByText('Available', { selector: 'span' });
      fireEvent.click(availableOption);
    });

    expect(mockOnStatusChange).toHaveBeenCalledWith(3, 'available', undefined);
  });

  it('renders with custom users', () => {
    render(
      <TotalCards
        items={mockItems}
        title="Assets"
        icon={<Package />}
        iconBg="bg-blue-100"
        accentColor="border-blue-500"
        renderSubtitle={(item) => `ID: ${item.id}`}
        users={mockUsers}
      />
    );

    expect(screen.getByText('Laptop')).toBeInTheDocument();
  });

  it('applies correct styling classes', () => {
    const { container } = render(
      <TotalCards
        items={[mockItems[0]]}
        title="Assets"
        icon={<Package />}
        iconBg="bg-blue-100"
        accentColor="border-blue-500"
        renderSubtitle={(item) => `ID: ${item.id}`}
      />
    );

    const card = container.querySelector('.border-blue-500');
    expect(card).toBeInTheDocument();
  });
});
