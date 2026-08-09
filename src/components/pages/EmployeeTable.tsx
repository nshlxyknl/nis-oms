'use client';

import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Eye } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type EmployeeRole   = 'admin' | 'user';
type EmployeeStatus = 'active' | 'inactive' | 'on-leave';
type FilterType     = 'all' | EmployeeRole | EmployeeStatus;

interface Employee {
  id:         number;
  name:       string;
  username:   string;
  role:       EmployeeRole;
  status:     EmployeeStatus;
  department: string;
  joined:     string;
}

// ─── Helper Functions ─────────────────────────────────────────────────────────

function getInitials(name: string): string {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}

function getAvatarColors(name: string) {
  const colors = [
    { bg: '#E1F5EE', tc: '#085041' },
    { bg: '#E6F1FB', tc: '#0C447C' },
    { bg: '#FAEEDA', tc: '#633806' },
    { bg: '#EEEDFE', tc: '#3C3489' },
    { bg: '#FAECE7', tc: '#712B13' },
    { bg: '#FBEAF0', tc: '#72243E' },
  ];
  const index = name.charCodeAt(0) % colors.length;
  return colors[index];
}

const FILTERS: { label: string; value: FilterType }[] = [
  { label: 'All',       value: 'all'      },
  { label: 'Admins',    value: 'admin'    },
  { label: 'Users',     value: 'user'     },
  { label: 'Active',    value: 'active'   },
  { label: 'On leave',  value: 'on-leave' },
  { label: 'Inactive',  value: 'inactive' },
];

