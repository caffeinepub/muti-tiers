import React, { useState } from 'react';
import CategoryTabs from '../components/CategoryTabs';
import RankingsTable from '../components/RankingsTable';
import SearchInput from '../components/SearchInput';
import AdminControls from '../components/AdminControls';
import { type CategoryKey } from '../data/mockData';
import { useGetAllPlayers } from '../hooks/useQueries';
import type { PlayerRanking } from '../backend';

export default function RankingsPage() {
  const [activeCategory, setActiveCategory] = useState<CategoryKey>('overall');
  const [searchQuery, setSearchQuery] = useState('');

  const { data: allPlayers = [], isLoading } = useGetAllPlayers();

  // Filter players by active category: show players that have a badge for the active category,
  // or for 'overall' show all players.
  const players: PlayerRanking[] = activeCategory === 'overall'
    ? allPlayers
    : allPlayers.filter((p) =>
        p.badges.some((b) => b.category === activeCategory)
      );

  // Assign rank positions based on points (descending)
  const rankedPlayers = [...players]
    .sort((a, b) => Number(b.points) - Number(a.points))
    .map((p, i) => ({ ...p, rankPosition: BigInt(i + 1) }));

  const handleCategoryChange = (category: CategoryKey) => {
    setActiveCategory(category);
    setSearchQuery('');
  };

  const handleRemovePlayer = () => {
    alert('Remove player functionality coming soon!');
  };

  const appId = encodeURIComponent(
    typeof window !== 'undefined' ? window.location.hostname : 'muti-tiers'
  );

  return (
    <div className="min-h-screen bg-mc-bg flex flex-col">
      {/* Navigation Bar */}
      <header className="bg-mc-nav border-b border-mc-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center gap-6">
          {/* Logo */}
          <a href="/" className="flex items-center shrink-0">
            <img
              src="/assets/generated/muti-tiers-logo.dim_320x64.png"
              alt="MUTI TIERS"
              className="h-8 object-contain"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const fallback = target.nextElementSibling as HTMLElement;
                if (fallback) fallback.style.display = 'block';
              }}
            />
            <span
              className="hidden text-xl font-black tracking-widest"
              style={{
                fontFamily: "'Press Start 2P', 'Courier New', monospace",
                background: 'linear-gradient(135deg, #fbbf24 0%, #84cc16 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              MUTI TIERS
            </span>
          </a>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-1 ml-4">
            <a
              href="/"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded text-mc-muted hover:text-mc-text hover:bg-mc-hover text-sm font-medium transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Home
            </a>
            <a
              href="/"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded text-mc-text bg-mc-hover text-sm font-medium transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Rankings
            </a>
            <a
              href="/"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded text-mc-muted hover:text-mc-text hover:bg-mc-hover text-sm font-medium transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              Discords
            </a>
            <a
              href="/"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded text-mc-muted hover:text-mc-text hover:bg-mc-hover text-sm font-medium transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              API Docs
            </a>
          </nav>

          {/* Right side: Search + Admin Controls */}
          <div className="ml-auto flex items-center gap-3">
            <SearchInput
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search player..."
            />
            <AdminControls onRemovePlayer={handleRemovePlayer} />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-6">
        <div className="bg-mc-card rounded-lg overflow-hidden border border-mc-border">
          {/* Category Tabs */}
          <CategoryTabs
            activeCategory={activeCategory}
            onCategoryChange={handleCategoryChange}
          />

          {/* Rankings Table */}
          <RankingsTable
            players={rankedPlayers}
            searchQuery={searchQuery}
            isLoading={isLoading}
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-mc-border bg-mc-nav py-4 mt-auto">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-mc-muted">
          <span>© {new Date().getFullYear()} Muti Tiers. All rights reserved.</span>
          <span className="flex items-center gap-1">
            Built with{' '}
            <svg className="w-3.5 h-3.5 text-mc-gold inline" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 21C12 21 3 14.5 3 8.5C3 5.5 5.5 3 8.5 3C10 3 11.2 3.7 12 4.5C12.8 3.7 14 3 15.5 3C18.5 3 21 5.5 21 8.5C21 14.5 12 21 12 21Z" />
            </svg>{' '}
            using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${appId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-mc-gold hover:underline"
            >
              caffeine.ai
            </a>
          </span>
        </div>
      </footer>
    </div>
  );
}
