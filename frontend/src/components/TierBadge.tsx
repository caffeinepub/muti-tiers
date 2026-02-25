import React from 'react';
import type { TierCategory } from '../backend';

interface TierBadgeProps {
  badge: TierCategory;
}

const CATEGORY_CONFIG: Record<string, { bg: string; border: string; icon: string }> = {
  vanilla: { bg: '#6d28d9', border: '#7c3aed', icon: '⚔️' },
  diamondSmp: { bg: '#0c4a6e', border: '#0284c7', icon: '💎' },
  spear: { bg: '#831843', border: '#db2777', icon: '🔱' },
  uhc: { bg: '#065f46', border: '#059669', icon: '🍎' },
  smp: { bg: '#1d4ed8', border: '#2563eb', icon: '🏠' },
  spearMace: { bg: '#9f1239', border: '#e11d48', icon: '🗡️' },
  nethop: { bg: '#92400e', border: '#d97706', icon: '🔥' },
  overall: { bg: '#1e3a5f', border: '#2563eb', icon: '⭐' },
  sword: { bg: '#1e40af', border: '#3b82f6', icon: '🗡️' },
  axe: { bg: '#065f46', border: '#10b981', icon: '🪓' },
  mace: { bg: '#374151', border: '#6b7280', icon: '🔨' },
};

const TIER_COLORS: Record<string, string> = {
  HT1: '#fbbf24',
  HT2: '#f97316',
  HT3: '#ef4444',
  HT4: '#a855f7',
  HT5: '#6366f1',
  LT1: '#22c55e',
  LT2: '#14b8a6',
  LT3: '#3b82f6',
  LT4: '#8b5cf6',
  LT5: '#ec4899',
};

export default function TierBadge({ badge }: TierBadgeProps) {
  const config = CATEGORY_CONFIG[badge.category] ?? {
    bg: '#1f2937',
    border: '#374151',
    icon: '🎮',
  };
  const tierColor = TIER_COLORS[badge.tier] ?? '#9ca3af';

  return (
    <div
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold border"
      style={{
        backgroundColor: config.bg,
        borderColor: config.border,
        color: tierColor,
      }}
      title={`${badge.category}: ${badge.tier}`}
    >
      <span className="text-[10px] leading-none">{config.icon}</span>
      <span className="leading-none">{badge.tier}</span>
    </div>
  );
}
