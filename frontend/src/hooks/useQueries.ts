import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { PlayerRanking, RawRankingData } from '../backend';
import type { CategoryKey } from '../data/mockData';

const ALL_CATEGORY_KEYS: CategoryKey[] = [
  'overall',
  'spearMace',
  'vanilla',
  'uhc',
  'diamondSmp',
  'spear',
  'nethop',
  'smp',
  'sword',
  'axe',
  'mace',
];

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

export interface AddPlayerPayload {
  category: string;
  player: PlayerRanking;
}

export function useAddPlayer() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ category, player }: AddPlayerPayload) => {
      if (!actor) throw new Error('Actor not available');
      await actor.addPlayer(category, player);
    },
    onSuccess: (_data, variables) => {
      // Invalidate the specific category that was added to
      queryClient.invalidateQueries({ queryKey: ['playersByCategory', variables.category] });
      // Also invalidate allPlayers and rawRankingData for completeness
      queryClient.invalidateQueries({ queryKey: ['allPlayers'] });
      queryClient.invalidateQueries({ queryKey: ['rawRankingData'] });
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
      // Invalidate all category queries since removePlayer removes from ALL categories
      ALL_CATEGORY_KEYS.forEach((key) => {
        queryClient.invalidateQueries({ queryKey: ['playersByCategory', key] });
      });
      queryClient.invalidateQueries({ queryKey: ['allPlayers'] });
      queryClient.invalidateQueries({ queryKey: ['rawRankingData'] });
    },
  });
}
