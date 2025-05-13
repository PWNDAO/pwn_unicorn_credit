import { useEffect, useState } from 'react'
import { Flex } from 'ui/src'
import { CurrencyInfo } from 'uniswap/src/features/dataApi/types'
import { ModalState, SelectionModalMode } from '../hooks/lendingState'
import { ActionButton } from './ActionButton'
import { CustomInputComponent } from './CustomInputComponent'
import { InputAmountSelectToken } from './InputAmountSelectToken'

export const LendFlow = ({
  selectedAsset,
  selectedAsset2,
  setAssetInputValue,
  selectionModalDispatch,
  ltvCallback,
  interestRateCallback,
}: {
  selectedAsset: CurrencyInfo | null
  selectedAsset2: CurrencyInfo | null
  setAssetInputValue: (value: string) => void
  selectionModalDispatch: (action: { type: ModalState; mode: SelectionModalMode }) => void
  ltvCallback?: (ltv: number) => void
  interestRateCallback?: (interestRate: number) => void
}) => {
  const [ltv, setLtv] = useState<number | null>(null)
  const [interestRate, setInterestRate] = useState<number | null>(null)

  useEffect(() => {
    ltvCallback?.(Number(ltv))
  }, [ltv, ltvCallback])

  useEffect(() => {
    interestRateCallback?.(Number(interestRate))
  }, [interestRate, interestRateCallback])

  return (
    <Flex flexDirection="column" gap="$spacing16" width={'30rem'}>
      <InputAmountSelectToken
        label="Lend"
        label2={`1st Token in Pair`}
        onChangeText={(value) => setAssetInputValue(value)}
        onOpenTokenSelector={() => selectionModalDispatch({ type: ModalState.OPEN, mode: SelectionModalMode.ASSET })}
        selectedToken={selectedAsset as CurrencyInfo}
      />
      <Flex flexDirection="row" gap="$spacing16" width={'30rem'}>
        <InputAmountSelectToken
          label="2nd Token in Pair"
          onChangeText={() => {}}
          onOpenTokenSelector={() =>
            selectionModalDispatch({ type: ModalState.OPEN, mode: SelectionModalMode.ASSET_2 })
          }
          selectedToken={selectedAsset2 as CurrencyInfo}
          includeInputField={false}
        />
        {selectedAsset2 && (
          <CustomInputComponent label="Interest (%)" onChangeText={(value) => setInterestRate(Number(value))} />
        )}
      </Flex>
      {selectedAsset && selectedAsset2 && <ActionButton label="Create a new offer!" />}
    </Flex>
  )
}
