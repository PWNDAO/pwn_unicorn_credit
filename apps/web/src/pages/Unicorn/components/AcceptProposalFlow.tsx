import { XMarkIcon } from 'nft/components/icons'
import { useMemo } from 'react'
import { Button, Flex } from 'ui/src'
import { CurrencyInfo } from 'uniswap/src/features/dataApi/types'
import { formatUnits } from 'viem'
import { DEFAULT_DURATION_DAYS } from '../constants/duration'
import { useLendingContext } from '../contexts/LendingContext'
import { AcceptProposalTermsTable } from './AcceptProposalTermsTable'
import { ActionButton } from './ActionButton'
import { TOKEN_BY_ADDRESS } from './AvailableOffersCards'
import { InputAmountSelectToken } from './InputAmountSelectToken'
import { ListOfTokens } from './ListOfTokens'
import { SelectPoolInput } from './SelectPoolInput'

export const AcceptProposalFlow = () => {
  const { selectedProposal, handleCreateLoan, handleDiscardAcceptProposal } = useLendingContext()

  const creditAssetObject: CurrencyInfo = {
    currency: {
      ...selectedProposal?.creditAsset,
    },
    currencyId: selectedProposal?.creditAsset.address,
    logoUrl: selectedProposal?.creditAsset.logoUrl,
  }
  const mode = selectedProposal?.mode as 'borrow' | 'lend'
  const maxBorrowableAmount = useMemo(() => {
    if (mode !== 'borrow' && !selectedProposal?.pool) return 0
    return Number(selectedProposal?.pool?.totalUsdValue) * (selectedProposal?.loanToValue / 100_000)
  }, [selectedProposal])

  const selectedPairTokens = useMemo(() => {
    if (mode !== 'lend') return []
    const tokenAList: CurrencyInfo[] =
      selectedProposal?.tokenAAllowList?.map((token: string) => {
        return {
          currency: {
            ...TOKEN_BY_ADDRESS[token as keyof typeof TOKEN_BY_ADDRESS],
            isNative: false,
            isToken: true,
            equals: () => false,
            sortsBefore: () => false,
            wrapped: {} as any,
          },
          currencyId: token,
          logoUrl: TOKEN_BY_ADDRESS[token as keyof typeof TOKEN_BY_ADDRESS]?.logoUrl,
        }
      }) ?? []
    const tokenBList: CurrencyInfo[] =
      selectedProposal?.tokenBAllowList?.map((token: string) => {
        return {
          currency: {
            ...TOKEN_BY_ADDRESS[token as keyof typeof TOKEN_BY_ADDRESS],
            isNative: false,
            isToken: true,
            equals: () => false,
            sortsBefore: () => false,
            wrapped: {} as any,
          },
          currencyId: token,
          logoUrl: TOKEN_BY_ADDRESS[token as keyof typeof TOKEN_BY_ADDRESS]?.logoUrl,
        }
      }) ?? []
    return [...tokenAList, ...tokenBList]
  }, [selectedProposal])

  const proposer = useMemo(() => {
    const addr = selectedProposal?.proposer ?? ''
    return addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : undefined
  }, [selectedProposal])

  const hash = useMemo(() => {
    const hash = selectedProposal?.hash ?? ''
    return hash ? `${hash.slice(0, 6)}...${hash.slice(-4)}` : undefined
  }, [selectedProposal])

  const blockExplorerUrl = useMemo(() => {
    if (!selectedProposal?.hash) return undefined

    const chainId = selectedProposal?.chainId
    switch (chainId) {
      case 8453:
        return `https://base.blockscout.com/`
      default:
        return undefined
    }
  }, [selectedProposal])

  const totalWillRepay = useMemo(() => {
    if (!selectedProposal?.creditAmount || !selectedProposal?.apr) return undefined
    const durationDays = DEFAULT_DURATION_DAYS
    const totalRepayment = selectedProposal.creditAmount * (selectedProposal.apr / 1000) * (durationDays / 365)
    const formatted = formatUnits(
      BigInt(totalRepayment?.toString().split('.')[0]),
      creditAssetObject?.currency?.decimals ?? 18,
    )
    return `${Number(formatted).toFixed(6).toString()} ${creditAssetObject?.currency?.symbol}`
  }, [selectedProposal])

  return (
    <Flex flexDirection="column" gap="$spacing16" width={'100%'}>
      <Button
        position="absolute"
        top={-10}
        right={-60}
        backgroundColor="$surface1"
        borderColor="$surface3"
        borderRadius="$rounded12"
        borderWidth="$spacing1"
        zIndex={1}
        px="$spacing4"
        py="$spacing4"
        pressStyle={{
          backgroundColor: 'rgb(35, 33, 34)',
        }}
        hoverStyle={{
          backgroundColor: 'rgb(35, 33, 34)',
        }}
        onPress={handleDiscardAcceptProposal}
      >
        <XMarkIcon fill="red" width={30} height={30} />
      </Button>
      {mode === 'borrow' ? (
        <Flex flexGrow={1} flexDirection="row" gap="$spacing4" width={'100%'}>
          <Flex width={'50%'} height={'100%'}>
            <InputAmountSelectToken
              label="Borrow"
              onChangeText={() => {}}
              onOpenTokenSelector={() => {}}
              selectedToken={creditAssetObject}
              disabled
              fixedValue={maxBorrowableAmount?.toFixed(2)}
            />
          </Flex>
          <Flex width={'50%'}>
            <SelectPoolInput onOpenTokenSelector={() => {}} selectedPool={selectedProposal?.pool} />
          </Flex>
        </Flex>
      ) : (
        <Flex flexGrow={1} flexDirection="row" gap="$spacing4" width={'100%'}>
          <Flex width={'50%'} height={'100%'}>
            <InputAmountSelectToken
              label="Lend"
              onChangeText={() => {}}
              onOpenTokenSelector={() => {}}
              selectedToken={creditAssetObject}
              disabled
              fixedValue={formatUnits(
                selectedProposal?.creditAmount ?? 0n,
                creditAssetObject?.currency?.decimals ?? 18,
              )}
            />
          </Flex>
          <Flex width={'50%'}>
            <ListOfTokens tokens={selectedPairTokens} label="Pools made from these tokens" />
          </Flex>
        </Flex>
      )}

      <Flex flexDirection="column" gap="$spacing4" width={'100%'}>
        <AcceptProposalTermsTable
          terms={[
            {
              label: 'Loan-to-Value',
              value: selectedProposal?.loanToValue ? `${selectedProposal.loanToValue / 1_000}%` : 'N/A',
            },
            { label: 'Interest Rate', value: selectedProposal?.apr ? `${selectedProposal.apr / 1_000}%` : 'N/A' },
            { label: 'Total Would Repay', value: totalWillRepay },
            { label: 'Duration of the Loan', value: '30 days' },
            { label: 'Proposal Hash', value: hash },
            {
              label: 'Your Counter-Party',
              value: proposer,
              url: `${blockExplorerUrl}/address/${selectedProposal?.proposer}`,
            },
          ]}
        />
      </Flex>
      <ActionButton label="Create loan" onPress={() => handleCreateLoan(selectedProposal)} />
    </Flex>
  )
}
