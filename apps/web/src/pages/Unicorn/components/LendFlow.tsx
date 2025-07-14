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
import { InputLpPairTokens } from './InputLpPairTokens'
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

  const { isOffersClosed, selectedProposal, handleCreateLoan, assetInputValue, shouldShowOffers } = useLendingContext()

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
      (isOffersClosed || !shouldShowOffers) &&
      (selectedProposal ? true : interestRate && interestRate > 0) &&
      (selectedProposal ? true : assetInputValue && Number(assetInputValue) > 0)
    )
  }, [selectedAsset, selectedAsset2, isOffersClosed, selectedProposal, interestRate, assetInputValue, shouldShowOffers])

  return (
    <Flex flexDirection="column" gap="$spacing16" width={'100%'} maxWidth={'$full'}>
      <InputAmountSelectToken
        label="I want to lend"
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
      <Flex flexDirection="row" gap="$spacing16" alignItems="center" justifyContent="center" width={'$full'}>
        <InputLpPairTokens
          label="Collateral LP composition required"
          onChangeText={() => {}}
          onOpenTokenSelector={
            selectedProposal
              ? () => {}
              : () => selectionModalDispatch({ type: ModalState.OPEN, mode: SelectionModalMode.ASSET_2 })
          }
          selectedToken={selectedAsset2 as CurrencyInfo}
          firstPredefined={
            selectedAsset
              ? {
                  symbol: selectedAsset?.currency.symbol as string,
                  address: (selectedAsset?.currency as any)?.address,
                  logoUrl: selectedAsset?.logoUrl as string,
                }
              : null
          }
          disabled={!!selectedProposal}
        />
      </Flex>
      <CustomInputComponent
        label="I want to earn (%)"
        onChangeText={selectedProposal ? () => {} : (value) => setInterestRate(Number(value))}
        disabled={!!selectedProposal}
        fixedValue={selectedProposal ? `${Number(selectedProposal?.apr) / 1000}%` : undefined}
      />
      <AcceptProposalTermsTable
        terms={[
          { label: 'Lending to Collateral Ratio', value: `${LOAN_TO_VALUE_PERCENT * 100}%` },
          { label: 'Loan Duration', value: `${DEFAULT_DURATION_DAYS} days` },
          { label: 'Estimated gas fee', value: `~ $${(Math.random() * 0.08 + 0.02).toFixed(2)}` },
        ]}
      />
      {shouldShowActionButton ? (
        <ActionButton
          label={selectedProposal ? 'Create Loan' : 'Create a new offer!'}
          onPress={selectedProposal ? () => handleCreateLoan(selectedProposal as SelectedProposal) : undefined}
        />
      ) : null}
    </Flex>
  )
}
