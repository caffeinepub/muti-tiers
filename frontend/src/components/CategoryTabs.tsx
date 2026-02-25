import React from 'react';
import type { CategoryKey } from '../data/mockData';

interface Tab {
  key: CategoryKey;
  label: string;
  icon: React.ReactNode;
}

interface CategoryTabsProps {
  activeCategory: CategoryKey;
  onCategoryChange: (category: CategoryKey) => void;
}

function OverallIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
      <path d="M12 2L14.5 9H22L16 13.5L18.5 20.5L12 16.5L5.5 20.5L8 13.5L2 9H9.5L12 2Z" fill="#fbbf24" />
    </svg>
  );
}

function SpearMaceIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
      <path d="M12 21C12 21 3 14.5 3 8.5C3 5.5 5.5 3 8.5 3C10 3 11.2 3.7 12 4.5C12.8 3.7 14 3 15.5 3C18.5 3 21 5.5 21 8.5C21 14.5 12 21 12 21Z" fill="#fb7185" />
    </svg>
  );
}

function VanillaIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
      <circle cx="12" cy="12" r="9" fill="#7c3aed" opacity="0.3" />
      <circle cx="12" cy="12" r="6" fill="#7c3aed" opacity="0.6" />
      <circle cx="12" cy="12" r="3" fill="#a78bfa" />
    </svg>
  );
}

function UHCIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
      <path d="M12 3C8.7 3 6 5.7 6 9C6 12.3 8.7 15 12 15C15.3 15 18 12.3 18 9C18 5.7 15.3 3 12 3Z" fill="#34d399" />
      <path d="M7 15L5 21H19L17 15" fill="#34d399" />
    </svg>
  );
}

function DiamondSmpNethopSpearIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
      <ellipse cx="12" cy="16" rx="7" ry="5" fill="#f472b6" />
      <rect x="9" y="7" width="6" height="9" rx="2" fill="#f472b6" />
      <rect x="11" y="3" width="2" height="5" rx="1" fill="#fbbf24" />
    </svg>
  );
}

function NethOPIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
      <path d="M12 3L14 9H20L15 13L17 19L12 15.5L7 19L9 13L4 9H10L12 3Z" fill="#fb923c" />
    </svg>
  );
}

function SMPIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
      <rect x="3" y="12" width="18" height="9" rx="1" fill="#60a5fa" />
      <polygon points="12,3 3,12 21,12" fill="#60a5fa" />
    </svg>
  );
}

function SwordIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
      <line x1="5" y1="19" x2="19" y2="5" stroke="#93c5fd" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="8" y1="16" x2="11" y2="13" stroke="#93c5fd" strokeWidth="2" strokeLinecap="round" />
      <circle cx="5.5" cy="18.5" r="2" fill="#93c5fd" />
    </svg>
  );
}

function AxeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
      <line x1="6" y1="18" x2="18" y2="6" stroke="#2dd4bf" strokeWidth="2" strokeLinecap="round" />
      <ellipse cx="16" cy="8" rx="4" ry="3" transform="rotate(-45 16 8)" fill="#2dd4bf" />
    </svg>
  );
}

function MaceIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
      <line x1="7" y1="17" x2="17" y2="7" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" />
      <rect x="14" y="4" width="6" height="6" rx="1" transform="rotate(45 17 7)" fill="#9ca3af" />
    </svg>
  );
}

const TABS: Tab[] = [
  { key: 'overall', label: 'Overall', icon: <OverallIcon /> },
  { key: 'spearMace', label: 'Spear Mace', icon: <SpearMaceIcon /> },
  { key: 'vanilla', label: 'Vanilla', icon: <VanillaIcon /> },
  { key: 'uhc', label: 'UHC', icon: <UHCIcon /> },
  { key: 'diamondSmpNethopSpear', label: 'Diamond SMP Nethop Spear', icon: <DiamondSmpNethopSpearIcon /> },
  { key: 'nethop', label: 'NethOP', icon: <NethOPIcon /> },
  { key: 'smp', label: 'SMP', icon: <SMPIcon /> },
  { key: 'sword', label: 'Sword', icon: <SwordIcon /> },
  { key: 'axe', label: 'Axe', icon: <AxeIcon /> },
  { key: 'mace', label: 'Mace', icon: <MaceIcon /> },
];

export default function CategoryTabs({ activeCategory, onCategoryChange }: CategoryTabsProps) {
  return (
    <div className="flex overflow-x-auto border-b border-mc-border bg-mc-card scrollbar-hide">
      {TABS.map((tab) => {
        const isActive = tab.key === activeCategory;
        return (
          <button
            key={tab.key}
            onClick={() => onCategoryChange(tab.key)}
            className={`flex flex-col items-center gap-1.5 px-6 py-3 min-w-[90px] transition-all duration-150 border-b-2 whitespace-nowrap ${
              isActive
                ? 'border-mc-gold bg-mc-tab-active text-mc-text'
                : 'border-transparent text-mc-muted hover:text-mc-text hover:bg-mc-hover'
            }`}
          >
            <div className={`transition-opacity ${isActive ? 'opacity-100' : 'opacity-60'}`}>
              {tab.icon}
            </div>
            <span className={`text-xs font-semibold tracking-wide ${isActive ? 'text-mc-text' : ''}`}>
              {tab.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
