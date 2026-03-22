'use client';

import { useState, useMemo } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";


// ─── Types ────────────────────────────────────────────────────────────────────

type EmployeeRole   = 'admin' | 'employee';
type EmployeeStatus = 'active' | 'inactive' | 'on-leave';
type FilterType     = 'all' | EmployeeRole | EmployeeStatus;

interface Employee {
  id:         number;
  name:       string;
  email:      string;
  role:       EmployeeRole;
  status:     EmployeeStatus;
  department: string;
  joined:     string;
  initials:   string;
  avatarBg:   string;
  avatarTc:   string;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const EMPLOYEES: Employee[] = [
  { id: 1, name: 'Alice Johnson', email: 'alice@oms.com', role: 'admin',    status: 'active',   department: 'Management',  joined: 'Jan 2022', initials: 'AJ', avatarBg: '#E1F5EE', avatarTc: '#085041' },
  { id: 2, name: 'Bob Smith',     email: 'bob@oms.com',   role: 'employee', status: 'active',   department: 'Operations',  joined: 'Mar 2023', initials: 'BS', avatarBg: '#E6F1FB', avatarTc: '#0C447C' },
  { id: 3, name: 'Carol White',   email: 'carol@oms.com', role: 'employee', status: 'on-leave', department: 'Support',     joined: 'Jul 2023', initials: 'CW', avatarBg: '#FAEEDA', avatarTc: '#633806' },
  { id: 4, name: 'David Kim',     email: 'david@oms.com', role: 'admin',    status: 'active',   department: 'Engineering', joined: 'Feb 2021', initials: 'DK', avatarBg: '#EEEDFE', avatarTc: '#3C3489' },
  { id: 5, name: 'Eva Martinez',  email: 'eva@oms.com',   role: 'employee', status: 'inactive', department: 'Sales',       joined: 'Sep 2023', initials: 'EM', avatarBg: '#FAECE7', avatarTc: '#712B13' },
  { id: 6, name: 'Frank Lee',     email: 'frank@oms.com', role: 'employee', status: 'active',   department: 'Operations',  joined: 'Nov 2022', initials: 'FL', avatarBg: '#FBEAF0', avatarTc: '#72243E' },
];

// ─── Style Maps ───────────────────────────────────────────────────────────────

const ROLE_STYLES: Record<EmployeeRole, string> = {
  admin:    'bg-[#EEEDFE] text-[#3C3489]',
  employee: 'bg-[#E6F1FB] text-[#0C447C]',
};

const STATUS_STYLES: Record<EmployeeStatus, { dot: string; text: string; label: string }> = {
  active:     { dot: 'bg-[#639922]', text: 'text-[#3B6D11]', label: 'Active'   },
  'on-leave': { dot: 'bg-[#EF9F27]', text: 'text-[#854F0B]', label: 'On leave' },
  inactive:   { dot: 'bg-[#B4B2A9]', text: 'text-[#5F5E5A]', label: 'Inactive' },
};

const FILTERS: { label: string; value: FilterType }[] = [
  { label: 'All',       value: 'all'      },
  { label: 'Admins',    value: 'admin'    },
  { label: 'Employees', value: 'employee' },
  { label: 'Active',    value: 'active'   },
  { label: 'On leave',  value: 'on-leave' },
  { label: 'Inactive',  value: 'inactive' },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function EmployeeTable() {
  const [search, setSearch]             = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
    const [open, setOpen] = useState<boolean>(false);


  const filtered = useMemo(() => {
    return EMPLOYEES.filter((e) => {
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        e.name.toLowerCase().includes(q) ||
        e.email.toLowerCase().includes(q) ||
        e.department.toLowerCase().includes(q);
      const matchFilter =
        activeFilter === 'all' ||
        e.role === activeFilter ||
        e.status === activeFilter;
      return matchSearch && matchFilter;
    });
  }, [search, activeFilter]);

  const stats = useMemo(() => ({
    total:   EMPLOYEES.length,
    active:  EMPLOYEES.filter((e) => e.status === 'active').length,
    admins:  EMPLOYEES.filter((e) => e.role === 'admin').length,
    onLeave: EMPLOYEES.filter((e) => e.status === 'on-leave').length,
  }), []);

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
            <DialogTitle>Add New Staffs</DialogTitle>
          </DialogHeader>

          <form className="space-y-4">
            <Input placeholder="name" className="w-100"></Input>

            <Select>
              <SelectTrigger className="w-full max-w-48">
                <SelectValue placeholder="" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="Laptop">Admin</SelectItem>
                  <SelectItem value="Furniture">Employyes</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>

            <Button
              type="submit"
              className="w-full bg-primary text-white rounded-md p-2"
            >
              Save
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
        ].map((s) => (
          <div key={s.label} className="bg-muted rounded-lg px-4 py-3">
            <p className="text-xs text-muted-foreground mb-1">{s.label}</p>
            <p className="text-2xl font-medium text-foreground">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex gap-1.5 flex-wrap">
          {FILTERS.map((f) => (
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
                { label: 'Employee',   width: '32%' },
                { label: 'Role',       width: '13%' },
                { label: 'Status',     width: '14%' },
                { label: 'Joined',     width: '13%' },
                { label: '',           width: '11%' },
              ].map((h, i) => (
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
                <td colSpan={6} className="text-center py-12 text-sm text-muted-foreground">
                  No employees found
                </td>
              </tr>
            ) : (
              filtered.map((e) => (
                <tr key={e.id} className="border-t border-border hover:bg-muted/40 transition-colors">

                  {/* Employee */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-medium shrink-0"
                        style={{ background: e.avatarBg, color: e.avatarTc }}
                      >
                        {e.initials}
                      </div>
                      <div>
                        <p className="font-medium text-[13px] text-foreground">{e.name}</p>
                        <p className="text-[11px] text-muted-foreground">{e.email}</p>
                      </div>
                    </div>
                  </td>

                  {/* Role */}
                  <td className="px-4 py-3">
                    <span className={`inline-block text-[11px] font-medium px-2.5 py-0.5 rounded-full ${ROLE_STYLES[e.role]}`}>
                      {e.role}
                    </span>
                  </td>

                

                  {/* Status */}
                  <td className="px-4 py-3">
                    <div className={`flex items-center gap-1.5 text-xs ${STATUS_STYLES[e.status].text}`}>
                      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${STATUS_STYLES[e.status].dot}`} />
                      {STATUS_STYLES[e.status].label}
                    </div>
                  </td>

                  {/* Joined */}
                  <td className="px-4 py-3 text-xs text-muted-foreground">
                    {e.joined}
                  </td>

                  {/* Action */}
                  <td className="px-4 py-3">
                    <button className="text-xs text-muted-foreground border border-border rounded-md px-2.5 py-1 hover:text-foreground hover:border-foreground transition-colors cursor-pointer">
                      Edit
                    </button>
                  </td>

                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-border text-xs text-muted-foreground">
          Showing {filtered.length} of {EMPLOYEES.length} employees
        </div>
      </div>

    </div>
  );
}