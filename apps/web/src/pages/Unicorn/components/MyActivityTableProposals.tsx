import { useEffect, useState } from 'react'
import { Button, Flex, Text, useMedia } from 'ui/src'
import { TokenLogo } from 'uniswap/src/components/CurrencyLogo/TokenLogo'
import { formatUnits } from 'viem'

interface MyActivityTableProps {
  header: 'Offers' | 'Requests'
  mode: 'borrow' | 'lend'
  proposals: any[]
}

const timeLeft = (end: number) => {
  const now = Date.now()
  const msLeft = end - now
  if (msLeft <= 0) return null
  const days = Math.floor(msLeft / (1000 * 60 * 60 * 24))
  const hours = Math.floor((msLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((msLeft % (1000 * 60 * 60)) / (1000 * 60))
  return (days > 0 ? `${days}d ` : '') + (hours > 0 ? `${hours}h ` : '') + (minutes > 0 ? `${minutes}m` : '')
}

export const MyActivityTableProposals = ({ header, mode, proposals }: MyActivityTableProps) => {
  const isBorrow = mode === 'borrow'
  const media = useMedia()

  // Maintain proposals in local state so we can remove cancelled ones
  const [proposalList, setProposalList] = useState(proposals ?? [])

  // Keep local state in sync if parent updates the prop
  useEffect(() => {
    setProposalList(proposals ?? [])
  }, [proposals])

  const mockCancelProposal = (index: number) => {
    const res = window.confirm('Cancel proposal #' + index + '?')
    if (res) {
      setProposalList((prev) => prev.filter((_, i) => i !== index))
    }
  }

  return (
    <Flex width={'$full'}>
      <Flex
        backgroundColor="$surface1"
        borderRadius="$rounded16"
        overflow="hidden"
        height={'60vh'}
        width={'$full'}
        flex={1}
      >
        <Text variant="subheading2" color="$neutral2" px="$spacing16" py="$spacing16">
          {header}
        </Text>
        <Flex
          flexDirection="column"
          gap="$spacing16"
          px="$spacing16"
          py="$spacing16"
          overflow="scroll"
          $platform-web={{ overflow: 'auto' }}
          height="100%"
          width={media.sm ? '90vw' : '100%'}
          minWidth={media.sm ? '0' : '20rem'}
          flex={1}
        >
          {proposalList && proposalList.length > 0 ? (
            proposalList.map((proposal, index) => (
              <Flex
                key={index}
                width={'$full'}
                height={'$full'}
                backgroundColor="$surface1"
                borderColor={'$surface3'}
                borderRadius="$rounded20"
                borderWidth="$spacing1"
                px="$spacing16"
                py="$spacing16"
                mb={index === proposalList.length - 1 ? 72 : '0'}
                hoverStyle={{
                  backgroundColor: 'rgb(35, 33, 34)',
                }}
                id={`proposal-${index * 691234}`}
                minWidth={media.sm ? '0' : '20rem'}
              >
                <Flex
                  width="100%"
                  height="100%"
                  flexDirection="column"
                  justifyContent="center"
                  alignItems="stretch"
                  gap="$spacing8"
                >
                  <Flex flexDirection="row" justifyContent="space-between" alignItems="center" width="100%">
                    <Text color="$neutral3" variant="body2">
                      {header === 'Offers' ? 'Offering' : 'Asking for'}
                    </Text>
                    <Text color="$neutral1" variant="body2">
                      {formatUnits(proposal.creditAmount, proposal.creditAsset.decimals) +
                        ' ' +
                        proposal.creditAsset.symbol}
                    </Text>
                  </Flex>
                  <Flex flexDirection="row" justifyContent="space-between" alignItems="center" width="100%">
                    <Text color="$neutral3" variant="body2">
                      LP Pair
                    </Text>
                    <Flex flexDirection="row" alignItems="center" gap="$spacing8">
                      <TokenLogo
                        size={20}
                        url="https://assets.coingecko.com/coins/images/2518/standard/weth.png?1696503332"
                      />
                      <Text variant="body2" color="$neutral1">
                        WETH
                      </Text>
                      <Text variant="body2" color="$neutral1">
                        /
                      </Text>
                      <TokenLogo
                        size={20}
                        url="https://imgs.search.brave.com/qVfnM06301I6nmM20XJwh7E1dtjKpAU1IA0dllgkXNo/rs:fit:40:40:1:0/g:ce/aHR0cHM6Ly9jb2lu/LWltYWdlcy5jb2lu/Z2Vja28uY29tL2Nv/aW5zL2ltYWdlcy82/MzE5L2xhcmdlL3Vz/ZGMucG5nPzE2OTY1/MDY2OTQ"
                      />
                      <Text variant="body2" color="$neutral1">
                        USDC
                      </Text>
                    </Flex>
                  </Flex>
                  <Flex flexDirection="row" justifyContent="space-between" alignItems="center" width="100%">
                    <Text color="$neutral3" variant="body2">
                      Interest rate
                    </Text>
                    <Text color="$neutral1" variant="body2">
                      {(proposal.apr ? (proposal.apr / 10_00).toFixed(2) : '—') + '%'}
                    </Text>
                  </Flex>
                  {/* <Flex flexDirection="row" justifyContent="space-between" alignItems="center" width="100%">
                    <Text color="$neutral3" variant="body2">
                      Expiration
                    </Text>
                    <Text color="$neutral1" variant="body2">
                      {timeLeft(Date.now() + Math.floor(Math.random() * 4 * 24 * 60 * 60 * 1000))}
                    </Text>
                  </Flex> */}
                  <Flex flexDirection="row" justifyContent="center" alignItems="center" width="100%">
                    <Button
                      variant="branded"
                      size="small"
                      borderRadius="$radius8"
                      borderColor="$neutral4"
                      backgroundColor="$accent1"
                      px="$spacing32"
                      py="$spacing8"
                      onPress={() => mockCancelProposal(index)}
                      maxWidth={'max-content'}
                    >
                      Cancel
                    </Button>
                  </Flex>
                </Flex>
              </Flex>
            ))
          ) : (
            <Flex
              flex={1}
              justifyContent="center"
              alignItems="center"
              width="100%"
              minWidth={media.sm ? '0' : '20rem'}
              px="$spacing16"
              py="$spacing16"
            >
              <Text variant="body2" color="$neutral3">
                No {header.toLowerCase()} yet
              </Text>
            </Flex>
          )}
        </Flex>
      </Flex>
    </Flex>
  )
}
