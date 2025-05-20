import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Flex } from 'ui/src'
import { CurrencyInfo } from 'uniswap/src/features/dataApi/types'
import { DEFAULT_DURATION_DAYS } from '../constants/duration'
import { LOAN_TO_VALUE_PERCENT } from '../constants/ltv'
import { useLendingContext } from '../contexts/LendingContext'
import { ModalState, SelectionModalMode } from '../hooks/lendingState'
import { AcceptProposalFlow } from './AcceptProposalFlow'
import { AcceptProposalTermsTable } from './AcceptProposalTermsTable'
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
  const [searchParams] = useSearchParams()
  const acceptId = searchParams.get('accept')

  const [ltv, setLtv] = useState<number | null>(null)
  const [interestRate, setInterestRate] = useState<number | null>(null)

  const { isOffersClosed } = useLendingContext()

  useEffect(() => {
    ltvCallback?.(Number(ltv))
  }, [ltv, ltvCallback])

  useEffect(() => {
    interestRateCallback?.(Number(interestRate))
  }, [interestRate, interestRateCallback])

  return (
    <>
      {acceptId ? (
        <Flex maxWidth={'40rem'}>
          <AcceptProposalFlow />
        </Flex>
      ) : (
        <Flex flexDirection="column" gap="$spacing16" width={'30rem'}>
          <InputAmountSelectToken
            label="Lend"
            label2={`1st Token in Pair`}
            onChangeText={(value) => setAssetInputValue(value)}
            onOpenTokenSelector={() =>
              selectionModalDispatch({ type: ModalState.OPEN, mode: SelectionModalMode.ASSET })
            }
            selectedToken={selectedAsset as CurrencyInfo}
          />
          <Flex flexDirection="row" gap="$spacing16" width={'30rem'}>
            {selectedAsset && (
              <InputAmountSelectToken
                label="2nd Token in Pair"
                onChangeText={() => {}}
                onOpenTokenSelector={() =>
                  selectionModalDispatch({ type: ModalState.OPEN, mode: SelectionModalMode.ASSET_2 })
                }
                selectedToken={selectedAsset2 as CurrencyInfo}
                includeInputField={false}
              />
            )}
            {selectedAsset2 && (
              <CustomInputComponent label="Interest (%)" onChangeText={(value) => setInterestRate(Number(value))} />
            )}
          </Flex>
          {selectedAsset && selectedAsset2 && isOffersClosed && (
            <AcceptProposalTermsTable
              terms={[
                { label: 'Loan-to-Value', value: `${LOAN_TO_VALUE_PERCENT * 100}%` },
                { label: 'Duration', value: `${DEFAULT_DURATION_DAYS} days` },
              ]}
            />
          )}
          {selectedAsset && selectedAsset2 && isOffersClosed && <ActionButton label="Create a new offer!" />}
        </Flex>
      )}
    </>
  )
}
