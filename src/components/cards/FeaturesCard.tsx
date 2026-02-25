"use client";

import { adminFeatures } from "@/lib/admin/adminFeaturesdata";
import { userFeatures } from "@/lib/user/userFeaturesdata";
import {
  ArrowRight
} from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";





const FeaturesCard = () => {
  const router = useRouter();

  const {data: session } =useSession()

const featureCards = session?.user?.role === "admin" ? adminFeatures : userFeatures;

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
      <h2 className="text-lg font-display font-semibold text-foreground mb-4">
        Quick Actions
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {featureCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.title}
              className={`group bg-card rounded-xl border border-border p-5 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 ${borderMap[card.color]}`}
            >
              <div
                className={`inline-flex items-center justify-center w-11 h-11 rounded-lg mb-3 ${colorMap[card.color]}`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <h3 className="font-display text-base font-semibold text-card-foreground mb-1">
                {card.title}
              </h3>
              <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                {card.description}
              </p>
              <button
                onClick={() => router.push(card.url)}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:gap-2.5 transition-all"
              >
                {card.action} <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FeaturesCard;
