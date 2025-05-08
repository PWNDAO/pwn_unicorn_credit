import { PrefetchBalancesWrapper } from 'graphql/data/apollo/AdaptiveTokenBalancesProvider'
import { useAccount } from 'hooks/useAccount'
import { useEffect, useState } from 'react'
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
import { SelectPoolInput } from './components/SelectPoolInput'
import { CustomInputComponent } from './components/CustomInputComponent'
import { InputAmountSelectToken } from './components/InputAmountSelectToken'
import { CurrencyField } from 'uniswap/src/types/currency'
import { ActionButton } from './components/ActionButton'
import { calculateLtv } from './utils/math'
import { AvailableOffersCards } from './components/AvailableOffersCards'
const LendingDialog = () => {
  const { address } = useAccount()

  const {
    selectionModalState,
    selectedAppTab,
    selectedLendAsset,
    selectedBorrowAsset,
    assetInputValue,
    selectionModalDispatch,
    selectAppTab,
    onSelectLendAsset,
    onSelectBorrowAsset,
    setAssetInputValue,
  } = useLendingState()


  const [ltv, setLtv] = useState<number | null>(null)
  
  useEffect(() => {
    if (selectedLendAsset && assetInputValue) {
      setLtv(Number(calculateLtv(Number(assetInputValue), Number((selectedLendAsset as PoolData)?.totalUsdValue))))
    }
  }, [selectedLendAsset, assetInputValue])

  const tabs: SegmentedControlOption[] = Object.values(APP_TABS).map((tab) => ({
    display: (
      <Text
        variant="buttonLabel3"
        hoverStyle={{ color: '$neutral1' }}
        color={selectedAppTab === tab ? '$neutral1' : '$neutral2'}
        tag="h1"
      >
        {tab.charAt(0).toUpperCase() + tab.slice(1).toLowerCase().replace('_', ' ')}
      </Text>
    ),
    value: tab.toLowerCase(),
  }))

  return (
    <Flex width={'$full'} minWidth={'700px'} maxWidth={'$full'} gap="$spacing8" flexDirection="column" alignItems='center'>
      <SegmentedControl
        options={tabs}
        disabled
        selectedOption={selectedAppTab}
        onSelectOption={(option) => selectAppTab(option as APP_TABS)}
        outlined={false}
        size="large"
      />
      <Flex grow gap="$spacing8" justifyContent="space-between">
        <Flex flexDirection="row" gap="$spacing8" width={'100%'}>
          <Flex animation="quick" enterStyle={{ opacity: 0 }} exitStyle={{ opacity: 0 }} gap="$spacing16" alignItems='center'>
            <SelectPoolInput onOpenTokenSelector={() => selectionModalDispatch({ type: ModalState.OPEN, mode: SelectionModalMode.POOL })} selectedPool={selectedLendAsset as PoolData} />
            <InputAmountSelectToken 
              label="Borrow" 
              onChangeText={(value) => setAssetInputValue(value)} 
              onOpenTokenSelector={() => selectionModalDispatch({ type: ModalState.OPEN, mode: SelectionModalMode.ASSET })} 
              selectedToken={selectedBorrowAsset as CurrencyInfo}
            />
            {
              selectedBorrowAsset &&
              <Flex flexDirection="row" gap="$spacing16" width={'30rem'}>
                <CustomInputComponent label="LTV (%)" onChangeText={() => {}} disabled={true} fixedValue={ltv?.toString()} />
                <CustomInputComponent label="Interest (%)" onChangeText={() => {}} />
              </Flex>
            }

          </Flex>
          { selectedLendAsset &&
            <Flex
            backgroundColor="$surface1"
            width="25rem"
            height="30rem"
            borderRadius="$rounded16"
            >
              <AvailableOffersCards />
            </Flex>
          }
        </Flex>
        <ActionButton />
        <TokenSelectorModal
          isModalOpen={selectionModalState.isOpen}
          variation={selectionModalState.mode === SelectionModalMode.POOL ? TokenSelectorVariation.PoolOnly : TokenSelectorVariation.BalancesOnly}
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
              onSelectBorrowAsset(currencyInfo)
            } else {
              onSelectLendAsset(poolData as PoolData)
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
