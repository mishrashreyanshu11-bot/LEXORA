import React from 'react';
import { Sparkles } from 'lucide-react';

interface PremiumBadgeProps {
  label?: string;
  size?: 'sm' | 'md';
}

export const PremiumBadge: React.FC<PremiumBadgeProps> = ({ label = 'Subscriber', size = 'sm' }) => {
  return (
    <span
      className={`inline-flex items-center gap-1 font-bold rounded-full bg-teal-50 text-teal-900 border border-teal-200/90 shadow-2xs select-none ${
        size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs'
      }`}
      title="Vellum Subscriber"
    >
      <Sparkles className="w-3 h-3 text-teal-600" />
      <span className="tracking-tight">{label}</span>
    </span>
  );
};

