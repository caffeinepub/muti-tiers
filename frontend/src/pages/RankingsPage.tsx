import React, { useState, useMemo } from 'react';
import CategoryTabs from '../components/CategoryTabs';
import RankingsTable from '../components/RankingsTable';
import SearchInput from '../components/SearchInput';
import AdminControls from '../components/AdminControls';
import type { CategoryKey } from '../data/mockData';
import { useGetAllPlayers, useGetPlayersByCategory } from '../hooks/useQueries';
import type { PlayerRanking } from '../backend';

export default function RankingsPage() {
  const [activeCategory, setActiveCategory] = useState<CategoryKey>('overall');
  const [searchQuery, setSearchQuery] = useState('');

  const { data: allPlayers = [], isLoading: allPlayersLoading } = useGetAllPlayers();
  const { data: categoryPlayers = [], isLoading: categoryLoading } = useGetPlayersByCategory(activeCategory);

  const isSpecialCategory = activeCategory === 'diamondSmp' || activeCategory === 'spear';

  const players = useMemo(() => {
    const source: PlayerRanking[] = isSpecialCategory ? categoryPlayers : allPlayers;

    const filtered = isSpecialCategory
      ? source
      : source.filter((p) => {
          if (activeCategory === 'overall') return true;
          return p.badges.some((b) => b.category === activeCategory);
        });

    const sorted = [...filtered].sort((a, b) => Number(b.points) - Number(a.points));

    return sorted.map((p, i) => ({ ...p, rankPosition: BigInt(i + 1) }));
  }, [allPlayers, categoryPlayers, activeCategory, isSpecialCategory]);

  const isLoading = isSpecialCategory ? categoryLoading : allPlayersLoading;

  return (
    <div className="min-h-screen bg-mc-bg text-mc-text flex flex-col">
      {/* Header */}
      <header className="bg-mc-card border-b border-mc-border px-4 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <img
            src="/assets/generated/muti-tiers-logo.dim_320x64.png"
            alt="Muti Tiers"
            className="h-8 pixelated"
          />
        </div>
        <div className="flex items-center gap-3">
          <SearchInput value={searchQuery} onChange={setSearchQuery} />
          <AdminControls />
        </div>
      </header>

      {/* Category Tabs */}
      <CategoryTabs activeCategory={activeCategory} onCategoryChange={setActiveCategory} />

      {/* Rankings Table */}
      <main className="flex-1 overflow-auto">
        <RankingsTable
          players={players}
          isLoading={isLoading}
          searchQuery={searchQuery}
        />
      </main>

      {/* Footer */}
      <footer className="bg-mc-card border-t border-mc-border px-4 py-3 text-center text-mc-muted text-xs">
        <span>
          © {new Date().getFullYear()} Muti Tiers — Built with{' '}
          <span className="text-red-400">♥</span> using{' '}
          <a
            href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== 'undefined' ? window.location.hostname : 'unknown-app')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-mc-gold hover:underline"
          >
            caffeine.ai
          </a>
        </span>
      </footer>
    </div>
  );
}
