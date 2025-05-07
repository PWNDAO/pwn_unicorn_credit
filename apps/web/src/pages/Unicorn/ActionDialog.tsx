import { sortsBefore } from '@uniswap/v4-sdk'
import { PrefetchBalancesWrapper } from 'graphql/data/apollo/AdaptiveTokenBalancesProvider'
import { useAccount } from 'hooks/useAccount'
import { MutableRefObject, useCallback, useEffect, useRef, useState } from 'react'
import { MultichainContextProvider } from 'state/multichain/MultichainContext'
import { Button, Flex, isWeb, SegmentedControl, SegmentedControlOption, Text } from 'ui/src'
import { CurrencyInputPanel, CurrencyInputPanelRef } from 'uniswap/src/components/CurrencyInputPanel/CurrencyInputPanel'
import { TextInput, TextInputProps } from 'uniswap/src/components/input/TextInput'
import { TokenSelectorModal, TokenSelectorVariation } from 'uniswap/src/components/TokenSelector/TokenSelector'
import { TokenSelectorFlow } from 'uniswap/src/components/TokenSelector/types'
import { Token } from 'uniswap/src/data/graphql/uniswap-data-api/__generated__/types-and-hooks'
import { CurrencyInfo } from 'uniswap/src/features/dataApi/types'
import { DecimalPadInputRef } from 'uniswap/src/features/transactions/DecimalPadInput/DecimalPadInput'
import { TransactionSettingsContextProvider } from 'uniswap/src/features/transactions/settings/contexts/TransactionSettingsContext'
import { TransactionSettingKey } from 'uniswap/src/features/transactions/settings/slice'
import {
  SwapFormContextProvider,
  useSwapFormContext,
} from 'uniswap/src/features/transactions/swap/contexts/SwapFormContext'
import { CurrencyField } from 'uniswap/src/types/currency'
import { formatCurrencyAmount } from 'utilities/src/format/localeBased'
import { NumberType } from 'utilities/src/format/types'
import { useLendingState } from './hooks/lendingState'
import { useAssetPrice } from './queries/useAssetPrice'
import { chainName, PoolData } from 'uniswap/src/components/TokenSelector/lists/TokenSelectorPoolsList'
import { useDebounce } from 'utilities/src/time/timing'
import { Currency, CurrencyAmount } from '@uniswap/sdk-core'
import { parseUnits } from 'viem'
import { useWalletClient } from 'wagmi'
import { RotatableChevron } from 'ui/src/components/icons/RotatableChevron'

