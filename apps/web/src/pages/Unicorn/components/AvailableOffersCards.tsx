import { Button, Flex, Text } from 'ui/src'
import { formatUnits } from 'viem'
import { useLendingContext } from '../contexts/LendingContext'
import { APP_TABS } from '../hooks/lendingState'

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

export const AvailableOffersCards = ({ handleAcceptProposal }: { handleAcceptProposal?: (proposal: any) => void }) => {
  const { closeOffers, proposals, bestProposal, selectedAppTab } = useLendingContext()

  const mode = selectedAppTab === APP_TABS.BORROW ? 'borrow' : selectedAppTab === APP_TABS.LEND ? 'lend' : 'all'

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
                      Best Interest
                    </Text>
                  </Flex>
                )}

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
                    <Flex flexDirection="row" alignItems="baseline" gap="$spacing4">
                      <Text variant="body2" color="$neutral3">
                        Liquidity
                      </Text>
                      <Text variant="heading2">
                        {formatUnits(BigInt(proposal.creditAmount ?? 0), creditAsset.decimals)}
                      </Text>
                      <Text variant="heading3">{creditAsset.symbol}</Text>
                    </Flex>
                    <Flex flexDirection="row" alignItems="baseline" gap="$spacing4">
                      <Text color="$neutral1" variant="heading3">
                        {(proposal.apr / 10_00).toFixed(2)}%
                      </Text>
                      <Text color="$neutral3" variant="body2">
                        Interest
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
