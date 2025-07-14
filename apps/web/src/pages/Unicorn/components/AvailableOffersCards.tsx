import { Flex, Text, useMedia } from 'ui/src'
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

const ProposalRow = ({ label, value }: { label: string; value: string }) => (
  <Flex flexDirection="row" px="$spacing24" py="$spacing8" alignItems="center">
    <Flex flex={1}>
      <Text color="$neutral2">{label}</Text>
    </Flex>
    <Flex flex={1} alignItems="flex-end">
      <Text color="$neutral1">{value}</Text>
    </Flex>
  </Flex>
)

const ProposalHeader = ({ mode, isBest }: { mode: string; isBest: boolean }) => (
  <Flex flexDirection="row" backgroundColor="$surface2" px="$spacing16" py="$spacing8" position="relative">
    <Flex flex={1}>
      <Text color="$neutral2" variant="subheading2">
        {mode === 'borrow' ? 'Borrow Offer' : 'Lend Offer'}
      </Text>
    </Flex>
    {isBest && (
      <Flex backgroundColor="$accent1" px="$spacing8" py="$spacing4" borderRadius="$rounded8">
        <Text color="$white" variant="buttonLabel3">
          Best Interest
        </Text>
      </Flex>
    )}
  </Flex>
)

export const AvailableOffersCards = ({ handleAcceptProposal }: { handleAcceptProposal?: (proposal: any) => void }) => {
  const { closeOffers, proposals, bestProposal, selectedAppTab } = useLendingContext()

  const mode = selectedAppTab === APP_TABS.BORROW ? 'borrow' : selectedAppTab === APP_TABS.LEND ? 'lend' : 'all'
  const media = useMedia()

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
      <Flex flexDirection="column" gap="$spacing16" px="$spacing16" py="$spacing16" overflow="scroll" height="100%">
        {proposals
          ?.filter((p) => Boolean(p))
          .map((proposal, index) => {
            const creditAsset = TOKEN_BY_ADDRESS[proposal.creditAsset.address as keyof typeof TOKEN_BY_ADDRESS]
            const id = proposal.id
            const isBest = bestProposal?.[id] === proposal
            const liquidityAmount = formatUnits(BigInt(proposal.creditAmount ?? 0), creditAsset.decimals)
            const interestRate = (proposal.apr / 10_00).toFixed(2)

            return (
              <Flex
                key={index}
                flexDirection="column"
                width="100%"
                backgroundColor="$surface1"
                borderRadius="$rounded20"
                borderWidth="$spacing1"
                borderColor={isBest ? '$accent1' : '$surface3'}
                overflow="hidden"
                pressStyle={{ opacity: 0.8 }}
                hoverStyle={{ backgroundColor: '$surface2' }}
                onPress={() => handleAcceptProposal?.(proposal)}
                cursor="pointer"
                minWidth={media.lg ? '100%' : '20rem'}
                mb={index === proposals.length - 1 ? '7rem' : '$none'}
              >
                <ProposalHeader mode={mode} isBest={isBest} />
                <Flex flexDirection="column" py="$spacing16">
                  <ProposalRow label="Liquidity" value={`${liquidityAmount}`} />
                  <ProposalRow label="Asset" value={creditAsset.name} />
                  <ProposalRow label="Interest Rate" value={`${interestRate}%`} />
                  <ProposalRow label="Network" value="Base" />
                </Flex>
              </Flex>
            )
          })}
      </Flex>
    </Flex>
  )
}
