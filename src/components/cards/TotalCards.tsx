import React from "react";
import { statusColors } from "@/lib/statuscolor";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Status = "available" | "occupied" | "maintenance" | "assigned";

export interface BaseItems {
  id: number;
  name: string;
  status: Status;
}


interface IProps<T extends BaseItems> {
  items: T[];
  title: string;
  icon: React.ReactNode;
  iconBg: string;
  accentColor: string;
  renderSubtitle: (item: T) => string;
}

const TotalCards = <T extends BaseItems>({
  items,
  icon,
  iconBg,
  renderSubtitle,
  accentColor,
}: IProps<T>) => {
  return (
    <div className="m-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {items.map((item) => (
          <div
            key={item.id}
            className={`group bg-card rounded-xl border border-border p-5 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 ${accentColor}`}
          >
            <div className="flex items-center justify-between mb-3">
              <div
                className={`w-9 h-9 rounded-lg bg-blue-100  ${iconBg} flex items-center justify-center`}
              >
                {icon}
              </div>
              <span
                className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full ${statusColors[item.status]}`}
              >
                {item.status}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-card-foreground mb-1">
                  {item.name}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {renderSubtitle(item)}
                </p>
              </div>
              {/* <Select defaultValue={item.status}>
                <SelectTrigger
                  className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full ${statusColors[item.status]}`}
                >
                  <SelectValue placeholder="category" />
                </SelectTrigger>
                <SelectContent>
                 {statusOptions.map((option) => (  
      <SelectItem key={option.value} value={option.value}>
        {option.label}
      </SelectItem>
    ))}
                </SelectContent>
              </Select> */}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TotalCards;
