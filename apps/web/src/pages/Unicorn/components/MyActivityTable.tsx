import { Button, Flex, Text } from 'ui/src'

interface MyActivityTableProps {
  header: 'Offers' | 'Requests' | 'Loans'
  mode: 'borrow' | 'lend'
  loans: any[]
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

export const MyActivityTable = ({ header, mode, loans }: MyActivityTableProps) => {
  const isBorrow = mode === 'borrow'
  return (
    <Flex width="100%" justifyContent="center" alignItems="center">
      <Flex backgroundColor="$surface1" borderRadius="$rounded16" overflow="hidden" height="60vh" flex={1} width="100%">
        <Text variant="subheading2" color="$neutral2" px="$spacing16" py="$spacing16">
          {header}
        </Text>
        <Flex flexDirection="column" gap="$spacing16" px="$spacing16" py="$spacing16" overflow="scroll" height="100%">
          {loans &&
            loans.map((loan, index) => (
              <Button
                width={'$full'}
                key={index}
                height={'$full'}
                backgroundColor="$surface1"
                borderColor={'$surface3'}
                borderRadius="$rounded20"
                borderWidth="$spacing1"
                px="$spacing16"
                py={72}
                mb={index === loans.length - 1 ? 72 : '0'}
                pressStyle={{
                  backgroundColor: 'rgb(35, 33, 34)',
                }}
                hoverStyle={{
                  backgroundColor: 'rgb(35, 33, 34)',
                }}
                size="large"
                justifyContent="unset"
                onPress={() => {}}
              >
                <Flex
                  width="100%"
                  height="100%"
                  flexDirection="column"
                  justifyContent="center"
                  alignItems="stretch"
                  gap="$spacing8"
                >
                  {/* Row 1: Offering/Asking for/Lent/Borrowed ... amount symbol */}
                  <Flex flexDirection="row" justifyContent="space-between" alignItems="center" width="100%">
                    <Text color="$neutral3" variant="body2">
                      {header === 'Requests'
                        ? isBorrow
                          ? 'Asking for'
                          : 'Offering'
                        : header === 'Loans'
                          ? isBorrow
                            ? 'Borrowed'
                            : 'Lent'
                          : isBorrow
                            ? 'Offering to borrow'
                            : 'Offering to lend'}
                    </Text>
                    <Text color="$neutral1" variant="body2">
                      {loan.creditData?.amount
                        ? Number(loan.creditData.amount / 10 ** (loan.creditAsset?.decimals ?? 6)).toLocaleString()
                        : '—'}{' '}
                      {loan.creditAsset?.symbol ?? ''}
                    </Text>
                  </Flex>
                  {/* Row 2: Collateral */}
                  <Flex flexDirection="row" justifyContent="space-between" alignItems="center" width="100%">
                    <Text color="$neutral3" variant="body2">
                      Collateral
                    </Text>
                    <Text color="$neutral1" variant="body2">
                      {'WETH/USDC'}
                    </Text>
                  </Flex>
                  {/* Row 3: Interest rate */}
                  <Flex flexDirection="row" justifyContent="space-between" alignItems="center" width="100%">
                    <Text color="$neutral3" variant="body2">
                      Interest rate
                    </Text>
                    <Text color="$neutral1" variant="body2">
                      {(loan.creditData?.apr ? (loan.creditData.apr / 10_00).toFixed(2) : '—') + '%'}
                    </Text>
                  </Flex>
                  {/* Row 4: Expiring / Default in */}
                  <Flex flexDirection="row" justifyContent="space-between" alignItems="center" width="100%">
                    <Text color="$neutral3" variant="body2">
                      {header === 'Loans' ? 'Default' : 'Expiration'}
                    </Text>
                    <Text color="$neutral1" variant="body2">
                      {header === 'Loans'
                        ? timeLeft(loan.defaultDate * 1000)
                        : loan.expiration
                          ? timeLeft(loan.expiration * 1000)
                          : '—'}
                    </Text>
                  </Flex>
                </Flex>
              </Button>
            ))}
        </Flex>
      </Flex>
    </Flex>
  )
}
