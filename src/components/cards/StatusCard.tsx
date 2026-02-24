"use client"
import { LogIn, LogOut } from 'lucide-react';
import React, { useState } from 'react'
import { Button } from '../ui/button';

const StatusCard = () => {
        const [checkedIn, setCheckedIn] = useState(false);
    
  return (
    <div
          className={`rounded-xl border p-5 mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-colors ${
            checkedIn
              ? "bg-success/5 border-success/20"
              : "bg-card border-border"
          }`}
        >
          <div className="flex items-center gap-4">
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                checkedIn ? "bg-success/10" : "bg-muted"
              }`}
            >
              {checkedIn ? (
                <LogOut className="w-6 h-6 text-success" />
              ) : (
                <LogIn className="w-6 h-6 text-muted-foreground" />
              )}
            </div>
            <div>
              <h1 className="text-xl font-display font-bold text-foreground">
                {checkedIn ? "You're checked in! 🟢" : "Welcome back, John 👋"}
              </h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                {checkedIn
                  ? "Checked in at 9:02 AM · Working for 3h 28m"
                  : "You haven't checked in yet today. Ready to start?"}
              </p>
            </div>
          </div>
          <Button
            onClick={() => setCheckedIn(!checkedIn)}
            variant={checkedIn ? "outline" : "default"}
            className={`shrink-0 ${checkedIn ? "border-success/30 text-success hover:bg-success/10 hover:text-success" : ""}`}
          >
            {checkedIn ? (
              <>
                <LogOut className="w-4 h-4 mr-1.5" /> Clock Out
              </>
            ) : (
              <>
                <LogIn className="w-4 h-4 mr-1.5" /> Clock In
              </>
            )}
          </Button>
        </div>
  )
}

export default StatusCard