export default function EmployeeTable() {
  const queryClient = useQueryClient();
  const [search, setSearch]             = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [open, setOpen]                 = useState(false);
  const [profileEmployee, setProfileEmployee] = useState<Employee | null>(null);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    name: '',
    role: 'USER' as 'ADMIN' | 'USER',
    department: '',
  });

  // Fetch employees
  const { data: employees = [], isLoading } = useQuery({
    queryKey: ['employees'],
    queryFn: () => api.get('/employees'),
  });

  // Create employee mutation
  const createMutation = useMutation({
    mutationFn: (data: typeof formData) => api.post('/employees', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      toast.success('Employee added successfully');
      setOpen(false);
      setFormData({ username: '', password: '', name: '', role: 'USER', department: '' });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to add employee');
    },
  });

  // Update role mutation
  const updateRoleMutation = useMutation({
    mutationFn: ({ id, role }: { id: number; role: string }) => 
      api.patch(`/employees/${id}/role`, { role: role.toUpperCase() }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      toast.success('Role updated successfully');
    },
    onError: () => toast.error('Failed to update role'),
  });

  // Update status mutation
  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) => 
      api.patch(`/employees/${id}/status`, { status: status.toUpperCase().replace('-', '_') }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      toast.success('Status updated successfully');
    },
    onError: () => toast.error('Failed to update status'),
  });

  const handleRoleChange = (id: number, newRole: EmployeeRole) => {
    updateRoleMutation.mutate({ id, role: newRole });
  };

  const handleStatusChange = (id: number, newStatus: EmployeeStatus) => {
    updateStatusMutation.mutate({ id, status: newStatus });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    createMutation.mutate(formData);
  };

  const filtered = useMemo(() => {
    return employees.filter((e: Employee) => {
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        e.name.toLowerCase().includes(q) ||
        e.department.toLowerCase().includes(q);
      const matchFilter =
        activeFilter === 'all' ||
        e.role === activeFilter ||
        e.status === activeFilter;
      return matchSearch && matchFilter;
    });
  }, [search, activeFilter, employees]);

  const stats = useMemo(() => ({
    total:   employees.length,
    active:  employees.filter((e: Employee) => e.status === 'active').length,
    admins:  employees.filter((e: Employee) => e.role === 'admin').length,
    onLeave: employees.filter((e: Employee) => e.status === 'on-leave').length,
  }), [employees]);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6 p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="h-6 w-48 bg-muted animate-pulse rounded" />
            <div className="h-4 w-64 bg-muted animate-pulse rounded" />
          </div>
          <div className="h-10 w-32 bg-muted animate-pulse rounded" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-muted rounded-lg px-4 py-3 animate-pulse h-20" />
          ))}
        </div>
        <div className="border border-border rounded-xl p-4 space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-16 bg-muted animate-pulse rounded" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-6">

      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-medium text-foreground">Team members</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Manage employees and their access levels
          </p>
        </div>
        <button className="px-4 py-2 text-sm font-medium bg-foreground text-background rounded-md cursor-pointer" onClick={() => setOpen(true)}>
          + Add employee
        </button>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Employee</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input 
              placeholder="Full Name" 
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              required
            />
            <Input 
              placeholder="Username" 
              value={formData.username}
              onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
              required
            />
            <Input 
              type="password"
              placeholder="Password (min 6 characters)" 
              value={formData.password}
              onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
              required
              minLength={6}
            />
            <Input 
              placeholder="Department (optional)" 
              value={formData.department}
              onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
            />
            <Select 
              value={formData.role} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, role: value as 'ADMIN' | 'USER' }))}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="USER">User</SelectItem>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <Button 
              type="submit" 
              className="w-full bg-primary text-white rounded-md p-2"
              disabled={createMutation.isPending}
            >
              {createMutation.isPending ? 'Saving...' : 'Save Employee'}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {[
          { label: 'Total employees', value: stats.total   },
          { label: 'Active',          value: stats.active  },
          { label: 'Admins',          value: stats.admins  },
          { label: 'On leave',        value: stats.onLeave },
        ].map((s: { label: string; value: number }) => (
          <div key={s.label} className="bg-muted rounded-lg px-4 py-3">
            <p className="text-xs text-muted-foreground mb-1">{s.label}</p>
            <p className="text-2xl font-medium text-foreground">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex gap-1.5 flex-wrap">
          {FILTERS.map((f: { label: string; value: FilterType }) => (
            <button
              key={f.value}
              onClick={() => setActiveFilter(f.value)}
              className={`px-3 py-1 text-xs rounded-full border transition-colors cursor-pointer ${
                activeFilter === f.value
                  ? 'bg-foreground text-background border-transparent'
                  : 'border-border text-muted-foreground hover:text-foreground'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-3 py-1.5 text-sm border border-border rounded-md bg-background text-foreground w-44 focus:outline-none focus:ring-1 focus:ring-border"
        />
      </div>

      {/* Table */}
      <div className="border border-border rounded-xl overflow-hidden">
        <table className="w-full text-sm" style={{ tableLayout: 'fixed' }}>
          <thead>
            <tr className="border-b border-border">
              {[
                { label: 'Employee', width: '28%' },
                { label: 'Role',     width: '18%' },
                { label: 'Status',   width: '18%' },
                { label: '',         width: '8%'  },
              ].map((h: { label: string; width: string }, i: number) => (
                <th
                  key={i}
                  style={{ width: h.width }}
                  className="px-4 py-2.5 text-left text-[11px] font-medium text-muted-foreground uppercase tracking-wide"
                >
                  {h.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-12 text-sm text-muted-foreground">
                  No employees found
                </td>
              </tr>
            ) : (
              filtered.map((e: Employee) => {
                const initials = getInitials(e.name);
                const colors = getAvatarColors(e.name);
                
                return (
                <tr key={e.id} className="border-t border-border hover:bg-muted/40 transition-colors">

                  {/* Employee */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-medium shrink-0"
                        style={{ background: colors.bg, color: colors.tc }}
                      >
                        {initials}
                      </div>
                      <div>
                        <p className="font-medium text-[13px] text-foreground">{e.name}</p>
                        <p className="text-[11px] text-muted-foreground">{e.department}</p>
                      </div>
                    </div>
                  </td>

                  {/* Role */}
                  <td className="px-4 py-3">
                    <Select
                      value={e.role}
                      onValueChange={(value) => handleRoleChange(e.id, value as EmployeeRole)}
                    >
                      <SelectTrigger className="h-7 text-xs w-28">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Change role</SelectLabel>
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="user">User</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </td>

                  {/* Status */}
                  <td className="px-4 py-3">
                    <Select
                      value={e.status}
                      onValueChange={(value) => handleStatusChange(e.id, value as EmployeeStatus)}
                    >
                      <SelectTrigger className="h-7 text-xs w-28">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Change status</SelectLabel>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="on-leave">On leave</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </td>

                  {/* View */}
                  <td className="px-4 py-3">
                    <button
                      onClick={() => setProfileEmployee(e)}
                      className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              )})
            )}
          </tbody>
        </table>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-border text-xs text-muted-foreground">
          Showing {filtered.length} of {employees.length} employees
        </div>
      </div>

      {/* Profile sheet */}
      <Sheet open={!!profileEmployee} onOpenChange={(o) => !o && setProfileEmployee(null)}>
        <SheetContent side="right" className="w-80">
          <SheetHeader>
            <SheetTitle>Employee Profile</SheetTitle>
          </SheetHeader>
          {profileEmployee && (
            <div className="mt-6 flex flex-col gap-5">
              {/* Avatar */}
              <div className="flex flex-col items-center gap-3">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center text-lg font-semibold"
                  style={{ 
                    background: getAvatarColors(profileEmployee.name).bg, 
                    color: getAvatarColors(profileEmployee.name).tc 
                  }}
                >
                  {getInitials(profileEmployee.name)}
                </div>
                <div className="text-center">
                  <p className="font-semibold text-foreground">{profileEmployee.name}</p>
                  <p className="text-xs text-muted-foreground">{profileEmployee.department}</p>
                </div>
              </div>

              {/* Details */}
              <div className="border border-border rounded-xl divide-y divide-border text-sm">
                {[
                  { label: "Username",   value: profileEmployee.username      },
                  { label: "Role",       value: profileEmployee.role          },
                  { label: "Status",     value: profileEmployee.status        },
                  { label: "Department", value: profileEmployee.department     },
                  { label: "Joined",     value: profileEmployee.joined        },
                ].map(({ label, value }: { label: string; value: string }) => (
                  <div key={label} className="flex items-center justify-between px-4 py-2.5">
                    <span className="text-xs text-muted-foreground">{label}</span>
                    <span className="text-xs font-medium text-foreground capitalize">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>

    </div>
  );
}
