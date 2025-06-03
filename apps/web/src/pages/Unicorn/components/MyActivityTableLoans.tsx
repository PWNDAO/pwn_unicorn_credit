import { Button, Flex, Text, useMedia } from 'ui/src'

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

export const MyActivityTableLoans = ({ header, mode, loans }: MyActivityTableProps) => {
  const isBorrow = mode === 'borrow'
  const media = useMedia()
  const mockRepayLoan = (index: number) => {
    const res = window.confirm('Repay loan #' + index + '?')
    if (res) {
      const element = document.getElementById(`loan-${index * 691234}`)
      if (element) {
        element.parentNode?.removeChild(element)
      }
    }
  }
  return (
    <Flex width="$full">
      <Flex backgroundColor="$surface1" borderRadius="$rounded16" overflow="hidden" height="60vh" flex={1} width="100%">
        <Text variant="subheading2" color="$neutral2" px="$spacing16" py="$spacing16">
          {header}
        </Text>
        <Flex
          flexDirection="column"
          gap="$spacing16"
          px="$spacing16"
          py="$spacing16"
          overflow="scroll"
          height="100%"
          minWidth={'20rem'}
        >
          {loans &&
            loans.map((loan, index) => (
              <Flex
                width={'$full'}
                key={index}
                height={'$full'}
                backgroundColor="$surface1"
                borderColor={'$surface3'}
                borderRadius="$rounded20"
                borderWidth="$spacing1"
                px="$spacing16"
                py="$spacing16"
                mb={index === loans.length - 1 ? 72 : '0'}
                hoverStyle={{
                  backgroundColor: 'rgb(35, 33, 34)',
                }}
                id={`loan-${index * 691234}`}
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
                        ? timeLeft(Date.now() + Math.floor(Math.random() * 4 * 24 * 60 * 60 * 1000))
                        : loan.expiration
                          ? timeLeft(loan.expiration * 1000)
                          : '—'}
                    </Text>
                  </Flex>
                  <Flex flexDirection="row" justifyContent="space-between" alignItems="center" width="100%">
                    <Text color="$neutral3" variant="body2">
                      On-chain
                    </Text>
                    <Text
                      color="$neutral1"
                      variant="body2"
                      onPress={() => window.open(`https://base.blockscout.com/tx/${loan.hash}`, '_blank')}
                      hoverStyle={{ cursor: 'pointer', textDecorationLine: 'underline' }}
                    >
                      #{Math.floor(Math.random() * 900) + 100}
                    </Text>
                  </Flex>
                  <Flex flexDirection="row" justifyContent="center" alignItems="center" width="100%">
                    {isBorrow ? (
                      <Button
                        variant="branded"
                        size="small"
                        borderRadius="$radius8"
                        borderColor="$neutral4"
                        backgroundColor="$accent1"
                        px="$spacing32"
                        py="$spacing8"
                        onPress={() => mockRepayLoan(index)}
                        maxWidth={'max-content'}
                      >
                        Repay
                      </Button>
                    ) : null}
                  </Flex>
                </Flex>
              </Flex>
            ))}
        </Flex>
      </Flex>
    </Flex>
  )
}
