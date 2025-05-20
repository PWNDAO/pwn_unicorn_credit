import { useEffect, useMemo, useState } from 'react'
import { Flex } from 'ui/src'
import { CurrencyInfo } from 'uniswap/src/features/dataApi/types'
import { formatUnits } from 'viem'
import { DEFAULT_DURATION_DAYS } from '../constants/duration'
import { LOAN_TO_VALUE_PERCENT } from '../constants/ltv'
import { useLendingContext } from '../contexts/LendingContext'
import { ModalState, SelectedProposal, SelectionModalMode } from '../hooks/lendingState'
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
  const [ltv, setLtv] = useState<number | null>(null)
  const [interestRate, setInterestRate] = useState<number | null>(null)

  const { isOffersClosed, selectedProposal, handleCreateLoan, assetInputValue } = useLendingContext()

  useEffect(() => {
    ltvCallback?.(Number(ltv))
  }, [ltv, ltvCallback])

  useEffect(() => {
    interestRateCallback?.(Number(interestRate))
  }, [interestRate, interestRateCallback])

  const shouldShowActionButton = useMemo(() => {
    return (
      selectedAsset &&
      selectedAsset2 &&
      isOffersClosed &&
      (selectedProposal ? true : interestRate && interestRate > 0) &&
      (selectedProposal ? true : assetInputValue && Number(assetInputValue) > 0)
    )
  }, [selectedAsset, selectedAsset2, isOffersClosed, selectedProposal, interestRate, assetInputValue])

  return (
    <Flex flexDirection="column" gap="$spacing16" width={'30rem'}>
      <InputAmountSelectToken
        label="Lend"
        label2={`1st Token in Pair`}
        onChangeText={selectedProposal ? () => {} : (value) => setAssetInputValue(value)}
        onOpenTokenSelector={
          selectedProposal
            ? () => {}
            : () => selectionModalDispatch({ type: ModalState.OPEN, mode: SelectionModalMode.ASSET })
        }
        selectedToken={selectedAsset as CurrencyInfo}
        disabled={!!selectedProposal}
        fixedValue={
          selectedProposal
            ? formatUnits(BigInt(selectedProposal?.creditAmount), selectedAsset?.currency?.decimals ?? 18)
            : undefined
        }
      />
      <Flex flexDirection="row" gap="$spacing16" width={'30rem'}>
        {selectedAsset && (
          <InputAmountSelectToken
            label="2nd Token in Pair"
            onChangeText={() => {}}
            onOpenTokenSelector={
              selectedProposal
                ? () => {}
                : () => selectionModalDispatch({ type: ModalState.OPEN, mode: SelectionModalMode.ASSET_2 })
            }
            selectedToken={selectedAsset2 as CurrencyInfo}
            includeInputField={false}
          />
        )}
        {selectedAsset2 && (
          <CustomInputComponent
            label="Interest (%)"
            onChangeText={selectedProposal ? () => {} : (value) => setInterestRate(Number(value))}
            disabled={!!selectedProposal}
            fixedValue={selectedProposal ? `${Number(selectedProposal?.apr) / 1000}%` : undefined}
          />
        )}
      </Flex>
      {shouldShowActionButton ? (
        <AcceptProposalTermsTable
          terms={[
            { label: 'Loan-to-Value', value: `${LOAN_TO_VALUE_PERCENT * 100}%` },
            { label: 'Duration', value: `${DEFAULT_DURATION_DAYS} days` },
          ]}
        />
      ) : null}
      {shouldShowActionButton ? (
        <ActionButton
          label={selectedProposal ? 'Create Loan' : 'Create a new offer!'}
          onPress={selectedProposal ? () => handleCreateLoan(selectedProposal as SelectedProposal) : undefined}
        />
      ) : null}
    </Flex>
  )
}
