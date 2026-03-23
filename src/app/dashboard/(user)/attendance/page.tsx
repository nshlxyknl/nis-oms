"use client";
import { useState } from "react";
import { CalendarCheck, ChevronLeft, ChevronRight, Clock, LogIn, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";

type AttendanceStatus = "present" | "absent" | "on-leave" | "holiday";

interface AttendanceRecord {
  date: string;
  day: string;
  checkIn?: string;
  checkOut?: string;
  status: AttendanceStatus;
  hours?: string;
}

const STATUS_STYLES: Record<AttendanceStatus, string> = {
  present:    "bg-green-100 text-green-700",
  absent:     "bg-red-100 text-red-700",
  "on-leave": "bg-blue-100 text-blue-700",
  holiday:    "bg-yellow-100 text-yellow-700",
};

// YYYY-MM-DD → status
const DAY_STATUS: Record<string, AttendanceStatus> = {
  "2026-03-20": "present",
  "2026-03-19": "absent",
  "2026-03-18": "present",
  "2026-03-17": "on-leave",
  "2026-03-16": "present",
  "2026-03-13": "present",
  "2026-03-12": "present",
  "2026-03-11": "present",
  "2026-03-10": "holiday",
  "2026-03-09": "present",
  "2026-03-06": "present",
  "2026-03-05": "present",
  "2026-03-04": "present",
  "2026-03-03": "present",
  "2026-03-02": "present",
  "2026-02-27": "present",
  "2026-02-26": "present",
  "2026-02-25": "on-leave",
  "2026-02-24": "present",
  "2026-02-23": "present",
};

const DAY_DOT: Record<AttendanceStatus, string> = {
  present:    "bg-green-500 text-white",
  "on-leave": "bg-blue-400 text-white",
  absent:     "bg-red-400 text-white",
  holiday:    "bg-yellow-300 text-yellow-900",
};

const MOCK_RECORDS: AttendanceRecord[] = [
  { date: "Mar 21, 2026", day: "Sat", status: "absent" },
  { date: "Mar 20, 2026", day: "Fri", checkIn: "08:55 AM", checkOut: "05:10 PM", status: "present",  hours: "8h 15m" },
  { date: "Mar 19, 2026", day: "Thu", status: "absent" },
  { date: "Mar 18, 2026", day: "Wed", checkIn: "08:50 AM", checkOut: "05:05 PM", status: "present",  hours: "8h 15m" },
  { date: "Mar 17, 2026", day: "Tue", status: "on-leave" },
  { date: "Mar 16, 2026", day: "Mon", checkIn: "08:45 AM", checkOut: "05:00 PM", status: "present",  hours: "8h 15m" },
  { date: "Mar 13, 2026", day: "Fri", checkIn: "09:00 AM", checkOut: "05:00 PM", status: "present",  hours: "8h 00m" },
];

const STATS = [
  { label: "Present",  value: 18, color: "text-green-600"  },
  { label: "Absent",   value: 2,  color: "text-red-600"    },
  { label: "On Leave", value: 2,  color: "text-blue-600"   },
  { label: "Holiday",  value: 1,  color: "text-yellow-600" },
];

const MONTH_NAMES = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

function buildCalendar(year: number, month: number) {
  const firstDay    = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (number | null)[] = Array(firstDay).fill(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

function toKey(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

export default function AttendancePage() {
  const [checkedIn, setCheckedIn]     = useState(false);
  const [checkInTime, setCheckInTime] = useState<string | null>(null);
  const [calYear, setCalYear]         = useState(2026);
  const [calMonth, setCalMonth]       = useState(2);
  const [calOpen, setCalOpen]         = useState(false);

  const handleCheckIn = () => {
    const now = new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
    setCheckedIn(true);
    setCheckInTime(now);
    toast.success(`Checked in at ${now}`);
  };

  const handleCheckOut = () => {
    const now = new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
    setCheckedIn(false);
    toast.success(`Checked out at ${now}`);
  };

  const prevMonth = () => {
    if (calMonth === 0) { setCalMonth(11); setCalYear(y => y - 1); }
    else setCalMonth(m => m - 1);
  };

  const nextMonth = () => {
    if (calMonth === 11) { setCalMonth(0); setCalYear(y => y + 1); }
    else setCalMonth(m => m + 1);
  };

  const cells = buildCalendar(calYear, calMonth);

  return (
    <div className="p-8 flex flex-col gap-6">

      {/* Calendar trigger */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <CalendarCheck className="w-5 h-5 text-green-600" /> Attendance
        </h2>
        <button
          onClick={() => setCalOpen(true)}
          className="text-sm text-muted-foreground hover:text-foreground border border-border rounded-md px-3 py-1.5 flex items-center gap-1.5 hover:border-foreground transition-colors"
        >
          <CalendarCheck className="w-3.5 h-3.5" />
          {MONTH_NAMES[calMonth]} {calYear}
        </button>
      </div>

      {/* Calendar dialog */}
      <Dialog open={calOpen} onOpenChange={setCalOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Attendance Calendar</DialogTitle>
          </DialogHeader>

          <div className="flex items-center justify-between mb-4">
            <button onClick={prevMonth} className="p-1.5 rounded-md hover:bg-muted transition-colors">
              <ChevronLeft className="w-4 h-4 text-muted-foreground" />
            </button>
            <span className="text-sm font-semibold text-foreground">
              {MONTH_NAMES[calMonth]} {calYear}
            </span>
            <button onClick={nextMonth} className="p-1.5 rounded-md hover:bg-muted transition-colors">
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>

          <div className="grid grid-cols-7 mb-1">
            {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map(d => (
              <div key={d} className="text-center text-[10px] font-medium text-muted-foreground py-1">{d}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-y-1">
            {cells.map((day, i) => {
              if (!day) return <div key={i} />;
              const key      = toKey(calYear, calMonth, day);
              const status   = DAY_STATUS[key];
              const isWeekend = i % 7 === 0 || i % 7 === 6;
              return (
                <div key={i} className="flex items-center justify-center py-0.5">
                  <span className={`w-7 h-7 flex items-center justify-center rounded-full text-xs font-medium
                    ${status ? DAY_DOT[status] : isWeekend ? "text-muted-foreground/40" : "text-foreground"}`}>
                    {day}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="flex items-center gap-3 mt-4 pt-3 border-t border-border flex-wrap">
            {[
              { label: "Worked",  cls: "bg-green-500"  },
              { label: "Absent",  cls: "bg-red-400"    },
              { label: "Leave",   cls: "bg-blue-400"   },
              { label: "Holiday", cls: "bg-yellow-300" },
            ].map(l => (
              <div key={l.label} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span className={`w-2.5 h-2.5 rounded-full ${l.cls}`} />
                {l.label}
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Check-in card */}
      <div className="bg-card border border-border rounded-xl p-6 flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${checkedIn ? "bg-green-100" : "bg-muted"}`}>
            <Clock className={`w-5 h-5 ${checkedIn ? "text-green-600" : "text-muted-foreground"}`} />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">
              {checkedIn ? "You're checked in" : "Not checked in yet"}
            </p>
            <p className="text-xs text-muted-foreground">
              {checkedIn && checkInTime ? `Since ${checkInTime}` : "Today · Mar 22, 2026"}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleCheckIn} disabled={checkedIn} className="gap-1.5">
            <LogIn className="w-4 h-4" /> Check In
          </Button>
          <Button variant="outline" onClick={handleCheckOut} disabled={!checkedIn} className="gap-1.5">
            <LogOut className="w-4 h-4" /> Check Out
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {STATS.map((s) => (
          <div key={s.label} className="bg-muted rounded-lg px-4 py-3">
            <p className="text-xs text-muted-foreground mb-1">{s.label}</p>
            <p className={`text-2xl font-medium ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* History table */}
      <div className="border border-border rounded-xl overflow-hidden">
        <table className="w-full text-sm" style={{ tableLayout: "fixed" }}>
          <thead>
            <tr className="border-b border-border">
              {["Date", "Check In", "Check Out", "Hours", "Status"].map((h) => (
                <th key={h} className="px-4 py-2.5 text-left text-[11px] font-medium text-muted-foreground uppercase tracking-wide">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {MOCK_RECORDS.map((r) => (
              <tr key={r.date} className="border-t border-border hover:bg-muted/40 transition-colors">
                <td className="px-4 py-3">
                  <p className="text-[13px] font-medium text-foreground">{r.date}</p>
                  <p className="text-[11px] text-muted-foreground">{r.day}</p>
                </td>
                <td className="px-4 py-3 text-xs text-muted-foreground">{r.checkIn ?? "—"}</td>
                <td className="px-4 py-3 text-xs text-muted-foreground">{r.checkOut ?? "—"}</td>
                <td className="px-4 py-3 text-xs text-muted-foreground">{r.hours ?? "—"}</td>
                <td className="px-4 py-3">
                  <span className={`text-[11px] font-medium px-2.5 py-0.5 rounded-full capitalize ${STATUS_STYLES[r.status]}`}>
                    {r.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}
