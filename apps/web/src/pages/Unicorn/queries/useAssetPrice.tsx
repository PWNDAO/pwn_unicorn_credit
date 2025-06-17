import { useQuery } from '@tanstack/react-query'

export const useAssetPrice = (chainId: number | undefined, contractAddress: string | undefined) => {
  return useQuery({
    queryKey: ['assetPrice', chainId, contractAddress],
    queryFn: async () => {
      // For Sepolia testnet, use mock data from localStorage
      if (chainId && chainId === 11155111) {
        const storageKey = `mockPrice_${chainId}_${contractAddress}`
        let mockPrice = localStorage.getItem(storageKey)
        
        if (!mockPrice) {
          // Generate random price between $0.01 and $1000
          const randomPrice = Math.random() * 1000 + 5
          mockPrice = randomPrice.toFixed(2)
          localStorage.setItem(storageKey, mockPrice)
        }
        
        console.log('Using mock price for Sepolia:', mockPrice)
        return Number(mockPrice)
      }
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
