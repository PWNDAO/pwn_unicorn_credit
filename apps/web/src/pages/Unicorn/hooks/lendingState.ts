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
  MY_LENDING = 'my-lending',
  MY_BORROWING = 'my-borrowing',
}

export type SelectionModalState = {
  mode: SelectionModalMode | null
  isOpen: boolean
}

export type SelectionModalAction = { type: ModalState.OPEN; mode: SelectionModalMode } | { type: ModalState.CLOSE }

export type SelectedProposal = {
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
  mode: 'borrow' | 'lend'
  pool: PoolData | null
}

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

  const [selectedProposal, changeSelectedProposal] = useState<SelectedProposal | null>(null)

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

  const onOpenBorrowSelectAcceptProposal = (proposal: SelectedProposal) => {
    const creditAssetObject: CurrencyInfo = {
      currency: {
        ...(proposal?.creditAsset as any),
      },
      currencyId: proposal?.creditAsset.address as string,
      logoUrl: proposal?.creditAsset.logoUrl,
    }
    closeOffers(true)
    changeAsset(creditAssetObject)
    changeSelectedProposal({
      ...proposal,
      pool: selectedPool,
      mode: 'borrow',
    })
    navigate(`?accept=${proposal.id}`, { replace: false })
  }

  const onCloseBorrowSelectAcceptProposal = (proposal: SelectedProposal) => {
    changeSelectedProposal(null)
    setInterestRate(proposal?.apr)
    closeOffers(false)
    navigate(`/${selectedAppTab}`, { replace: true })
  }

  const onCloseLendSelectAcceptProposal = (proposal: SelectedProposal) => {
    changeSelectedProposal(null)
    setInterestRate(proposal?.apr)
    closeOffers(false)
    navigate(`/${selectedAppTab}`, { replace: true })
  }

  const onOpenLendSelectAcceptProposal = (proposal: SelectedProposal) => {
    const creditAssetObject: CurrencyInfo = {
      currency: {
        ...(proposal?.creditAsset as any),
      },
      currencyId: proposal?.creditAsset.address as string,
      logoUrl: proposal?.creditAsset.logoUrl,
    }
    changeAsset(creditAssetObject)
    const asset2: CurrencyInfo = {
      currency: {
        address: '0x4200000000000000000000000000000000000006',
        decimals: 18,
        isNative: false,
        isToken: true,
        symbol: 'WETH',
        chainId: 8453,
      } as any,
      currencyId: '0x4200000000000000000000000000000000000006',
      logoUrl: 'https://assets.coingecko.com/coins/images/2518/standard/weth.png?1696503332',
    }
    changeAsset2(asset2)
    closeOffers(true)
    changeSelectedProposal({
      ...proposal,
      mode: 'lend',
      pool: selectedPool,
    })
    navigate(`?accept=${proposal.id}`, { replace: false })
  }

  const handleOnDontWantToAcceptProposalResumeCustom = () => {
    const whichMode = selectedAppTab === APP_TABS.BORROW ? 'borrow' : 'lend'
    if (whichMode === 'borrow') {
      onCloseBorrowSelectAcceptProposal(selectedProposal as SelectedProposal)
    } else {
      onCloseLendSelectAcceptProposal(selectedProposal as SelectedProposal)
    }
  }

  const handleOnSelectAcceptProposal = (proposal: SelectedProposal) => {
    const whichMode = selectedAppTab === APP_TABS.BORROW ? 'borrow' : 'lend'
    if (whichMode === 'borrow') {
      onOpenBorrowSelectAcceptProposal(proposal)
    } else {
      onOpenLendSelectAcceptProposal(proposal)
    }
  }

  // TODO: maybe deprecate
  const handleDiscardAcceptProposal = () => {
    handleResetStates('full')
    navigate(`/${selectedAppTab}`, { replace: true })
  }

  const handleOnClickCloseChevron = () => {
    if (selectedProposal) {
      handleOnDontWantToAcceptProposalResumeCustom()
    } else {
      closeOffers(false)
    }
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
    handleOnSelectAcceptProposal,
    handleOnClickCloseChevron,
  }
}
