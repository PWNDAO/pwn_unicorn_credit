import { PrefetchBalancesWrapper } from 'graphql/data/apollo/AdaptiveTokenBalancesProvider'
import { useAccount } from 'hooks/useAccount'
import { useEffect, useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { MultichainContextProvider } from 'state/multichain/MultichainContext'
import { Button, Flex, SegmentedControl, SegmentedControlOption, Text, useMedia } from 'ui/src'
import { RotatableChevron } from 'ui/src/components/icons/RotatableChevron'
import { TokenSelectorModal, TokenSelectorVariation } from 'uniswap/src/components/TokenSelector/TokenSelector'
import { PoolData } from 'uniswap/src/components/TokenSelector/lists/TokenSelectorPoolsList'
import { TokenSelectorFlow } from 'uniswap/src/components/TokenSelector/types'
import { Currency, Token } from 'uniswap/src/data/graphql/uniswap-data-api/__generated__/types-and-hooks'
import { CurrencyInfo } from 'uniswap/src/features/dataApi/types'
import { TransactionSettingsContextProvider } from 'uniswap/src/features/transactions/settings/contexts/TransactionSettingsContext'
import { TransactionSettingKey } from 'uniswap/src/features/transactions/settings/slice'
import { SwapFormContextProvider } from 'uniswap/src/features/transactions/swap/contexts/SwapFormContext'
import { CurrencyField } from 'uniswap/src/types/currency'
import { AvailableOffersCards } from './components/AvailableOffersCards'
import { BorrowFlow } from './components/BorrowFlow'
import { LendFlow } from './components/LendFlow'
import { MyBorrowing } from './components/MyBorrowing'
import { MyLending } from './components/MyLending'
import { LendingStateProvider, useLendingContext } from './contexts/LendingContext'
import { APP_TABS, ModalState, SelectionModalMode } from './hooks/lendingState'
import { Hook, mockHooks } from './mocks/mockHooks'

const LendingDialog = () => {
  const navigate = useNavigate()
  const pathname = useLocation().pathname
  const {
    // state
    selectionModalState,
    selectedAppTab,
    selectedPool,
    selectedAsset,
    selectedAsset2,
    assetInputValue,
    isOffersClosed,
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
    getAssetsByPoolSelected,
    getAssetsByPriceFeedExists,
    getPredefinedAssetsForSecondAsset,
    handleResetStates,
    handleOnClickCloseChevron,
    handleOnSelectAcceptProposal,
  } = useLendingContext()

  const media = useMedia()

  const whichTab = useMemo(() => {
    if (pathname === '/borrow') return APP_TABS.BORROW
    if (pathname === '/lend') return APP_TABS.LEND
    if (pathname === '/my-lending') return APP_TABS.MY_LENDING
    if (pathname === '/my-borrowing') return APP_TABS.MY_BORROWING
    return APP_TABS.BORROW
  }, [pathname])

  useEffect(() => {
    selectAppTab(whichTab)
  }, [whichTab])

  const { address } = useAccount()

  const tabCounts: Record<string, number> = {
    [APP_TABS.MY_LENDING]: 6,
    [APP_TABS.MY_BORROWING]: 11,
  }

  const tabs: SegmentedControlOption[] = Object.values(APP_TABS).map((tab) => ({
    display: (
      <Flex position="relative" alignItems="center" justifyContent="center">
        <Text
          variant="buttonLabel3"
          hoverStyle={{ color: '$neutral1' }}
          color={selectedAppTab === tab ? '$neutral1' : '$neutral2'}
          tag="h1"
        >
          {tab.includes('-')
            ? tab
                .split('-')
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                .join(' ')
            : tab.charAt(0).toUpperCase() + tab.slice(1).toLowerCase().replace('_', ' ')}
        </Text>
        {typeof tabCounts[tab] === 'number' && tabCounts[tab] > 0 && (
          <Flex
            position="absolute"
            top={-12}
            right={-13}
            minWidth={18}
            height={18}
            px={2}
            backgroundColor="$neutral3"
            borderRadius={9}
            alignItems="center"
            justifyContent="center"
            zIndex={1}
          >
            <Text color="white" fontSize={12} fontWeight={400} userSelect="none" lineHeight={1}>
              {`${tabCounts[tab]}`}
            </Text>
          </Flex>
        )}
      </Flex>
    ),
    value: tab.toLowerCase(),
  }))

  const handleOnChangeTab = (option: APP_TABS) => {
    // reset state
    handleResetStates('full')

    // select tab
    selectAppTab(option)
    navigate(`/${option.toLowerCase()}`, { replace: true })
  }

  const shouldShowCloseOffersChevron = useMemo(() => {
    return (
      [APP_TABS.BORROW, APP_TABS.LEND].includes(selectedAppTab) &&
      ((selectedAppTab === APP_TABS.LEND && selectedAsset && isOffersClosed) ||
        (selectedAppTab === APP_TABS.BORROW && selectedPool && isOffersClosed))
    )
  }, [selectedAppTab, selectedAsset, selectedPool, isOffersClosed])

  const whichVariationOfTokenSelectorModalToUse = useMemo(() => {
    if (selectionModalState.mode === SelectionModalMode.POOL) return TokenSelectorVariation.PoolOnly
    if ([APP_TABS.BORROW, APP_TABS.LEND].includes(selectedAppTab)) return TokenSelectorVariation.FixedAssetsOnly
    return TokenSelectorVariation.SwapInput
  }, [selectionModalState.mode, selectedAppTab])

  const whichPredefinedAssetsToUse = useMemo(() => {
    if (selectedAppTab === APP_TABS.BORROW) return getAssetsByPoolSelected
    if (selectedAppTab === APP_TABS.LEND) {
      if (selectionModalState.mode === SelectionModalMode.ASSET_2) return getPredefinedAssetsForSecondAsset
      else return getAssetsByPriceFeedExists
    }
    return []
  }, [
    selectedAppTab,
    getAssetsByPoolSelected,
    getAssetsByPriceFeedExists,
    getPredefinedAssetsForSecondAsset,
    selectionModalState.mode,
  ])

  const getHooksOrNothing = useMemo(() => {
    if (selectedAppTab === APP_TABS.LEND && selectionModalState.mode === SelectionModalMode.ASSET) return mockHooks
    return undefined
  }, [selectedAppTab, selectionModalState.mode])

  const rightOffset = -10

  return (
    <Flex
      width={'$full'}
      maxWidth={'$full'}
      gap="$spacing8"
      flexDirection="column"
      alignItems="center"
      overflow="hidden"
    >
      <SegmentedControl
        options={tabs}
        disabled={false}
        selectedOption={selectedAppTab}
        onSelectOption={(option) => handleOnChangeTab(option as APP_TABS)}
        outlined={false}
        size={media.sm ? 'small' : 'large'}
      />
      <Flex
        grow
        gap="$spacing8"
        justifyContent="space-between"
        width={media.sm ? '90vw' : '100%'}
        height="85vh"
        overflow="scroll"
      >
        <Flex
          flexDirection={media.xl ? 'column' : 'row'}
          gap="$spacing16"
          width={'100%'}
          backgroundColor={[APP_TABS.BORROW, APP_TABS.LEND].includes(selectedAppTab) ? '$surface2' : 'transparent'}
          p="$spacing16"
          borderRadius="$rounded12"
        >
          <Flex
            animation="quick"
            enterStyle={{ opacity: 0 }}
            exitStyle={{ opacity: 0 }}
            gap="$spacing16"
            alignItems="center"
            width="$full"
          >
            {shouldShowCloseOffersChevron && (
              <Button
                position="absolute"
                top={-10}
                right={rightOffset}
                backgroundColor="$surface1"
                borderColor="$surface3"
                borderRadius="$rounded12"
                borderWidth="$spacing1"
                zIndex={1}
                px="$spacing12"
                py="$spacing8"
                pressStyle={{
                  backgroundColor: 'rgb(35, 33, 34)',
                }}
                hoverStyle={{
                  backgroundColor: 'rgb(35, 33, 34)',
                }}
                onPress={handleOnClickCloseChevron}
              >
                <Text variant="body2" color="$neutral2">
                  <RotatableChevron color="$neutral2" direction="left" height="$spacing24" />
                </Text>
              </Button>
            )}
            {selectedAppTab === APP_TABS.BORROW && (
              <BorrowFlow
                selectedPool={selectedPool as PoolData}
                selectedAsset={selectedAsset as CurrencyInfo}
                setAssetInputValue={setAssetInputValue}
                selectionModalDispatch={selectionModalDispatch}
                amountInputValue={assetInputValue}
                ltvCallback={(ltv) => setLtv(ltv)}
                interestRateCallback={(interestRate) => setInterestRate(interestRate)}
              />
            )}

            {selectedAppTab === APP_TABS.LEND && (
              <LendFlow
                selectedAsset={selectedAsset as CurrencyInfo}
                selectedAsset2={selectedAsset2 as CurrencyInfo}
                setAssetInputValue={setAssetInputValue}
                selectionModalDispatch={selectionModalDispatch}
                ltvCallback={(ltv) => setLtv(ltv)}
                interestRateCallback={(interestRate) => setInterestRate(interestRate)}
              />
            )}

            {selectedAppTab === APP_TABS.MY_LENDING && <MyLending />}

            {selectedAppTab === APP_TABS.MY_BORROWING && <MyBorrowing />}
          </Flex>
          {shouldShowOffers && <AvailableOffersCards handleAcceptProposal={handleOnSelectAcceptProposal} />}
        </Flex>
        <TokenSelectorModal
          isModalOpen={selectionModalState.isOpen}
          variation={whichVariationOfTokenSelectorModalToUse}
          predefinedAssets={whichPredefinedAssetsToUse}
          hooks={getHooksOrNothing}
          currencyField={
            selectionModalState.mode === SelectionModalMode.POOL ? CurrencyField.INPUT : CurrencyField.OUTPUT
          }
          flow={TokenSelectorFlow.Send}
          onClose={() => selectionModalDispatch({ type: ModalState.CLOSE })}
          activeAccountAddress={address}
          onSelectCurrency={(currency, field, isBridgePair, poolData) => {
            if (!poolData && currency) {
              const [currencySymbol, currencyLogoUrl] = (currency as any)?.symbol?.split('###') ?? []
              const currencyInfo: CurrencyInfo & { currency: Currency & { hook?: Hook } } = {
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
                  hook: (currency as any)?.hook,
                } as any,
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
              <LendingStateProvider>
                <LendingDialog />
              </LendingStateProvider>
            </SwapFormContextProvider>
          </PrefetchBalancesWrapper>
        </TransactionSettingsContextProvider>
      </MultichainContextProvider>
    </Flex>
  )
}