const LendingDialog = () => {
  const {
    amountUpdatedTimeRef,
    derivedSwapInfo,
    exactAmountFiat,
    exactAmountFiatRef,
    exactAmountToken,
    exactAmountTokenRef,
    exactCurrencyField,
    focusOnCurrencyField,
    selectingCurrencyField,
    input,
    isFiatMode,
    output,
    hideFooter,
    updateSwapForm,
  } = useSwapFormContext()
  const { address } = useAccount()

  const {
    currencyAmounts,
    currencies,
    trade,
    currencyBalances,
    currencyAmountsUSDValue,
    // wrapType,
  } = derivedSwapInfo


  const exactFieldIsInput = exactCurrencyField === CurrencyField.INPUT

  const {
    isLendNotBorrow,
    selectedLendAsset,
    selectedBorrowAsset,
    lendValue,
    onToggleFocusOnFirstNotSecondInput,
    borrowValue,
    onToggleLendNotBorrow,
    onSelectLendAsset,
    onSelectBorrowAsset,
    onShowTokenSelector,
    isTokenSelectorOpen,
    tokenSelectorMode,
    onCloseTokenSelector,
    handleChangeTokenSelectorMode,
    firstInputRef,
    secondInputRef,
    handleUpdateLendValue,
    handleUpdateBorrowValue,
    focusOnFirstNotSecondInput,
  } = useLendingState()

  const isLendAssetPool = selectedLendAsset && typeof selectedLendAsset === 'object' && 'poolId' in selectedLendAsset
  const isBorrowAssetPool = selectedBorrowAsset && typeof selectedBorrowAsset === 'object' && 'poolId' in selectedBorrowAsset
  const { data: lendAssetPrice } = useAssetPrice(
    isLendAssetPool ? 
      selectedLendAsset?.tokens.token0.chainId : 
      selectedLendAsset?.currency?.chainId, 
    isLendAssetPool ? undefined : (selectedLendAsset?.currency as unknown as Token)?.address)
  const { data: borrowAssetPrice } = useAssetPrice(
    isBorrowAssetPool ? 
      selectedBorrowAsset?.tokens.token0.chainId : 
      selectedBorrowAsset?.currency?.chainId, 
    isBorrowAssetPool ? undefined : (selectedBorrowAsset?.currency as unknown as Token)?.address)

  const [borrowCurrencyAmount, setBorrowCurrencyAmount] = useState<CurrencyAmount<Currency> | null>(null)
  const [ltv, setLtv] = useState<number | null>(null)

  useEffect(() => {
    if (selectedBorrowAsset) {
      const parsedValue = parseUnits(borrowValue, (selectedBorrowAsset as CurrencyInfo)?.currency?.decimals ?? 18)
      const amount = CurrencyAmount.fromRawAmount(
        (selectedBorrowAsset as CurrencyInfo)?.currency as Currency,
        parsedValue.toString()
      )
      setBorrowCurrencyAmount(amount)
    } else {
      setBorrowCurrencyAmount(null)
    }
  }, [selectedBorrowAsset, borrowValue])
  
  useEffect(() => {
    if (selectedLendAsset && borrowValue) {
      const ltv = (Number(borrowValue) / (selectedLendAsset as PoolData)?.totalUsdValue) * 100
      setLtv(Number(ltv.toFixed(2)))
    }
  }, [selectedLendAsset, borrowValue])

  const { data: walletClient } = useWalletClient()

  const tabs: SegmentedControlOption[] = [
    {
      display: (
        <Text
          variant="buttonLabel3"
          hoverStyle={{ color: '$neutral1' }}
          color={tokenSelectorMode === 'borrow' ? '$neutral1' : '$neutral2'}
          tag="h1"
        >
          {'Borrow'}
        </Text>
      ),
      value: 'borrow',
    },
    {
      display: (
        <Text
          variant="buttonLabel3"
          hoverStyle={{ color: '$neutral1' }}
          color={tokenSelectorMode === 'lend' ? '$neutral1' : '$neutral2'}
          tag="h1"
        >
          {'Lend'}
        </Text>
      ),
      value: 'lend',
    },
  ]

  const LendInputPanel = () => {
    return (
      <Flex
        animation="simple"
        borderColor={true ? '$surface3' : '$transparent'}
        borderRadius="$rounded20"
        backgroundColor={true ? '$surface1' : '$surface2'}
        borderWidth="$spacing1"
        overflow="hidden"
        pb={currencies[CurrencyField.INPUT] ? '$spacing4' : '$none'}
        width={"30rem"}
      >
        <CurrencyInputPanel
          ref={firstInputRef}
          headerLabel={'LP'}
          currencyAmount={currencyAmounts[CurrencyField.INPUT]}
          currencyBalance={currencyBalances[CurrencyField.INPUT]}
          currencyField={CurrencyField.INPUT}
          currencyInfo={selectedLendAsset}
          focus={focusOnFirstNotSecondInput ? true : undefined}
          isFiatMode={isFiatMode && exactFieldIsInput}
          isIndicativeLoading={trade.isIndicativeLoading}
          isLoading={false}
          disabled={!!isLendAssetPool}
          showSoftInputOnFocus={false}
          usdValue={isLendAssetPool ? selectedLendAsset?.totalUsdValue.toString() : currencyAmountsUSDValue[CurrencyField.INPUT]}
          value={isLendAssetPool ? '1' : lendValue}
          valueIsIndicative={!exactFieldIsInput && trade.indicativeTrade && !trade.trade}
          onPressIn={() => onToggleFocusOnFirstNotSecondInput(true)}
          onSelectionChange={() => {}}
          onSetExactAmount={handleUpdateLendValue}
          onSetPresetValue={() => {}} // Added this line
          onShowTokenSelector={() => onShowTokenSelector('lend')}
          onToggleIsFiatMode={() => {}}
        />
      </Flex>
    )
  }

  const BorrowInputPanel = () => {
    return (
      <Flex
        animation="simple"
        borderColor={true ? '$surface3' : '$transparent'}
        borderRadius="$rounded20"
        backgroundColor={true ? '$surface1' : '$surface2'}
        borderWidth="$spacing1"
        overflow="hidden"
        pb={currencies[CurrencyField.INPUT] ? '$spacing4' : '$none'}
        width={"30rem"}
      >
        <CurrencyInputPanel
          ref={secondInputRef}
          headerLabel={'Borrow'}
          currencyAmount={currencyAmounts[CurrencyField.OUTPUT]}
          currencyBalance={currencyBalances[CurrencyField.INPUT]}
          currencyField={CurrencyField.OUTPUT}
          currencyInfo={selectedBorrowAsset}
          focus={focusOnFirstNotSecondInput ? undefined : true}
          isFiatMode={isFiatMode && exactFieldIsInput}
          isIndicativeLoading={trade.isIndicativeLoading}
          isLoading={false}
          showSoftInputOnFocus={false}
          usdValue={borrowCurrencyAmount}
          value={borrowValue}
          valueIsIndicative={!exactFieldIsInput && trade.indicativeTrade && !trade.trade}
          onPressIn={() => onToggleFocusOnFirstNotSecondInput(false)}
          onSelectionChange={() => {}}
          onSetExactAmount={handleUpdateBorrowValue}
          onSetPresetValue={() => {}} // Added this line
          onShowTokenSelector={() => onShowTokenSelector('borrow')}
          onToggleIsFiatMode={() => {}}
        />
      </Flex>
    )
  }

  const CustomInputComponent = (
    {
      label,
      onChangeText,
      maxValue = 100,
      disabled = false,
      fixedValue,
    }: {
      label: string
      onChangeText: (newValue: string) => void
      maxValue?: number
      disabled?: boolean
      fixedValue?: string
    }
  ) => {
    const [value, setValue] = useState('')
    const debouncedValue = useDebounce(value, 300)

    const handleChangeText = useCallback((newValue: string) => {
      const numValue = Number(newValue)
      if (isNaN(numValue) || numValue > 100) {
        return
      }
      setValue(newValue)
    }, [])

    useEffect(() => {
      onChangeText(debouncedValue)
    }, [debouncedValue])

    return (
      <Flex
        animation="simple"
        borderColor={true ? '$surface3' : '$transparent'}
        borderRadius="$rounded20"
        backgroundColor={true ? '$surface1' : '$surface2'}
        borderWidth="$spacing1"
        overflow="hidden"
        px="$spacing16"
        py="$spacing16"
        width={"$full"}
        flexShrink={"unset"}
      >
        <Text color="$neutral2" variant="subheading2">{label}</Text>
        <TextInput
          value={value}
          fontSize={32}
          ml={-15}
          fontWeight={'300'}
          onChangeText={handleChangeText}
          placeholder={fixedValue ?? '0'}
          placeholderTextColor={'$neutral2'}
          color={'$neutral1'}
          keyboardType="numeric"
          disabled={disabled}
        />
      </Flex>
    )
  }

  const SelectPoolInput = (
    {
      selectedPool,
      onOpenTokenSelector,
    }: {
      selectedPool: PoolData | null
      onOpenTokenSelector: () => void
    }
  ) => {
    const handleOpenTokenSelector = () => {
      onOpenTokenSelector()
    }
    return (
      <Flex
        animation="simple"
        borderColor={true ? '$surface3' : '$transparent'}
        borderRadius="$rounded20"
        backgroundColor={true ? '$surface1' : '$surface2'}
        borderWidth="$spacing1"
        overflow="hidden"
        px="$spacing16"
        py="$spacing16"
        width={"30rem"}
        gap="$spacing24"
        pb="$spacing24"
      >
        <Text color="$neutral2" variant="subheading2">Borrow Against</Text>
        { !selectedPool ?
          <Flex centered>
            <Button
              backgroundColor="$accent1"
              borderRadius="$rounded20"
              px="$spacing16"
              py="$spacing16"
              pressStyle={{
                backgroundColor: 'rgb(192, 92, 152)',
              }}
              hoverStyle={{
                backgroundColor: 'rgb(192, 92, 152)', 
              }}
              animation="quick"
              size="large"
              onPress={handleOpenTokenSelector}
            >
              <Text variant="buttonLabel1" color="$sporeWhite">
                Select Uniswap V3 Position
              </Text>
              <RotatableChevron color='$neutral1' direction="down" height="$spacing24" />
            </Button>
          </Flex>
        : <Flex width={'$full'} minHeight={100}>
            <Button
              width={'$full'}
              height={'$full'}
              backgroundColor="$surface1"
              borderColor="$surface3"
              borderRadius="$rounded20"
              borderWidth="$spacing1"
              px="$spacing16"
              py="$spacing16"
              pressStyle={{
                backgroundColor: 'rgb(35, 33, 34)',
              }}
              hoverStyle={{
                backgroundColor: 'rgb(35, 33, 34)',
              }}
              animation="quick"
              size="large"
              onPress={handleOpenTokenSelector}
              justifyContent='unset'
            >
              <Flex flexDirection="column" height={'$spacing120'} width="100%" justifyContent="space-between">
                <Flex flexDirection="row" gap="$spacing12" justifyContent="space-between">
                  <Flex flexDirection="row" gap="$spacing12" justifyContent="space-between">
                    <Text color="$neutral2" variant="subheading2">{selectedPool.tokens.token0.symbol} / {selectedPool.tokens.token1.symbol}</Text>
                    <Text color="$neutral2" variant="subheading2">{selectedPool.feeTier / 10000}%</Text>
                  </Flex>
                  <Text color="$neutral2" variant="subheading2">${selectedPool.totalUsdValue.toLocaleString(undefined, {maximumFractionDigits: 2})}</Text>
                </Flex>
                <Flex flexDirection="row" width="$full" justifyContent="space-between">
                  <Text color="$neutral2" variant="subheading2">Chain: {chainName(selectedPool.tokens.token0.chainId)}</Text>
                  <RotatableChevron color='$neutral1' direction="down" height="$spacing24" />
                </Flex>
              </Flex>
            </Button>
          </Flex>
        }
      </Flex>
    )
  }

  return (
    <Flex width={'$full'} minWidth={'700px'} maxWidth={'$full'} gap="$spacing8" flexDirection="column" alignItems='center'>
      <SegmentedControl
        options={tabs}
        disabled
        selectedOption={tokenSelectorMode}
        onSelectOption={(option) => handleChangeTokenSelectorMode(option as 'lend' | 'borrow')}
        outlined={false}
        size="large"
      />
      <Flex grow gap="$spacing8" justifyContent="space-between">
        <Flex animation="quick" enterStyle={{ opacity: 0 }} exitStyle={{ opacity: 0 }} gap="$spacing16" alignItems='center'>
          <SelectPoolInput onOpenTokenSelector={() => onShowTokenSelector('lend')} selectedPool={selectedLendAsset as PoolData} />
          {tokenSelectorMode !== 'lend' ? <BorrowInputPanel /> : <LendInputPanel />}
          <Flex flexDirection="row" gap="$spacing16" width={'30rem'}>
            <CustomInputComponent label="LTV (%)" onChangeText={() => {}} disabled={true} fixedValue={ltv?.toString()} />
            <CustomInputComponent label="Interest (%)" onChangeText={() => {}} />
          </Flex>

          <Flex
            animation="quick"
            enterStyle={{ opacity: 0 }}
            exitStyle={{ opacity: 0 }}
            gap="$spacing2"
            width="max-content"
            alignSelf="center"
            justifyContent="center" 
            mt={50}
          >
            <Button
              backgroundColor="$accent1"
              borderRadius="$rounded20"
              px="$spacing16"
              py="$spacing16"
              pressStyle={{
                backgroundColor: 'rgb(192, 92, 152)',
              }}
              hoverStyle={{
                backgroundColor: 'rgb(192, 92, 152)',
              }}
              animation="quick"
              size="large"
              onPress={async () => {
                try {
                  const signature = await walletClient?.signMessage({
                    message: 'You will be creating the request in here, in your wallet.',
                  })
                  console.log('signature', signature)
                } catch (error) {
                  console.error('error', error)
                }
              }}
            >
              <Text variant="buttonLabel1" color="$sporeWhite">
                Sign and Create
              </Text>
            </Button>
          </Flex>
        </Flex>
        <TokenSelectorModal
          isModalOpen={isTokenSelectorOpen}
          variation={isLendNotBorrow ? TokenSelectorVariation.PoolOnly : TokenSelectorVariation.BalancesOnly}
          currencyField={isLendNotBorrow ? CurrencyField.INPUT : CurrencyField.OUTPUT}
          flow={TokenSelectorFlow.Send}
          onClose={() => onCloseTokenSelector()}
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
              if (isLendNotBorrow) {
                onSelectLendAsset(currencyInfo)
              } else {
                onSelectBorrowAsset(currencyInfo)
              }
            } else {
              if (isLendNotBorrow) {
                onSelectLendAsset(poolData as CurrencyInfo | PoolData)
              } else {
                onSelectBorrowAsset(poolData as CurrencyInfo | PoolData)
              }
            }
            onCloseTokenSelector()
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
