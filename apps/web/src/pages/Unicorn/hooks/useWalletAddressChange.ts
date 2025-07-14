import { useQueryClient } from '@tanstack/react-query'
import { useAccount } from 'hooks/useAccount'
import { useEffect, useRef } from 'react'

/**
 * Hook to invalidate queries when wallet address changes
 * This ensures fresh data is fetched when a user switches wallets
 */
export const useWalletAddressChange = () => {
  const account = useAccount()
  const queryClient = useQueryClient()
  const previousAddress = useRef<string | undefined>(undefined)

  useEffect(() => {
    const currentAddress = account.address
    
    // If address changed and we have a previous address, invalidate queries
    if (previousAddress.current && currentAddress !== previousAddress.current) {
      // Invalidate all proposals and loans queries
      queryClient.invalidateQueries({ queryKey: ['proposals'] })
      queryClient.invalidateQueries({ queryKey: ['loans'] })
    }
    
    // Update the previous address
    previousAddress.current = currentAddress
  }, [account.address, queryClient])
} 