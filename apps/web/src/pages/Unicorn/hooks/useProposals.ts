import { useQuery } from '@tanstack/react-query'
import { useAccount } from 'hooks/useAccount'

// Types for proposals - you can adjust these based on your SDK response
export interface Proposal {
  id: string
  chainId: number
  tokenAAllowList: string[]
  tokenBAllowList: string[]
  creditAmount: number
  creditAsset: {
    address: string
    symbol: string
    decimals: number
    name: string
    chainId: number
    logoUrl: string
  }
  loanToValue: number
  expiration: number
  apr: number
  proposer: string
  hash: string
}

interface UseProposalsOptions {
  mode: 'lend' | 'borrow'
  enabled?: boolean
}

export const useProposals = ({ mode, enabled = true }: UseProposalsOptions) => {
  const account = useAccount()

  return useQuery({
    queryKey: ['proposals', account.address, mode],
    queryFn: async (): Promise<Proposal[]> => {
      // TODO: Replace this with your actual SDK call
      // This is a placeholder that will be replaced by your SDK implementation
      const response = await fetch(`/api/proposals?address=${account.address}&mode=${mode}`)
      if (!response.ok) {
        throw new Error('Failed to fetch proposals')
      }
      return response.json()
    },
    enabled: enabled && !!account.address,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    refetchOnReconnect: true,
  })
} 