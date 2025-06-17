import { useMemo, useReducer, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PoolData } from 'uniswap/src/components/TokenSelector/lists/TokenSelectorPoolsList'
import { TokenOptionSection } from 'uniswap/src/components/TokenSelector/types'
import { CurrencyInfo } from 'uniswap/src/features/dataApi/types'
import { parseUnits } from 'viem'
import { useAccount, useConfig, useWalletClient } from 'wagmi'
import { mockLendingProposals } from '../mocks/mockProposal'
import { mockTokensBalances } from '../mocks/mockTokens'
// import { useUserWithNonce } from "@pwndao/sdk-v1-react"
import {
  ERC20Token,
  getUniqueCreditCollateralKey,
  SupportedChain,
  UniswapV3Position,
  ZERO_ADDRESS,
} from '@pwndao/sdk-core'
import {
  API,
  createUtilizedCreditId,
  makeProposal,
  ProposalType,
  SimpleLoanContract,
  UniswapV3LpIndividualProposalContract,
} from '@pwndao/v1-core'

export enum UniswapV3PoolContractByChain {
  Sepolia = '0x03a520b32C04BF3bEEf7BEb72E919cf822Ed34f1',
}

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
  const [selectedAsset, setAsset] = useState<CurrencyInfo | null>(null)

  // variable second asset in pool pair
  // relevant for lend
  const [selectedAsset2, changeAsset2] = useState<CurrencyInfo | null>(null)

  const [ltv, setLtv] = useState<number | null>(null)
  const [interestRate, setInterestRate] = useState<number | null>(null)

  const [selectedProposal, changeSelectedProposal] = useState<SelectedProposal | null>(null)

  const [isOffersClosed, closeOffers] = useState<boolean>(false)

  const proposals = useMemo(() => {
    return mockLendingProposals
      .filter((p) => {
        const credit = parseUnits(assetInputValue, selectedAsset?.currency?.decimals ?? 0) ?? 0n
        const mode = selectedAppTab === APP_TABS.BORROW ? 'borrow' : selectedAppTab === APP_TABS.LEND ? 'lend' : 'all'
        if (mode === 'borrow') {
          if (interestRate) {
            return (credit > 0n ? p.creditAmount >= Number(credit) : true) && p.apr <= interestRate * 1000
          } else {
            return credit > 0n ? p.creditAmount >= Number(credit) : true
          }
        } else if (mode === 'lend') {
          if (interestRate) {
            return (credit > 0n ? p.creditAmount <= Number(credit) : true) && p.apr >= interestRate * 1000
          } else {
            return credit > 0n ? p.creditAmount <= Number(credit) : true
          }
        } else {
          return true
        }
      })
      .sort((a, b) => {
        const mode = selectedAppTab === APP_TABS.BORROW ? 'borrow' : selectedAppTab === APP_TABS.LEND ? 'lend' : 'all'
        if (a.apr !== b.apr) {
          return mode === 'lend' ? b.apr - a.apr : a.apr - b.apr
        }

        if (a.creditAmount !== b.creditAmount) {
          return Number(a.creditAmount - b.creditAmount)
        }

        return 0
      })
  }, [assetInputValue, selectedAsset, selectedAppTab, interestRate])

  const bestProposal = useMemo(() => {
    if (!proposals || proposals.length === 0) return null
    const mode = selectedAppTab === APP_TABS.BORROW ? 'borrow' : selectedAppTab === APP_TABS.LEND ? 'lend' : 'all'
    if (mode === 'lend' && !selectedAsset) return null
    if (mode === 'borrow' && !selectedPool) return null

    // TODO: some algo, maybe even [best, cheapest, etc]
    // make it interest
    return {
      [proposals[0].id]: proposals[0],
    }
  }, [proposals, selectedPool, selectedAsset, selectedAppTab])

  const shouldShowOffers = useMemo(() => {
    const isBorrowOrLend = [APP_TABS.BORROW, APP_TABS.LEND].includes(selectedAppTab)
    if (!isBorrowOrLend) return false

    const isRespectiveSelection =
      selectedAppTab === APP_TABS.LEND
        ? selectedAsset && assetInputValue
        : selectedPool && selectedAsset && assetInputValue

    if (!isRespectiveSelection) return false

    if (isOffersClosed) return false

    if (!bestProposal) return false

    return true
  }, [selectedAppTab, selectedAsset, selectedPool, isOffersClosed, assetInputValue, bestProposal])

  const changeAsset = (asset: CurrencyInfo | null) => {
    setAsset(asset)
    const isSameAsSecondAsset = (asset?.currency as any)?.address === (selectedAsset2?.currency as any)?.address
    if (selectedAppTab === APP_TABS.LEND && isSameAsSecondAsset) {
      // cant have LP consisting of the same asset
      changeAsset2(null)
    }
  }

  const getAssetsByPriceFeedExists = useMemo(() => {
    // get allowlist for chain
    return [
      {
        ...mockTokensBalances[0],
        data: mockTokensBalances[0].data.map((t) => ({
          ...t,
          balanceUSD: 0,
          quantity: 0,
        })),
        sectionKey: TokenOptionSection.PredefinedAssets,
      },
    ]
  }, [])

  const getPredefinedAssetsForSecondAsset = useMemo(() => {
    if (!selectedAsset) return []
    const filtered = mockTokensBalances[0]?.data
      ?.filter((t) => (t?.currencyInfo?.currency as any)?.address !== (selectedAsset?.currency as any)?.address)
      .map((t) => ({
        ...t,
        balanceUSD: 0,
        quantity: 0,
      }))
    return [
      {
        ...mockTokensBalances[0],
        data: filtered,
        sectionKey: TokenOptionSection.PredefinedAssets,
      },
    ]
  }, [selectedAsset])

  const getAssetsByPoolSelected = useMemo(() => {
    if (!selectedPool) return []

    return [
      {
        ...mockTokensBalances[0],
        data: mockTokensBalances[0].data.map((t) => ({
          ...t,
          balanceUSD: 0,
          quantity: 0,
        })),
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
      if (!walletClient) throw new Error('No wallet')
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

  // must be used within wagmiprovider???? even though it is, figure oout
  // const { userWithNonce } = useUserWithNonce([11155111])
  const config = useConfig()

  const handleCreateProposal = async () => {
    const chaindId = selectedAsset?.currency?.chainId as SupportedChain
    const collateral = new UniswapV3Position(
      chaindId,
      UniswapV3PoolContractByChain.Sepolia,
      selectedPool?.tokens.token0.address,
      selectedPool?.tokens?.token1?.address,
      Number(selectedPool?.poolId).toString(),
    )
    const credit = new ERC20Token(
      chaindId,
      (selectedAsset?.currency as any)?.address,
      (selectedAsset?.currency as any)?.decimals ?? 18,
      (selectedAsset?.currency as any)?.name,
      (selectedAsset?.currency as any)?.symbol,
      (selectedAsset?.currency as any)?.logoUrl ?? '',
    )
    const ltvAndAprKey = getUniqueCreditCollateralKey(credit, collateral)
    const contract = new UniswapV3LpIndividualProposalContract(config as any)
    const utilizedCreditId = createUtilizedCreditId({
      proposer: '0x0000000000000000000000000000000000000000' as `0x${string}`, // userWithNonce?.address as `0x${string}`,
      availableCreditLimit: parseUnits(assetInputValue, selectedAsset?.currency?.decimals ?? 0) ?? 0n,
    })
    const proposal = await makeProposal<ProposalType.UniswapV3Individual>(
      null as any,
      ProposalType.UniswapV3Individual,
      {
        // userWithNonce
        expirationDays: 15,
        creditAmount: parseUnits(assetInputValue, selectedAsset?.currency?.decimals ?? 0) ?? 0n,
        ltv: {
          [ltvAndAprKey]: 6500,
        },
        apr: {
          [ltvAndAprKey]: (interestRate ?? 0) * 1000,
        },
        utilizedCreditId,
        duration: {
          // SDK doesnt require this??????
          days: 30,
          date: undefined,
        },
        collateral,
        credit,
        minCreditAmount: 0n,
        minCreditAmountPercentage: 0,
        acceptorController: ZERO_ADDRESS,
        acceptorControllerData: ZERO_ADDRESS,
        collateralId: selectedPool?.poolId.toString() ?? '',
        token0Denominator: true,
        isOffer: false,
        sourceOfFunds: null,
      },
      {
        api: {
          // these two wont be needed, because we are doing onchain proposals from proposal contract
          persistProposal: async () => {
            return {} as any
          },
          persistProposals: async () => {
            return [] as any
          },
          updateNonces: API.post.updateNonce,
        },
        contract: contract,
        loanContract: new SimpleLoanContract(config as any),
      },
    )
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
    proposals,
    bestProposal,
    shouldShowOffers,
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
    getAssetsByPriceFeedExists,
    getPredefinedAssetsForSecondAsset,
    closeOffers,
    handleResetStates,
    handleCreateLoan,
    handleDiscardAcceptProposal,
    handleOnSelectAcceptProposal,
    handleOnClickCloseChevron,
    handleCreateProposal,
  }
}
