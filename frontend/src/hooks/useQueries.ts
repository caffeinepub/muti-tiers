import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { PlayerRanking, RawRankingData } from '../backend';
import type { CategoryKey } from '../data/mockData';

export function useRawRankingData() {
  const { actor, isFetching } = useActor();

  return useQuery<RawRankingData>({
    queryKey: ['rawRankingData'],
    queryFn: async () => {
      if (!actor) {
        return {
          overall: [],
          spearMace: [],
          vanilla: [],
          uhc: [],
          diamondSmp: [],
          spear: [],
          nethop: [],
          smp: [],
          sword: [],
          axe: [],
          mace: [],
        };
      }
      return actor.getRawRankingData();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSearchPlayers(searchTerm: string) {
  const { actor, isFetching } = useActor();

  return useQuery<PlayerRanking[]>({
    queryKey: ['searchPlayers', searchTerm],
    queryFn: async () => {
      if (!actor || !searchTerm.trim()) return [];
      return actor.searchPlayersByName(searchTerm);
    },
    enabled: !!actor && !isFetching && searchTerm.trim().length > 0,
  });
}

export function useGetAllPlayers() {
  const { actor, isFetching } = useActor();

  return useQuery<PlayerRanking[]>({
    queryKey: ['allPlayers'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllPlayers();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetPlayersByCategory(categoryKey: CategoryKey) {
  const { actor, isFetching } = useActor();

  return useQuery<PlayerRanking[]>({
    queryKey: ['playersByCategory', categoryKey],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getPlayersByCategory(categoryKey);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddPlayer() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (player: PlayerRanking) => {
      if (!actor) throw new Error('Actor not available');

      const categoryKeys: CategoryKey[] = [
        'overall', 'spearMace', 'vanilla', 'uhc', 'diamondSmp', 'spear',
        'nethop', 'smp', 'sword', 'axe', 'mace',
      ];

      // Find which categories this player has badges for
      const badgeCategories = player.badges
        .map((b) => b.category)
        .filter((c) => categoryKeys.includes(c as CategoryKey));

      if (badgeCategories.length > 0) {
        // Add player to each category they have a badge for
        for (const cat of badgeCategories) {
          await actor.addPlayer(cat, player);
        }
      } else {
        // Default to overall if no badges
        await actor.addPlayer('overall', player);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allPlayers'] });
      queryClient.invalidateQueries({ queryKey: ['rawRankingData'] });
      queryClient.invalidateQueries({ queryKey: ['playersByCategory'] });
    },
  });
}

export function useRemovePlayer() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (uuid: string) => {
      if (!actor) throw new Error('Actor not available');
      await actor.removePlayer(uuid);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allPlayers'] });
      queryClient.invalidateQueries({ queryKey: ['rawRankingData'] });
      queryClient.invalidateQueries({ queryKey: ['playersByCategory'] });
    },
  });
}
