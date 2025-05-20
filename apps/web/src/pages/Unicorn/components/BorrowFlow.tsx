import { SelectionModalMode } from '../hooks/lendingState'

import { InputAmountSelectToken } from './InputAmountSelectToken'

import { ModalState } from '../hooks/lendingState'

import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Flex } from 'ui/src'
import { PoolData } from 'uniswap/src/components/TokenSelector/lists/TokenSelectorPoolsList'
import { CurrencyInfo } from 'uniswap/src/features/dataApi/types'
import { DEFAULT_DURATION_DAYS } from '../constants/duration'
import { LOAN_TO_VALUE_PERCENT } from '../constants/ltv'
import { useLendingContext } from '../contexts/LendingContext'
import { calculateLtv } from '../utils/math'
import { AcceptProposalFlow } from './AcceptProposalFlow'
import { AcceptProposalTermsTable } from './AcceptProposalTermsTable'
import { ActionButton } from './ActionButton'
import { CustomInputComponent } from './CustomInputComponent'
import { SelectPoolInput } from './SelectPoolInput'

export const BorrowFlow = ({
  selectedPool,
  selectedAsset,
  setAssetInputValue,
  selectionModalDispatch,
  amountInputValue,
  ltvCallback,
  interestRateCallback,
}: {
  selectedPool: PoolData | null
  selectedAsset: CurrencyInfo | null
  setAssetInputValue: (value: string) => void
  selectionModalDispatch: (action: { type: ModalState; mode: SelectionModalMode }) => void
  amountInputValue: string
  ltvCallback?: (ltv: number) => void
  interestRateCallback?: (interestRate: number) => void
}) => {
  const [interestRate, setInterestRate] = useState<number | null>(null)
  const [searchParams] = useSearchParams()
  const acceptProposalId = searchParams.get('accept')

  const ltv = useMemo(
    () => calculateLtv(Number(amountInputValue), Number(selectedPool?.totalUsdValue ?? 0)),
    [amountInputValue, selectedPool],
  )

  const { isOffersClosed } = useLendingContext()

  useEffect(() => {
    ltvCallback?.(Number(ltv))
  }, [ltv, ltvCallback])

  useEffect(() => {
    interestRateCallback?.(Number(interestRate))
  }, [interestRate, interestRateCallback])

  return (
    <>
      {acceptProposalId ? (
        <Flex maxWidth={'40rem'}>
          <AcceptProposalFlow />
        </Flex>
      ) : (
        <>
          <SelectPoolInput
            onOpenTokenSelector={() => selectionModalDispatch({ type: ModalState.OPEN, mode: SelectionModalMode.POOL })}
            selectedPool={selectedPool as PoolData}
          />
          {selectedPool && (
            <InputAmountSelectToken
              label="Borrow"
              onChangeText={(value) => setAssetInputValue(value)}
              onOpenTokenSelector={() =>
                selectionModalDispatch({ type: ModalState.OPEN, mode: SelectionModalMode.ASSET })
              }
              selectedToken={selectedAsset as CurrencyInfo}
              disabled
              mode="borrow-computed"
            />
          )}
          {selectedAsset && (
            <Flex flexDirection="row" gap="$spacing16" width={'30rem'}>
              <CustomInputComponent
                label="Interest (%)"
                onChangeText={(value) => {
                  setInterestRate(Number(value))
                }}
              />
            </Flex>
          )}
          {selectedAsset && selectedPool && isOffersClosed && (
            <AcceptProposalTermsTable
              terms={[
                { label: 'Loan-to-Value', value: `${LOAN_TO_VALUE_PERCENT * 100}%` },
                { label: 'Duration', value: `${DEFAULT_DURATION_DAYS} days` },
              ]}
            />
          )}
          {selectedAsset && selectedPool && isOffersClosed && <ActionButton label="Create a new request!" />}
        </>
      )}
    </>
  )
}
