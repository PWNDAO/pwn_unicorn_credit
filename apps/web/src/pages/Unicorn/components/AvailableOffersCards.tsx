import { useMemo } from 'react'
import { Button, Flex, Text } from 'ui/src'
import { formatUnits } from 'viem'
import { useLendingContext } from '../contexts/LendingContext'
import { mockLendingProposals } from '../mocks/mockProposal'

export const TOKEN_BY_ADDRESS = {
  ['0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913']: {
    symbol: 'USDC',
    name: 'USD Coin',
    logoUrl:
      'https://imgs.search.brave.com/qVfnM06301I6nmM20XJwh7E1dtjKpAU1IA0dllgkXNo/rs:fit:40:40:1:0/g:ce/aHR0cHM6Ly9jb2lu/LWltYWdlcy5jb2lu/Z2Vja28uY29tL2Nv/aW5zL2ltYWdlcy82/MzE5L2xhcmdlL3Vz/ZGMucG5nPzE2OTY1/MDY2OTQ',
    decimals: 6,
    chainId: 8453,
    address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
  },
  ['0x4200000000000000000000000000000000000006']: {
    symbol: 'WETH',
    name: 'Wrapped Ether',
    logoUrl: 'https://assets.coingecko.com/coins/images/2518/standard/weth.png?1696503332',
    decimals: 18,
    chainId: 8453,
    address: '0x4200000000000000000000000000000000000006',
  },
}

