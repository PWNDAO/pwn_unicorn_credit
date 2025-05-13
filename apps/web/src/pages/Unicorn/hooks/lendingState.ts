import { useMemo, useReducer, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PoolData } from 'uniswap/src/components/TokenSelector/lists/TokenSelectorPoolsList'
import { TokenOptionSection } from 'uniswap/src/components/TokenSelector/types'
import { CurrencyInfo } from 'uniswap/src/features/dataApi/types'
import { useAccount, useWalletClient } from 'wagmi'
import { mockTokensBalances } from '../mocks/mockTokens'

export enum SelectionModalMode {
  ASSET = 'asset',
  POOL = 'pool',
  ASSET_2 = 'asset_2',
}

export enum ModalState {
  OPEN = 'open',
  CLOSE = 'close',
}

export enum APP_TABS {
  BORROW = 'borrow',
  LEND = 'lend',
  MY_ACTIVITY = 'my-activity',
}

export type SelectionModalState = {
  mode: SelectionModalMode | null
  isOpen: boolean
}

export type SelectionModalAction = { type: ModalState.OPEN; mode: SelectionModalMode } | { type: ModalState.CLOSE }

export const useLendingState = () => {
  const { address } = useAccount()

  // states
  const selectionModalReducer = (state: SelectionModalState, action: SelectionModalAction): SelectionModalState => {
    switch (action.type) {
      case ModalState.OPEN:
        return {
          isOpen: true,
          mode: action.mode,
        }
      case ModalState.CLOSE:
        return {
          isOpen: false,
          mode: null,
        }
      default:
        return state
    }
  }

  const [selectionModalState, selectionModalDispatch] = useReducer(selectionModalReducer, {
    mode: null,
    isOpen: false,
  })

  const [assetInputValue, setAssetInputValue] = useState<string>('')
  const [selectedAppTab, selectAppTab] = useState<APP_TABS>(APP_TABS.BORROW)

  // this is only relevant for borrow, you select your own pool
  const [selectedPool, changePool] = useState<PoolData | null>(null)

  // this is credit, can be as you borrow it or lend it
  const [selectedAsset, changeAsset] = useState<CurrencyInfo | null>(null)

  // variable second asset in pool pair
  // relevant for lend
  const [selectedAsset2, changeAsset2] = useState<CurrencyInfo | null>(null)

  const [ltv, setLtv] = useState<number | null>(null)
  const [interestRate, setInterestRate] = useState<number | null>(null)

  const [selectedProposal, changeSelectedProposal] = useState<any>(null)

  const [isOffersClosed, closeOffers] = useState<boolean>(false)

  const getAssetsByPoolSelected = useMemo(() => {
    if (!selectedPool) return []

    return [
      {
        ...mockTokensBalances[0],
        sectionKey: TokenOptionSection.PredefinedAssets,
      },
    ]
  }, [selectedPool])

  const handleResetStates = (mode?: 'full') => {
    changePool(null)
    changeAsset(null)
    changeAsset2(null)
    setAssetInputValue('')
    closeOffers(false)

    if (mode === 'full') {
      changeSelectedProposal(null)
    }
  }

  const { data: walletClient } = useWalletClient()
  const navigate = useNavigate()

  const handleCreateLoan = async (proposal: any) => {
    try {
      const signature = await walletClient?.signMessage({
        message: 'You will be creating the request in here, in your wallet.',
      })
      console.log('signature', signature)

      handleResetStates('full')
      navigate('/borrow', { replace: true })
    } catch (error) {
      console.error('error', error)
    }
  }

  const handleDiscardAcceptProposal = () => {
    handleResetStates('full')
    navigate(`/${selectedAppTab}`, { replace: true })
  }

  return {
    // state
    selectionModalState,
    selectedPool,
    selectedAsset,
    assetInputValue,
    selectedAppTab,
    selectedAsset2,
    ltv,
    interestRate,
    selectedProposal,
    isOffersClosed,
    // functions
    selectionModalDispatch,
    selectAppTab,
    changePool,
    changeAsset,
    setAssetInputValue,
    changeAsset2,
    setLtv,
    setInterestRate,
    changeSelectedProposal,
    getAssetsByPoolSelected,
    closeOffers,
    handleResetStates,
    handleCreateLoan,
    handleDiscardAcceptProposal,
  }
}
