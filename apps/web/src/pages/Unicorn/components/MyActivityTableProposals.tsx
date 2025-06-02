import { Button, Flex, Text } from 'ui/src'
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
  return (
    <Flex width={'$full'}>
      <Flex backgroundColor="$surface1" borderRadius="$rounded16" overflow="hidden" maxHeight={'60vh'} width={'$full'}>
        <Text variant="subheading2" color="$neutral2" px="$spacing16" py="$spacing16">
          {header}
        </Text>
        <Flex flexDirection="column" gap="$spacing16" px="$spacing16" py="$spacing16" overflow="scroll" height="100%">
          {proposals &&
            proposals.map((proposal, index) => (
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
                mb={index === proposals.length - 1 ? 72 : '0'}
                hoverStyle={{
                  backgroundColor: 'rgb(35, 33, 34)',
                }}
              >
                <Flex
                  width="100%"
                  height="100%"
                  flexDirection="column"
                  justifyContent="center"
                  alignItems="stretch"
                  gap="$spacing8"
                  minWidth={'20rem'}
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
                      Collateral
                    </Text>
                    <Text color="$neutral1" variant="body2">
                      {'WETH/USDC'}
                    </Text>
                  </Flex>
                  <Flex flexDirection="row" justifyContent="space-between" alignItems="center" width="100%">
                    <Text color="$neutral3" variant="body2">
                      Interest rate
                    </Text>
                    <Text color="$neutral1" variant="body2">
                      {(proposal.apr ? (proposal.apr / 10_00).toFixed(2) : '—') + '%'}
                    </Text>
                  </Flex>
                  <Flex flexDirection="row" justifyContent="space-between" alignItems="center" width="100%">
                    <Text color="$neutral3" variant="body2">
                      Expiration
                    </Text>
                    <Text color="$neutral1" variant="body2">
                      {timeLeft(Date.now() + Math.floor(Math.random() * 4 * 24 * 60 * 60 * 1000))}
                    </Text>
                  </Flex>
                  <Flex flexDirection="row" justifyContent="center" alignItems="center" width="100%">
                    <Button
                      variant="branded"
                      size="small"
                      borderRadius="$radius8"
                      borderColor="$neutral4"
                      backgroundColor="$accent1"
                      px="$spacing32"
                      py="$spacing8"
                      onPress={() => alert(`Cancel ${isBorrow ? 'request' : 'offer'} #${proposal.id}?`)}
                      maxWidth={'max-content'}
                    >
                      Cancel
                    </Button>
                  </Flex>
                </Flex>
              </Flex>
            ))}
        </Flex>
      </Flex>
    </Flex>
  )
}
