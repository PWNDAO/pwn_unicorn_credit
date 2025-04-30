import { sortsBefore } from '@uniswap/v4-sdk'
import { PrefetchBalancesWrapper } from 'graphql/data/apollo/AdaptiveTokenBalancesProvider'
import { useAccount } from 'hooks/useAccount'
import { MutableRefObject, useCallback, useRef, useState } from 'react'
import { MultichainContextProvider } from 'state/multichain/MultichainContext'
import { Flex, isWeb, SegmentedControl, SegmentedControlOption, Text } from 'ui/src'
import { CurrencyInputPanel, CurrencyInputPanelRef } from 'uniswap/src/components/CurrencyInputPanel/CurrencyInputPanel'
import { TextInputProps } from 'uniswap/src/components/input/TextInput'
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

  const { data: lendAssetPrice } = useAssetPrice(selectedLendAsset?.currency?.chainId, (selectedLendAsset?.currency as unknown as Token)?.address)
  const { data: borrowAssetPrice } = useAssetPrice(selectedBorrowAsset?.currency?.chainId, (selectedBorrowAsset?.currency as unknown as Token)?.address)

  const lendAssetPriceValue = lendAssetPrice ? lendAssetPrice : 0
  const borrowAssetPriceValue = borrowAssetPrice ? borrowAssetPrice : 0

  const priceOfLendAsset = lendAssetPriceValue * Number(lendValue)
  const priceOfBorrowAsset = borrowAssetPriceValue * Number(borrowValue)

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
          showSoftInputOnFocus={false}
          usdValue={currencyAmountsUSDValue[CurrencyField.INPUT]}
          value={lendValue}
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
        // hoverStyle={hoverStyles.input}
      >
        <CurrencyInputPanel
          ref={secondInputRef}
          headerLabel={'Borrow'}
          currencyAmount={currencyAmounts[CurrencyField.OUTPUT]}
          currencyBalance={currencyBalances[CurrencyField.OUTPUT]}
          currencyField={CurrencyField.OUTPUT}
          currencyInfo={selectedBorrowAsset}
          focus={focusOnFirstNotSecondInput ? undefined : true}
          isFiatMode={isFiatMode && exactFieldIsInput}
          isIndicativeLoading={trade.isIndicativeLoading}
          isLoading={false}
          showSoftInputOnFocus={false}
          usdValue={undefined}
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

  return (
    <Flex width={'$full'} minWidth={'700px'} maxWidth={'$full'} gap="$spacing8" flexDirection="column">
      <SegmentedControl
        options={tabs}
        selectedOption={tokenSelectorMode}
        onSelectOption={(option) => handleChangeTokenSelectorMode(option as 'lend' | 'borrow')}
        outlined={false}
        size="large"
      />
      <Flex grow gap="$spacing8" justifyContent="space-between">
        <Flex animation="quick" enterStyle={{ opacity: 0 }} exitStyle={{ opacity: 0 }} gap="$spacing2">
          {tokenSelectorMode === 'borrow' ? <BorrowInputPanel /> : <LendInputPanel />}
          {tokenSelectorMode === 'lend' ? <BorrowInputPanel /> : <LendInputPanel />}
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
              const currencyInfo: CurrencyInfo = {
                currency: {
                  address: (currency as unknown as Token)?.address ?? '',
                  decimals: currency?.decimals ?? 0,
                  name: currency?.name ?? '',
                  symbol: currency?.symbol ?? '',
                  isNative: false,
                  isToken: true,
                  chainId: currency?.chainId ?? 0,
                  wrapped: currency?.wrapped,
                  equals: currency?.equals,
                  sortsBefore: () => false,
                },
                currencyId: field?.toString() ?? '',
                logoUrl: '',
              }
              if (isLendNotBorrow) {
                onSelectLendAsset(currencyInfo)
              } else {
                onSelectBorrowAsset(currencyInfo)
              }
            } else {
              console.log('poolData', poolData)
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
