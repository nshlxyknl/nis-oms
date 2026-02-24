"use client"

import { ArrowRight, Clock, CalendarDays, DoorOpen, Package } from 'lucide-react';
import React, { useState } from 'react'

const FeaturesCard = () => {

    const [checkedIn, setCheckedIn] = useState(false);

   const featureCards = [
    {
      title: "Attendance",
      description: "Clock in & out, view your daily and monthly attendance logs.",
      icon: Clock,
      color: "primary" as const,
      action: checkedIn ? "Clock Out" : "Clock In",
      onAction: () => setCheckedIn(!checkedIn),
    },
    {
      title: "Leave",
      description: "Apply for leave, check balances and track approval status.",
      icon: CalendarDays,
      color: "success" as const,
      action: "Apply Leave",
    },
    {
      title: "Room Booking",
      description: "Book meeting rooms and check real-time availability.",
      icon: DoorOpen,
      color: "warning" as const,
      action: "Book Room",
    },
    {
      title: "Assets",
      description: "Request equipment, view assigned assets and maintenance status.",
      icon: Package,
      color: "accent" as const,
      action: "Request Asset",
    },
  ];

  const colorMap = {
    primary: "bg-primary/10 text-primary",
    success: "bg-success/10 text-success",
    warning: "bg-warning/10 text-warning",
    accent: "bg-accent/10 text-accent",
  };

    const borderMap = {
    primary: "hover:border-primary/40",
    success: "hover:border-success/40",
    warning: "hover:border-warning/40",
    accent: "hover:border-accent/40",
  };

  return (
    <div className="mb-8">
          <h2 className="text-lg font-display font-semibold text-foreground mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {featureCards.map((card) => {
              const Icon = card.icon;
              return (
                <div
                  key={card.title}
                  className={`group bg-card rounded-xl border border-border p-5 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 ${borderMap[card.color]}`}
                >
                  <div className={`inline-flex items-center justify-center w-11 h-11 rounded-lg mb-3 ${colorMap[card.color]}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-display text-base font-semibold text-card-foreground mb-1">
                    {card.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                    {card.description}
                  </p>
                  <button
                    onClick={card.onAction}
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:gap-2.5 transition-all"
                  >
                    {card.action} <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
  )
}

export default FeaturesCard