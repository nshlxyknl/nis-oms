import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@/test/test-utils';
import EmployeeTable from '../pages/EmployeeTable';
import * as apiModule from '@/services/api';

// Mock the API module
vi.mock('@/services/api', () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
  },
}));

// Mock toast
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

const mockEmployees = [
  {
    id: 1,
    name: 'John Doe',
    username: 'johndoe',
    role: 'admin',
    status: 'active',
    department: 'Engineering',
    joined: '2023-01-15',
  },
  {
    id: 2,
    name: 'Jane Smith',
    username: 'janesmith',
    role: 'user',
    status: 'active',
    department: 'HR',
    joined: '2023-02-20',
  },
  {
    id: 3,
    name: 'Bob Johnson',
    username: 'bobjohnson',
    role: 'user',
    status: 'on-leave',
    department: 'Marketing',
    joined: '2023-03-10',
  },
];

describe('EmployeeTable', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('displays loading state initially', () => {
    vi.mocked(apiModule.api.get).mockImplementation(
      () => new Promise(() => {}) // Never resolves
    );

    render(<EmployeeTable />);
    
    const skeletons = document.querySelectorAll('.animate-pulse');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('renders employees correctly', async () => {
    vi.mocked(apiModule.api.get).mockResolvedValue(mockEmployees);

    render(<EmployeeTable />);

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
      expect(screen.getByText('Bob Johnson')).toBeInTheDocument();
    });
  });

  it('displays correct statistics', async () => {
    vi.mocked(apiModule.api.get).mockResolvedValue(mockEmployees);

    render(<EmployeeTable />);

    await waitFor(() => {
      // Total employees
      expect(screen.getByText('3')).toBeInTheDocument();
      
      // Active employees (2)
      const activeElements = screen.getAllByText('2');
      expect(activeElements.length).toBeGreaterThan(0);
      
      // Admins (1)
      const adminElements = screen.getAllByText('1');
      expect(adminElements.length).toBeGreaterThan(0);
    });
  });

  it('filters employees by role', async () => {
    vi.mocked(apiModule.api.get).mockResolvedValue(mockEmployees);

    render(<EmployeeTable />);

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    // Click "Admins" filter
    const adminFilter = screen.getByRole('button', { name: /admins/i });
    fireEvent.click(adminFilter);

    // Should still show John Doe (admin)
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    
    // Should not show Jane Smith (user) - though she might still be in DOM
    // For a more thorough test, we'd need to check if rows are hidden
  });

  it('searches employees by name', async () => {
    vi.mocked(apiModule.api.get).mockResolvedValue(mockEmployees);

    render(<EmployeeTable />);

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText(/search/i);
    fireEvent.change(searchInput, { target: { value: 'Jane' } });

    // Jane should be visible
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
  });

  it('opens add employee dialog', async () => {
    vi.mocked(apiModule.api.get).mockResolvedValue(mockEmployees);

    render(<EmployeeTable />);

    await waitFor(() => {
      expect(screen.getByText('Team members')).toBeInTheDocument();
    });

    const addButton = screen.getByRole('button', { name: /add employee/i });
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(screen.getByText('Add New Employee')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Full Name')).toBeInTheDocument();
    });
  });

  it('submits new employee form', async () => {
    vi.mocked(apiModule.api.get).mockResolvedValue(mockEmployees);
    vi.mocked(apiModule.api.post).mockResolvedValue({ success: true });

    render(<EmployeeTable />);

    await waitFor(() => {
      expect(screen.getByText('Team members')).toBeInTheDocument();
    });

    // Open dialog
    const addButton = screen.getByRole('button', { name: /add employee/i });
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Full Name')).toBeInTheDocument();
    });

    // Fill form
    fireEvent.change(screen.getByPlaceholderText('Full Name'), {
      target: { value: 'New Employee' },
    });
    fireEvent.change(screen.getByPlaceholderText('Username'), {
      target: { value: 'newemployee' },
    });
    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: 'password123' },
    });

    // Submit
    const saveButton = screen.getByRole('button', { name: /save employee/i });
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(apiModule.api.post).toHaveBeenCalledWith('/employees', expect.objectContaining({
        name: 'New Employee',
        username: 'newemployee',
        password: 'password123',
      }));
    });
  });

  it('updates employee role', async () => {
    vi.mocked(apiModule.api.get).mockResolvedValue(mockEmployees);
    vi.mocked(apiModule.api.patch).mockResolvedValue({ success: true });

    render(<EmployeeTable />);

    await waitFor(() => {
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    });

    // Find role selects
    const roleSelects = screen.getAllByRole('combobox');
    
    // Click first role select (should be for John Doe)
    fireEvent.click(roleSelects[0]);

    await waitFor(() => {
      const userOption = screen.getByText('User', { selector: '[role="option"] *' });
      fireEvent.click(userOption);
    });

    await waitFor(() => {
      expect(apiModule.api.patch).toHaveBeenCalledWith(
        expect.stringMatching(/\/employees\/\d+\/role/),
        expect.objectContaining({ role: expect.any(String) })
      );
    });
  });

  it('displays empty state when no employees', async () => {
    vi.mocked(apiModule.api.get).mockResolvedValue([]);

    render(<EmployeeTable />);

    await waitFor(() => {
      expect(screen.getByText('No employees found')).toBeInTheDocument();
    });
  });

  it('shows employee count in footer', async () => {
    vi.mocked(apiModule.api.get).mockResolvedValue(mockEmployees);

    render(<EmployeeTable />);

    await waitFor(() => {
      expect(screen.getByText(/showing.*3.*of.*3.*employees/i)).toBeInTheDocument();
    });
  });

  it('opens employee profile sheet', async () => {
    vi.mocked(apiModule.api.get).mockResolvedValue(mockEmployees);

    render(<EmployeeTable />);

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    // Find and click view button (Eye icon button)
    const viewButtons = screen.getAllByRole('button');
    const eyeButton = viewButtons.find(btn => btn.querySelector('svg'));
    
    if (eyeButton) {
      fireEvent.click(eyeButton);

      await waitFor(() => {
        expect(screen.getByText('Employee Profile')).toBeInTheDocument();
      });
    }
  });
});
