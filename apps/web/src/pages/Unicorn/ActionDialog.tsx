import { PrefetchBalancesWrapper } from 'graphql/data/apollo/AdaptiveTokenBalancesProvider'
import { useAccount } from 'hooks/useAccount'
import { MutableRefObject, useCallback, useRef, useState } from 'react'
import { MultichainContextProvider } from 'state/multichain/MultichainContext'
import { Flex, isWeb, SegmentedControl, SegmentedControlOption, Text } from 'ui/src'
import { CurrencyInputPanel, CurrencyInputPanelRef } from 'uniswap/src/components/CurrencyInputPanel/CurrencyInputPanel'
import { TextInputProps } from 'uniswap/src/components/input/TextInput'
import { TokenSelectorModal, TokenSelectorVariation } from 'uniswap/src/components/TokenSelector/TokenSelector'
import { TokenSelectorFlow } from 'uniswap/src/components/TokenSelector/types'
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

const LendingDialog = () => {
  const [selectedTab, setSelectedTab] = useState('borrow')
  const [isTokenSelectorOpen, setIsTokenSelectorOpen] = useState(false)
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
  const inputRef = useRef<CurrencyInputPanelRef>(null)

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
  const derivedCurrencyField = exactFieldIsInput ? CurrencyField.OUTPUT : CurrencyField.INPUT
  const exactValue = isFiatMode ? exactAmountFiat : exactAmountToken

  const formattedDerivedValue = formatCurrencyAmount({
    amount: currencyAmounts[derivedCurrencyField],
    locale: 'en-US',
    type: NumberType.SwapTradeAmount,
    placeholder: '',
  })

  const onShowTokenSelectorInput = () => {
    setIsTokenSelectorOpen(true)
  }
  const inputSelectionRef = useRef<TextInputProps['selection']>()
  const decimalPadRef = useRef<DecimalPadInputRef>(null)

  const onInputSelectionChange = useCallback(
    (start: number, end: number) => {
      if (Date.now() - amountUpdatedTimeRef.current < 500) {
        // We only want to trigger this callback when the user is manually moving the cursor,
        // but this function is also triggered when the input value is updated,
        // which causes issues on Android.
        // We use `amountUpdatedTimeRef` to check if the input value was updated recently,
        // and if so, we assume that the user is actually typing and not manually moving the cursor.
        return
      }
      inputSelectionRef.current = { start, end }
      decimalPadRef.current?.updateDisabledKeys()
    },
    [amountUpdatedTimeRef],
  )

  const onSetExactAmount = useCallback(
    (currencyField: CurrencyField, amount: string) => {
      const currentIsFiatMode = isFiatMode && focusOnCurrencyField === exactCurrencyField
      updateSwapForm({
        exactAmountFiat: currentIsFiatMode ? amount : undefined,
        exactAmountToken: currentIsFiatMode ? undefined : amount,
        exactCurrencyField: currencyField,
        isFiatMode: currentIsFiatMode,
      })
    },
    [exactCurrencyField, focusOnCurrencyField, isFiatMode, updateSwapForm],
  )

  const onSetExactAmountInput = useCallback(
    (amount: string) => onSetExactAmount(CurrencyField.INPUT, amount),
    [onSetExactAmount],
  )

  const outputRef = useRef<CurrencyInputPanelRef>(null)
  const decimalPadControlledField = focusOnCurrencyField ?? exactCurrencyField
  const outputSelectionRef = useRef<TextInputProps['selection']>()

  const resetSelection = useCallback(
    ({ start, end, currencyField }: { start: number; end?: number; currencyField?: CurrencyField }) => {
      // Update refs first to have the latest selection state available in the DecimalPadInput
      // component and properly update disabled keys of the decimal pad.
      // We reset the native selection on the next tick because we need to wait for the native input to be updated.
      // This is needed because of the combination of state (delayed update) + ref (instant update) to improve performance.

      const _currencyField = currencyField ?? decimalPadControlledField
      const selectionRef = _currencyField === CurrencyField.INPUT ? inputSelectionRef : outputSelectionRef
      const inputFieldRef =
        _currencyField === CurrencyField.INPUT ? inputRef.current?.textInputRef : outputRef.current?.textInputRef

      selectionRef.current = { start, end }

      if (!isWeb && inputFieldRef) {
        setTimeout(() => {
          inputFieldRef.current?.setNativeProps?.({ selection: { start, end } })
        }, 0)
      }
    },
    [decimalPadControlledField],
  )

  const moveCursorToEnd = useCallback(
    ({ targetInputRef }: { targetInputRef: MutableRefObject<string> }) => {
      resetSelection({
        start: targetInputRef.current.length,
        end: targetInputRef.current.length,
      })
    },
    [resetSelection],
  )

  const onSetPresetValue = useCallback(
    (amount: string, isLessThanMax?: boolean): void => {
      updateSwapForm({
        exactAmountFiat: undefined,
        exactAmountToken: amount,
        exactCurrencyField: CurrencyField.INPUT,
        focusOnCurrencyField: undefined,
        isMax: !isLessThanMax,
      })

      // We want this update to happen on the next tick, after the input value is updated.
      setTimeout(() => {
        moveCursorToEnd({ targetInputRef: exactAmountTokenRef })
        decimalPadRef.current?.updateDisabledKeys()
      }, 0)
    },
    [exactAmountTokenRef, moveCursorToEnd, updateSwapForm],
  )

  const tabs: SegmentedControlOption[] = [
    {
      display: (
        <Text
          variant="buttonLabel3"
          hoverStyle={{ color: '$neutral1' }}
          color={selectedTab === 'borrow' ? '$neutral1' : '$neutral2'}
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
          color={selectedTab === 'lend' ? '$neutral1' : '$neutral2'}
          tag="h1"
        >
          {'Lend'}
        </Text>
      ),
      value: 'lend',
    },
  ]
  return (
    <Flex width={'$full'} minWidth={'700px'} maxWidth={'$full'} gap="$spacing8" flexDirection="column">
      <SegmentedControl
        options={tabs}
        selectedOption={selectedTab}
        onSelectOption={setSelectedTab}
        outlined={false}
        size="large"
      />
      <Flex grow gap="$spacing8" justifyContent="space-between">
        <Flex animation="quick" enterStyle={{ opacity: 0 }} exitStyle={{ opacity: 0 }} gap="$spacing2">
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
              ref={inputRef}
              headerLabel={'LP'}
              currencyAmount={currencyAmounts[CurrencyField.INPUT]}
              currencyBalance={currencyBalances[CurrencyField.INPUT]}
              currencyField={CurrencyField.INPUT}
              currencyInfo={currencies[CurrencyField.INPUT]}
              // // We do not want to force-focus the input when the token selector is open.
              focus={selectingCurrencyField ? undefined : focusOnCurrencyField === CurrencyField.INPUT}
              isFiatMode={isFiatMode && exactFieldIsInput}
              isIndicativeLoading={trade.isIndicativeLoading}
              isLoading={false}
              // resetSelection={resetSelection}
              showSoftInputOnFocus={false}
              usdValue={currencyAmountsUSDValue[CurrencyField.INPUT]}
              value={exactFieldIsInput ? exactValue : formattedDerivedValue}
              valueIsIndicative={!exactFieldIsInput && trade.indicativeTrade && !trade.trade}
              tokenColor={'rgb(0,255,0)'}
              onPressIn={() => {}}
              onSelectionChange={onInputSelectionChange}
              onSetExactAmount={onSetExactAmountInput}
              onSetPresetValue={() => {}} // Added this line
              onShowTokenSelector={onShowTokenSelectorInput}
              onToggleIsFiatMode={() => {}}
            />
          </Flex>
        </Flex>
        <TokenSelectorModal
          isModalOpen={isTokenSelectorOpen}
          variation={TokenSelectorVariation.BalancesOnly}
          currencyField={CurrencyField.INPUT}
          flow={TokenSelectorFlow.Swap}
          onClose={() => setIsTokenSelectorOpen(false)}
          activeAccountAddress={address}
          onSelectCurrency={(currency, field, isBridgePair) => {
            console.log('currency', currency)
            console.log('field', field)
            console.log('isBridgePair', isBridgePair)
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
              <LendingDialog />r{' '}
            </SwapFormContextProvider>
          </PrefetchBalancesWrapper>
        </TransactionSettingsContextProvider>
      </MultichainContextProvider>
    </Flex>
  )
}
