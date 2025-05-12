import { PrefetchBalancesWrapper } from 'graphql/data/apollo/AdaptiveTokenBalancesProvider'
import { useAccount } from 'hooks/useAccount'
import { MultichainContextProvider } from 'state/multichain/MultichainContext'
import { Flex, SegmentedControl, SegmentedControlOption, Text } from 'ui/src'
import { TokenSelectorModal, TokenSelectorVariation } from 'uniswap/src/components/TokenSelector/TokenSelector'
import { TokenSelectorFlow } from 'uniswap/src/components/TokenSelector/types'
import { Token } from 'uniswap/src/data/graphql/uniswap-data-api/__generated__/types-and-hooks'
import { CurrencyInfo } from 'uniswap/src/features/dataApi/types'
import { TransactionSettingsContextProvider } from 'uniswap/src/features/transactions/settings/contexts/TransactionSettingsContext'
import { TransactionSettingKey } from 'uniswap/src/features/transactions/settings/slice'
import {
  SwapFormContextProvider,
} from 'uniswap/src/features/transactions/swap/contexts/SwapFormContext'
import { APP_TABS, ModalState, SelectionModalMode, useLendingState } from './hooks/lendingState'
import { PoolData } from 'uniswap/src/components/TokenSelector/lists/TokenSelectorPoolsList'
import { CurrencyField } from 'uniswap/src/types/currency'
import { AvailableOffersCards } from './components/AvailableOffersCards'
import { BorrowFlow } from './components/BorrowFlow'
import { LendFlow } from './components/LendFlow'
import { useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useMemo, useState } from 'react'
import { parseUnits } from 'viem'
import { AcceptProposalFlow } from './components/AcceptProposalFlow'
const LendingDialog = () => {
  const navigate = useNavigate()
  const pathname = useLocation().pathname
  const whichTab = useMemo(() => {
    if (pathname === '/borrow') return APP_TABS.BORROW
    if (pathname === '/lend') return APP_TABS.LEND
    if (pathname === '/my-activity') return APP_TABS.MY_ACTIVITY
    if (pathname === '/market') return APP_TABS.MARKET
    if (pathname === '/accept-proposal') return APP_TABS.ACCEPT_PROPOSAL
    return APP_TABS.BORROW
  }, [pathname])

  useEffect(() => {
    if (whichTab === APP_TABS.ACCEPT_PROPOSAL && !isShowAcceptProposal && !selectedProposal) {
      navigate('/borrow', { replace: true })
    }
    selectAppTab(whichTab)
  }, [whichTab])

  const { address } = useAccount()

  const {
    // state
    selectionModalState,
    selectedAppTab,
    selectedPool,
    selectedAsset,
    selectedAsset2,
    assetInputValue,
    ltv,
    interestRate,
    isShowAcceptProposal,
    selectedProposal,
    // functions
    selectionModalDispatch,
    selectAppTab,
    changePool,
    changeAsset,
    setAssetInputValue,
    changeAsset2,
    setLtv,
    setInterestRate,
    changeShowAcceptProposal,
    changeSelectedProposal,
    getAssetsByPoolSelected,
  } = useLendingState()

  const tabs: SegmentedControlOption[] = Object.values(APP_TABS).filter(tab => {
    return isShowAcceptProposal ? true : tab !== APP_TABS.ACCEPT_PROPOSAL
  }).map((tab) => ({
    display: (
      <Text
        variant="buttonLabel3"
        hoverStyle={{ color: '$neutral1' }}
        color={selectedAppTab === tab ? '$neutral1' : '$neutral2'}
        tag="h1"
      > 
        {tab.includes('-') ? 
          tab.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ') :
          tab.charAt(0).toUpperCase() + tab.slice(1).toLowerCase().replace('_', ' ')
        }
      </Text>
    ),
    value: tab.toLowerCase(),
  }))

  const handleOnChangeTab = (option: APP_TABS) => {
    // reset state
    changePool(null)
    changeAsset(null)
    changeAsset2(null)
    setAssetInputValue('')
    changeShowAcceptProposal(false)
    changeSelectedProposal(null)

    // select tab
    selectAppTab(option)
    navigate(`/${option.toLowerCase()}`, { replace: true })
  }
  
  const handleAcceptProposal = (proposal: any) => {
    changeShowAcceptProposal(true)
    navigate(`/${APP_TABS.ACCEPT_PROPOSAL}`, { replace: true })
    changeSelectedProposal({
      ...proposal,
      pool: selectedPool,
      mode: selectedAppTab === APP_TABS.BORROW ? 'borrow' : 'lend'
    })
  }


  return (
    <Flex width={'$full'} minWidth={'700px'} maxWidth={'$full'} gap="$spacing8" flexDirection="column" alignItems='center'>
      <SegmentedControl
        options={tabs}
        disabled={false}
        selectedOption={selectedAppTab}
        onSelectOption={(option) => handleOnChangeTab(option as APP_TABS)}
        outlined={false}
        size="large"
      />
      <Flex grow gap="$spacing8" justifyContent="space-between">
        <Flex flexDirection="row" gap="$spacing8" width={'100%'}>
          <Flex animation="quick" enterStyle={{ opacity: 0 }} exitStyle={{ opacity: 0 }} gap="$spacing16" alignItems='center'>
            {selectedAppTab === APP_TABS.BORROW && 
              <BorrowFlow
                selectedPool={selectedPool as PoolData}
                selectedAsset={selectedAsset as CurrencyInfo}
                setAssetInputValue={setAssetInputValue}
                selectionModalDispatch={selectionModalDispatch}
                amountInputValue={assetInputValue}
                ltvCallback={(ltv) => setLtv(ltv)}
                interestRateCallback={(interestRate) => setInterestRate(interestRate)}
              />
            }

            {selectedAppTab === APP_TABS.LEND &&
              <LendFlow
                selectedAsset={selectedAsset as CurrencyInfo}
                selectedAsset2={selectedAsset2 as CurrencyInfo}
                setAssetInputValue={setAssetInputValue}
                selectionModalDispatch={selectionModalDispatch}
                ltvCallback={(ltv) => setLtv(ltv)}
                interestRateCallback={(interestRate) => setInterestRate(interestRate)}
              />
            }

            {selectedAppTab === APP_TABS.MY_ACTIVITY &&
              <Flex
                backgroundColor="$surface1"
                width="100%"
                height="30rem"
                borderRadius="$rounded16"
              >
                <AvailableOffersCards />
              </Flex>
            }
            {selectedAppTab === APP_TABS.MARKET &&
              <Flex
                backgroundColor="$surface1"
                width="100%"
                height="30rem"
                borderRadius="$rounded16"
              >
                <AvailableOffersCards />
              </Flex>
            }

            {selectedAppTab === APP_TABS.ACCEPT_PROPOSAL &&
              <AcceptProposalFlow
                selectedProposal={selectedProposal}
              />
            }

          </Flex>
          { [APP_TABS.BORROW, APP_TABS.LEND].includes(selectedAppTab) && 
            (
              (selectedAppTab === APP_TABS.LEND && selectedAsset) || 
              (selectedAppTab === APP_TABS.BORROW && selectedPool)
            ) &&
            <AvailableOffersCards 
              creditAmount={parseUnits(assetInputValue, selectedAsset?.currency.decimals ?? 0)}
              ltv={ltv ? ltv * 1000 : undefined}
              interestRate={interestRate ? interestRate * 1000 : undefined}
              mode={selectedAppTab === APP_TABS.BORROW ? 'borrow' : (selectedAppTab === APP_TABS.LEND ? 'lend' : 'all')}
              handleAcceptProposal={handleAcceptProposal}
            />
          }
        </Flex>
        <TokenSelectorModal
          isModalOpen={selectionModalState.isOpen}
          variation={
            selectionModalState.mode === SelectionModalMode.POOL ? 
              TokenSelectorVariation.PoolOnly : 
              selectedAppTab === APP_TABS.BORROW ? TokenSelectorVariation.FixedAssetsOnly : TokenSelectorVariation.SwapInput
          }
          predefinedAssets={selectedAppTab === APP_TABS.BORROW ? getAssetsByPoolSelected : []}
          currencyField={selectionModalState.mode === SelectionModalMode.POOL ? CurrencyField.INPUT : CurrencyField.OUTPUT}
          flow={TokenSelectorFlow.Send}
          onClose={() => selectionModalDispatch({ type: ModalState.CLOSE })}
          activeAccountAddress={address}
          onSelectCurrency={(currency, field, isBridgePair, poolData) => {
            if (!poolData && currency) {
              const [currencySymbol, currencyLogoUrl] = (currency as any)?.symbol?.split('###') ?? []
              const currencyInfo: CurrencyInfo = {
                currency: {
                  address: (currency as unknown as Token)?.address ?? '',
                  decimals: currency?.decimals ?? 0,
                  name: currency?.name ?? '',
                  symbol: currencySymbol ?? '',
                  isNative: false,
                  isToken: true,
                  chainId: currency?.chainId ?? 0,
                  wrapped: currency?.wrapped,
                  equals: currency?.equals,
                  sortsBefore: () => false,
                },
                currencyId: field?.toString() ?? '',
                logoUrl: currencyLogoUrl ?? '',
              }

              if (selectionModalState.mode === SelectionModalMode.ASSET) {
                changeAsset(currencyInfo)
              } else if (selectionModalState.mode === SelectionModalMode.ASSET_2) {
                changeAsset2(currencyInfo)
              }
            } else {
              changePool(poolData as PoolData)
            }
            selectionModalDispatch({ type: ModalState.CLOSE })
          }}
        />
      </Flex>
    </Flex>
  )
}

export const ActionDialog = () => {
  return (
    <Flex>
      <MultichainContextProvider initialChainId={1}>
        <TransactionSettingsContextProvider settingKey={TransactionSettingKey.Swap}>
          <PrefetchBalancesWrapper>
            <SwapFormContextProvider prefilledState={{} as any} hideFooter hideSettings>
              <LendingDialog />
            </SwapFormContextProvider>
          </PrefetchBalancesWrapper>
        </TransactionSettingsContextProvider>
      </MultichainContextProvider>
    </Flex>
  )
}
