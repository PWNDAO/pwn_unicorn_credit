import { useQuery } from '@tanstack/react-query'

export const useAssetPrice = (chainId: number | undefined, contractAddress: string | undefined) => {
  return useQuery({
    queryKey: ['assetPrice', chainId, contractAddress],
    queryFn: async () => {
      const url = `https://api-staging.pwn.xyz/api/v1/asset/price/${encodeURIComponent(String(chainId))}/${encodeURIComponent(String(contractAddress))}/null`
      const response = await fetch(url, { method: 'GET', headers: { 'Content-Type': 'application/json' } })
      const data = await response.json()
      const priceData = Number(data?.best_price?.price?.usd_amount || 0) ?? 0
      return priceData
    },
    enabled: !!chainId && !!contractAddress,
    staleTime: 1000 * 60 * 60 * 24,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchInterval: 1000 * 60 * 60 * 24,
    refetchIntervalInBackground: false,
  })
}
