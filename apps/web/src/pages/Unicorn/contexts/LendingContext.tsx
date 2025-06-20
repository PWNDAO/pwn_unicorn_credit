import React, { ReactNode, createContext, useContext } from 'react'
import { PoolData } from 'uniswap/src/components/TokenSelector/lists/TokenSelectorPoolsList'
import { CurrencyInfo } from 'uniswap/src/features/dataApi/types'
import {
  APP_TABS,
  ModalState,
  SelectedProposal,
  SelectionModalAction,
  SelectionModalMode,
  SelectionModalState,
  useLendingState,
} from '../hooks/lendingState'

// Define the shape of the context value, mirroring the return type of useLendingState
interface LendingContextType {
  selectionModalState: SelectionModalState
  selectedPool: PoolData | null
  selectedAsset: CurrencyInfo | null
  assetInputValue: string
  selectedAppTab: APP_TABS
  selectedAsset2: CurrencyInfo | null
  ltv: number | null
  interestRate: number | null
  selectedProposal: SelectedProposal | null
  isOffersClosed: boolean
  proposals: any[]
  bestProposal: any
  shouldShowOffers: boolean
  selectionModalDispatch: React.Dispatch<SelectionModalAction>
  selectAppTab: (tab: APP_TABS) => void
  changePool: (pool: PoolData | null) => void
  changeAsset: (asset: CurrencyInfo | null) => void
  setAssetInputValue: (value: string) => void
  changeAsset2: (asset: CurrencyInfo | null) => void
  setLtv: (ltv: number | null) => void
  setInterestRate: (rate: number | null) => void
  changeSelectedProposal: (proposal: SelectedProposal | null) => void
  getAssetsByPoolSelected: any[]
  getAssetsByPriceFeedExists: any[]
  getPredefinedAssetsForSecondAsset: any[]
  closeOffers: (value: boolean) => void
  handleResetStates: (mode?: 'full') => void
  handleCreateLoan: (proposal: SelectedProposal) => Promise<void>
  handleDiscardAcceptProposal: () => void
  handleOnSelectAcceptProposal: (proposal: SelectedProposal) => void
  handleOnClickCloseChevron: () => void
}

const LendingContext = createContext<LendingContextType | undefined>(undefined)

export const LendingStateProvider = ({ children }: { children: ReactNode }) => {
  const lendingState = useLendingState()
  return <LendingContext.Provider value={lendingState as LendingContextType}>{children}</LendingContext.Provider>
}

export const useLendingContext = () => {
  const context = useContext(LendingContext)
  if (context === undefined) {
    throw new Error('useLendingContext must be used within a LendingStateProvider')
  }
  return context
}

// Re-export enums/types that might be needed by consumers of the context
export { APP_TABS, ModalState, SelectionModalMode }
export type { CurrencyInfo, PoolData, SelectionModalState }
