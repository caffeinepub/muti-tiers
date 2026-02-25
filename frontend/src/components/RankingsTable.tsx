import React from 'react';
import type { PlayerRanking } from '../backend';
import PlayerRow from './PlayerRow';
import { Skeleton } from '@/components/ui/skeleton';

interface RankingsTableProps {
  players: PlayerRanking[];
  searchQuery: string;
  isLoading: boolean;
}

export default function RankingsTable({ players, searchQuery, isLoading }: RankingsTableProps) {
  const filtered = searchQuery
    ? players.filter((p) =>
        p.username.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : players;

  if (isLoading) {
    return (
      <div className="w-full">
        {/* Table Header */}
        <div className="flex items-center gap-0 px-4 py-2 border-b border-mc-border">
          <div className="w-16 text-xs font-semibold text-mc-muted uppercase tracking-widest">#</div>
          <div className="w-16"></div>
          <div className="flex-1 text-xs font-semibold text-mc-muted uppercase tracking-widest px-2">PLAYER</div>
          <div className="w-20 text-xs font-semibold text-mc-muted uppercase tracking-widest text-center">REGION</div>
          <div className="px-3 text-xs font-semibold text-mc-muted uppercase tracking-widest">TIERS</div>
        </div>
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 px-4 py-4 border-b border-mc-border">
            <Skeleton className="w-10 h-6 bg-mc-surface" />
            <Skeleton className="w-10 h-10 rounded-sm bg-mc-surface" />
            <div className="flex-1 space-y-2">
              <Skeleton className="w-32 h-4 bg-mc-surface" />
              <Skeleton className="w-48 h-3 bg-mc-surface" />
            </div>
            <Skeleton className="w-12 h-6 bg-mc-surface" />
            <div className="flex gap-2">
              {Array.from({ length: 4 }).map((_, j) => (
                <Skeleton key={j} className="w-8 h-8 rounded-full bg-mc-surface" />
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Table Header */}
      <div className="flex items-center gap-0 px-0 py-2 border-b border-mc-border bg-mc-surface">
        <div className="w-16 text-xs font-semibold text-mc-muted uppercase tracking-widest text-center">#</div>
        <div className="w-16"></div>
        <div className="flex-1 text-xs font-semibold text-mc-muted uppercase tracking-widest px-2">PLAYER</div>
        <div className="w-20 text-xs font-semibold text-mc-muted uppercase tracking-widest text-center">REGION</div>
        <div className="px-3 text-xs font-semibold text-mc-muted uppercase tracking-widest">TIERS</div>
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-mc-muted">
          <svg className="w-12 h-12 mb-4 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <p className="text-lg font-semibold">No players found</p>
          <p className="text-sm mt-1">Try a different search term</p>
        </div>
      ) : (
        filtered.map((player, index) => (
          <PlayerRow key={player.uuid + player.username} player={player} index={index} />
        ))
      )}
    </div>
  );
}
