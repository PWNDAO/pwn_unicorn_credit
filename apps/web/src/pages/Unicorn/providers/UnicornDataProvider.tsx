import { PropsWithChildren } from 'react'
import { useWalletAddressChange } from '../hooks/useWalletAddressChange'

/**
 * Provider component that handles wallet address changes and invalidates queries
 * This should be used at a higher level in the component tree
 */
export const UnicornDataProvider = ({ children }: PropsWithChildren) => {
  // This hook will automatically invalidate queries when wallet address changes
  useWalletAddressChange()

  return <>{children}</>
} 