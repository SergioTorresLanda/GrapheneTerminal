import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { TradeService } from '../services/api';

export const useTradeHistory = () => {
  const queryClient = useQueryClient();

  // 1. The Query: Reading data
  const historyQuery = useQuery({
    queryKey: ['trades', 'history'],
    queryFn: TradeService.getHistory,
  });

  // 2. The Mutation: Changing data
  const tradeMutation = useMutation({
    mutationFn: TradeService.executeTrade,
    onSuccess: () => {
      // After a successful trade, invalidate the history 
      // so TanStack Query automatically refetches the list in the background.
      queryClient.invalidateQueries({ queryKey: ['trades', 'history'] });
    },
  });

  return {
    trades: historyQuery.data ?? [],
    isLoading: historyQuery.isLoading,
    isRefetching: historyQuery.isRefetching,
    error: historyQuery.error,
    executeTrade: tradeMutation.mutate,
    isTrading: tradeMutation.isPending,
  };
};