import type { PlayerRanking } from '../backend';

export type CategoryKey = 'overall' | 'spearMace' | 'vanilla' | 'uhc' | 'diamondSmpNethopSpear' | 'nethop' | 'smp' | 'sword' | 'axe' | 'mace';

export const mockPlayerData: PlayerRanking[] = [];

export const MOCK_DATA: Record<CategoryKey, PlayerRanking[]> = {
  overall: [],
  spearMace: [],
  vanilla: [],
  uhc: [],
  diamondSmpNethopSpear: [],
  nethop: [],
  smp: [],
  sword: [],
  axe: [],
  mace: [],
};
