import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { RawRankingData, PlayerRanking } from '../backend';

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
          diamondSmpNethopSpear: [],
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
      if (!actor || !searchTerm) return [];
      return actor.searchPlayersByName(searchTerm);
    },
    enabled: !!actor && !isFetching && searchTerm.length > 0,
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

export function useAddPlayer() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (player: PlayerRanking) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addPlayer(player);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allPlayers'] });
      queryClient.invalidateQueries({ queryKey: ['rawRankingData'] });
    },
  });
}
