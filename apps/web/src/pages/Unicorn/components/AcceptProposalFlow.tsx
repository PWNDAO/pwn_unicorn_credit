import { XMarkIcon } from 'nft/components/icons'
import { useMemo } from 'react'
import { Button, Flex } from 'ui/src'
import { CurrencyInfo } from 'uniswap/src/features/dataApi/types'
import { formatUnits } from 'viem'
import { useLendingContext } from '../contexts/LendingContext'
import { ActionButton } from './ActionButton'
import { TOKEN_BY_ADDRESS } from './AvailableOffersCards'
import { CustomInputComponent } from './CustomInputComponent'
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
    return String(selectedProposal?.hash ?? '').slice(0, 12) + '...'
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
        <Flex flexDirection="row" gap="$spacing4" width={'100%'}>
          <CustomInputComponent
            label="LTV (%)"
            onChangeText={() => {}}
            disabled={true}
            fixedValue={(selectedProposal?.loanToValue / 1_000)?.toString()}
          />
          <CustomInputComponent
            label="Interest (%)"
            onChangeText={() => {}}
            disabled={true}
            fixedValue={(selectedProposal?.apr / 1_000)?.toString()}
          />
          <CustomInputComponent
            label="Duration (days)"
            onChangeText={() => {}}
            disabled={true}
            fixedValue={'30 days'}
          />
        </Flex>
        <Flex flexDirection="row" gap="$spacing4" width={'100%'}>
          <CustomInputComponent label="Hash" onChangeText={() => {}} disabled={true} fixedValue={hash} />
          <CustomInputComponent label="Proposer" onChangeText={() => {}} disabled={true} fixedValue={proposer} />
        </Flex>
        {/* <Flex flexDirection="row" gap="$spacing4">
        </Flex> */}
      </Flex>
      <ActionButton label="Accept Proposal" onPress={() => handleCreateLoan(selectedProposal)} />
    </Flex>
  )
}
