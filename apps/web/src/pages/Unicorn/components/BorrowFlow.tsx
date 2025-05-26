import { SelectedProposal, SelectionModalMode } from '../hooks/lendingState'

import { InputAmountSelectToken } from './InputAmountSelectToken'

import { ModalState } from '../hooks/lendingState'

import { useEffect, useMemo, useState } from 'react'
import { Flex } from 'ui/src'
import { PoolData } from 'uniswap/src/components/TokenSelector/lists/TokenSelectorPoolsList'
import { CurrencyInfo } from 'uniswap/src/features/dataApi/types'
import { DEFAULT_DURATION_DAYS } from '../constants/duration'
import { LOAN_TO_VALUE_PERCENT } from '../constants/ltv'
import { useLendingContext } from '../contexts/LendingContext'
import { calculateLtv } from '../utils/math'
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

  const ltv = useMemo(
    () => calculateLtv(Number(amountInputValue), Number(selectedPool?.totalUsdValue ?? 0)),
    [amountInputValue, selectedPool],
  )

  const { isOffersClosed, selectedProposal, handleCreateLoan } = useLendingContext()

  useEffect(() => {
    ltvCallback?.(Number(ltv))
  }, [ltv, ltvCallback])

  useEffect(() => {
    interestRateCallback?.(Number(interestRate))
  }, [interestRate, interestRateCallback])

  const shouldShowActionButton = useMemo(() => {
    return (
      selectedPool &&
      selectedAsset &&
      isOffersClosed &&
      // if loan everything is ready, if custom check interest rate input existence
      (selectedProposal ? true : interestRate && interestRate > 0)
    )
  }, [selectedPool, selectedAsset, isOffersClosed, selectedProposal, interestRate])

  return (
    <>
      <Flex flexDirection="column" gap="$spacing16" width={'30rem'}>
        <SelectPoolInput
          onOpenTokenSelector={
            selectedProposal
              ? () => {}
              : () => selectionModalDispatch({ type: ModalState.OPEN, mode: SelectionModalMode.POOL })
          }
          selectedPool={selectedPool as PoolData}
        />
      </Flex>
      <InputAmountSelectToken
        label="I want to borrow ..."
        onChangeText={(value) => setAssetInputValue(value)}
        onOpenTokenSelector={
          selectedProposal
            ? () => {}
            : () => selectionModalDispatch({ type: ModalState.OPEN, mode: SelectionModalMode.ASSET })
        }
        selectedToken={selectedAsset as CurrencyInfo}
        disabled
        mode="borrow-computed"
      />
      <Flex flexDirection="row" gap="$spacing16" width={'30rem'}>
        <CustomInputComponent
          label="Interest I'll pay for it ..."
          onChangeText={selectedProposal ? () => {} : (value) => setInterestRate(Number(value))}
          disabled={!!selectedProposal}
          fixedValue={selectedProposal ? `${Number(selectedProposal?.apr) / 1000}%` : undefined}
        />
      </Flex>
      {shouldShowActionButton ? (
        <AcceptProposalTermsTable
          terms={[
            { label: 'Borrowing to Collateral Ratio', value: `${LOAN_TO_VALUE_PERCENT * 100}%` },
            { label: 'Loan Duration', value: `${DEFAULT_DURATION_DAYS} days` },
            { label: 'Estimated gas fee', value: `~ $${(Math.random() * 0.08 + 0.02).toFixed(2)}`}
          ]}
        />
      ) : null}
      {shouldShowActionButton ? (
        <ActionButton
          label={selectedProposal ? 'Create Loan' : 'Create a new request!'}
          onPress={selectedProposal ? () => handleCreateLoan(selectedProposal as SelectedProposal) : undefined}
        />
      ) : null}
    </>
  )
}
