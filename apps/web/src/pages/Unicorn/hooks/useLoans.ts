import { useQuery } from '@tanstack/react-query'
import { useAccount } from 'hooks/useAccount'

// Types for loans - you can adjust these based on your SDK response
export interface Loan {
  id: string
  chainId: number
  creditAmount: number
  creditAsset: {
    address: string
    symbol: string
    decimals: number
    name: string
    chainId: number
    logoUrl: string
  }
  creditData: {
    accruingInterestApr: number
    amount: number
    apr: number
    fixedInterestAmount: number
    ltv: number
    totalRepaymentAmount: number
  }
  loanTokenContractAddress: string
  originalLender: string
  loanOwner: string
  startDate: number
  duration: number
  defaultDate: number
  proposer: string
  hash: string
  borrower: string
  status: number
  type: string
  collateral: {
    tokenA: string
    tokenB: string
    tokenId: string
    address: string
    chainId: number
    category: number
    name: string
    symbol: string
    decimals: number
  }
  expiration: number
}

interface UseLoansOptions {
  mode: 'lend' | 'borrow'
  enabled?: boolean
}

export const useLoans = ({ mode, enabled = true }: UseLoansOptions) => {
  const account = useAccount()

  return useQuery({
    queryKey: ['loans', account.address, mode],
    queryFn: async (): Promise<Loan[]> => {
      // TODO: Replace this with your actual SDK call
      // This is a placeholder that will be replaced by your SDK implementation
      const response = await fetch(`/api/loans?address=${account.address}&mode=${mode}`)
      if (!response.ok) {
        throw new Error('Failed to fetch loans')
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