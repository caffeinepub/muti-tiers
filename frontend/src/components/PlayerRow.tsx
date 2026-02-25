import React, { useState } from 'react';
import type { PlayerRanking } from '../backend';
import TierBadge from './TierBadge';

interface PlayerRowProps {
  player: PlayerRanking;
  index: number;
}

const REGION_COLORS: Record<string, { bg: string; text: string }> = {
  NA: { bg: '#7f1d1d', text: '#fca5a5' },
  EU: { bg: '#14532d', text: '#86efac' },
  AS: { bg: '#1e3a5f', text: '#93c5fd' },
  SA: { bg: '#713f12', text: '#fde68a' },
  OC: { bg: '#4c1d95', text: '#c4b5fd' },
};

function RankNumber({ position, index }: { position: number; index: number }) {
  if (index === 0) {
    return (
      <div className="rank-gold flex items-center justify-center w-16 h-full min-h-[72px] shrink-0">
        <span className="text-2xl font-black text-rank-gold-text">{position}.</span>
      </div>
    );
  }
  if (index === 1) {
    return (
      <div className="rank-silver flex items-center justify-center w-16 h-full min-h-[72px] shrink-0">
        <span className="text-2xl font-black text-rank-silver-text">{position}.</span>
      </div>
    );
  }
  if (index === 2) {
    return (
      <div className="rank-bronze flex items-center justify-center w-16 h-full min-h-[72px] shrink-0">
        <span className="text-2xl font-black text-rank-bronze-text">{position}.</span>
      </div>
    );
  }
  return (
    <div className="flex items-center justify-center w-16 h-full min-h-[72px] shrink-0">
      <span className="text-xl font-bold text-muted-foreground">{position}.</span>
    </div>
  );
}

export default function PlayerRow({ player, index }: PlayerRowProps) {
  const [avatarError, setAvatarError] = useState(false);
  const regionStyle = REGION_COLORS[player.region] || { bg: '#374151', text: '#d1d5db' };
  const position = Number(player.rankPosition);

  return (
    <div
      className={`flex items-center gap-0 border-b border-mc-border transition-colors hover:bg-mc-hover ${
        index % 2 === 0 ? 'bg-mc-row-even' : 'bg-mc-row-odd'
      }`}
    >
      {/* Rank Number */}
      <RankNumber position={position} index={index} />

      {/* Avatar */}
      <div className="flex items-center justify-center w-16 h-full min-h-[72px] shrink-0">
        {!avatarError ? (
          <img
            src={`https://crafatar.com/avatars/${player.uuid}?size=40&overlay`}
            alt={player.username}
            className="w-10 h-10 rounded-sm pixelated"
            onError={() => setAvatarError(true)}
          />
        ) : (
          <div className="w-10 h-10 rounded-sm bg-mc-surface flex items-center justify-center text-xs font-bold text-muted-foreground">
            {player.username.slice(0, 2).toUpperCase()}
          </div>
        )}
      </div>

      {/* Player Info */}
      <div className="flex-1 py-3 px-2 min-w-0">
        <div className="font-bold text-mc-text text-base leading-tight">{player.username}</div>
        <div className="flex items-center gap-1.5 mt-0.5">
          <img
            src="/assets/generated/muti-tiers-logo.dim_320x64.png"
            alt=""
            className="w-3.5 h-3.5 object-contain opacity-70"
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
          />
          <span className="text-xs text-mc-gold">
            {player.title}{' '}
            <span className="text-mc-muted">({Number(player.points)} points)</span>
          </span>
        </div>
      </div>

      {/* Region Badge */}
      <div className="flex items-center justify-center w-20 shrink-0 py-3">
        <span
          className="px-2.5 py-1 rounded text-xs font-bold tracking-wider"
          style={{ backgroundColor: regionStyle.bg, color: regionStyle.text }}
        >
          {player.region}
        </span>
      </div>

      {/* Tier Badges */}
      <div className="flex items-center gap-1.5 px-3 py-2 flex-wrap min-w-0 max-w-xs lg:max-w-sm xl:max-w-md">
        {player.badges.map((badge, i) => (
          <TierBadge key={`${badge.category}-${i}`} badge={badge} />
        ))}
      </div>
    </div>
  );
}