export const AvailableOffersCards = ({
  creditAmount,
  ltv,
  interestRate,
  mode = 'all',
  handleAcceptProposal,
}: {
  creditAmount?: bigint
  ltv?: number
  interestRate?: number
  mode?: 'borrow' | 'lend' | 'all'
  handleAcceptProposal?: (proposal: any) => void
}) => {
  const { selectedPool, selectedAsset, closeOffers } = useLendingContext()

  const proposals = useMemo(() => {
    return mockLendingProposals
      .filter((p) => {
        const credit = creditAmount ?? 0n
        if (mode === 'borrow') {
          if (interestRate) {
            return (credit > 0n ? p.creditAmount >= credit : true) && p.apr <= interestRate
          } else {
            return credit > 0n ? p.creditAmount >= credit : true
          }
        } else if (mode === 'lend') {
          if (interestRate) {
            return (credit > 0n ? p.creditAmount <= credit : true) && p.apr >= interestRate
          } else {
            return credit > 0n ? p.creditAmount <= credit : true
          }
        } else {
          return true
        }
      })
      .sort((a, b) => {
        // Sort by credit amount first
        if (a.creditAmount !== b.creditAmount) {
          return Number(b.creditAmount - a.creditAmount)
        }

        // Then sort by LTV based on mode
        if (a.loanToValue !== b.loanToValue) {
          return mode === 'lend' ? b.loanToValue - a.loanToValue : a.loanToValue - b.loanToValue
        }

        // Finally sort by APR based on mode
        return mode === 'lend' ? b.apr - a.apr : a.apr - b.apr
      })
  }, [creditAmount, ltv, mode, interestRate, mockLendingProposals])

  const bestProposal = useMemo(() => {
    if (!proposals || proposals.length === 0) return null
    if (mode === 'lend' && !selectedAsset) return null
    if (mode === 'borrow' && !selectedPool) return null

    // TODO: some algo, maybe even [best, cheapest, etc]
    return {
      [proposals[0].id]: proposals[0],
    }
  }, [proposals, selectedPool, selectedAsset])

  const formatNumberWithSuffix = (num: number): string => {
    const suffixes = ['', 'k', 'M', 'B', 'T']
    const tier = Math.floor(Math.log10(Math.abs(num)) / 3)

    if (tier === 0) return num.toString()

    const suffix = suffixes[tier]
    const scale = Math.pow(10, tier * 3)
    const scaled = num / scale

    // Handle decimals - show up to 2 decimal places if needed
    return scaled.toFixed(scaled % 1 === 0 ? 0 : 2) + suffix
  }

  return (
    <Flex backgroundColor="$surface1" width="$full" height="70vh" flex={1} borderRadius="$rounded16" overflow="hidden">
      <Text variant="subheading2" color="$neutral2" px="$spacing16" py="$spacing16">
        Instant Liquidity To Accept
      </Text>
      <Flex flexDirection="column" gap="$spacing32" px="$spacing16" py="$spacing16" overflow="scroll" height="100%">
        {proposals
          ?.filter((p) => Boolean(p))
          .map((proposal, index) => {
            const creditAsset = TOKEN_BY_ADDRESS[proposal.creditAsset.address as keyof typeof TOKEN_BY_ADDRESS]
            // const tokenA = TOKEN_BY_ADDRESS[proposal.tokenAAllowList[0] as keyof typeof TOKEN_BY_ADDRESS]
            // const tokenB = TOKEN_BY_ADDRESS[proposal.tokenBAllowList[0] as keyof typeof TOKEN_BY_ADDRESS]
            const id = proposal.id
            const isBest = bestProposal?.[id] === proposal
            return (
              <Flex key={index} position="relative">
                {/* Keep existing Best Offer label */}
                {isBest && (
                  <Flex
                    position="absolute"
                    top={-10}
                    right={16}
                    backgroundColor="$accent1"
                    px="$spacing8"
                    py="$spacing4"
                    borderRadius="$rounded8"
                    zIndex={1}
                  >
                    <Text color="$white" variant="buttonLabel3">
                      Best {mode === 'borrow' ? 'Offer' : 'Request'}
                    </Text>
                  </Flex>
                )}

                {!isBest && (
                  <Flex
                    position="absolute"
                    top={-10}
                    left={16}
                    backgroundColor="$surface2"
                    opacity={1}
                    px="$spacing8"
                    py="$spacing4"
                    borderRadius="$rounded8"
                    zIndex={1}
                  >
                    <Text color="$neutral1" variant="buttonLabel3">
                      {mode === 'borrow' ? 'Borrow' : 'Lend'}
                    </Text>
                  </Flex>
                )}

                <Button
                  width={'$full'}
                  height={proposals.length === 1 ? '2rem' : '$full'}
                  backgroundColor="$surface1"
                  borderColor={isBest ? '$accent1' : '$surface3'}
                  borderRadius="$rounded20"
                  borderWidth="$spacing1"
                  px="$spacing16"
                  py={72}
                  pressStyle={{
                    backgroundColor: 'rgb(35, 33, 34)',
                  }}
                  hoverStyle={{
                    backgroundColor: 'rgb(35, 33, 34)',
                  }}
                  size="large"
                  justifyContent="unset"
                  onPress={() => handleAcceptProposal?.(proposal)}
                >
                  <Flex
                    flexDirection="column"
                    height={'$spacing120'}
                    width="100%"
                    gap="$spacing4"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Text color="$neutral1" variant="heading2">
                      {formatNumberWithSuffix(
                        Number(formatUnits(BigInt(proposal.creditAmount ?? 0), creditAsset.decimals)),
                      )}{' '}
                      <Text variant="heading3">{creditAsset.symbol}</Text>
                    </Text>
                    <Flex flexDirection="row" alignItems="baseline" gap="$spacing4">
                      <Text color="$neutral1" variant="heading3">
                        %{(proposal.apr / 10_00).toFixed(2)}
                      </Text>
                      <Text color="$neutral3" variant="body2">
                        APR
                      </Text>
                    </Flex>
                  </Flex>
                </Button>
              </Flex>
            )
          })}
        <Flex position="relative">
          <Flex
            position="absolute"
            top={-10}
            right={16}
            backgroundColor="$accent1"
            px="$spacing8"
            py="$spacing4"
            borderRadius="$rounded8"
            zIndex={1}
          >
            <Text color="$white" variant="buttonLabel3">
              Custom
            </Text>
          </Flex>

          <Flex
            position="absolute"
            top={-10}
            left={16}
            backgroundColor="$surface2"
            opacity={1}
            px="$spacing8"
            py="$spacing4"
            borderRadius="$rounded8"
            zIndex={1}
          >
            <Text color="$neutral1" variant="buttonLabel3">
              {mode === 'borrow' ? 'Borrow' : 'Lend'}
            </Text>
          </Flex>

          <Button
            width={'$full'}
            height={proposals.length === 1 ? '2rem' : '$full'}
            backgroundColor="$surface1"
            borderColor="$surface3"
            borderRadius="$rounded20"
            borderWidth="$spacing1"
            px="$spacing16"
            py={72}
            pressStyle={{
              backgroundColor: 'rgb(35, 33, 34)',
            }}
            hoverStyle={{
              backgroundColor: 'rgb(35, 33, 34)',
            }}
            size="large"
            justifyContent="unset"
            onPress={() => closeOffers(true)}
            mb={72}
          >
            <Flex
              flexDirection="column"
              height={'$spacing120'}
              width="100%"
              gap="$spacing4"
              alignItems="center"
              justifyContent="center"
            >
              <Text color="$neutral1" variant="heading3">
                {proposals.length === 0 ? `No ${mode === 'borrow' ? 'offers' : 'requests'}, yet?` : "Don't like any?"}
              </Text>
              <Text color="$neutral1" variant="body1">
                Create custom one, <Text color="$accent1">on your terms</Text>
                {'  '}!
              </Text>
            </Flex>
          </Button>
        </Flex>
      </Flex>
    </Flex>
  )
}
