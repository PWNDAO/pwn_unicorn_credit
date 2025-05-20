import { Button, Flex, Text } from 'ui/src'

interface MyActivityTableProps {
  header: 'Offers' | 'Requests' | 'Loans'
  mode: 'borrow' | 'lend'
  loans: any[]
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
                <Flex width="100%" height="100%" justifyContent="center" alignItems="center">
                  <Flex flexDirection="column" width="100%" alignItems="center" gap="$spacing4">
                    <Text color="$neutral1" variant="heading3">
                      {header === 'Requests'
                        ? isBorrow
                          ? 'Asking to borrow'
                          : 'Offering to lend'
                        : header === 'Loans'
                          ? isBorrow
                            ? 'Borrowed'
                            : 'Lent'
                          : isBorrow
                            ? 'Offering to borrow'
                            : 'Offering to lend'}{' '}
                      {loan.creditAmount
                        ? Number(loan.creditAmount / 10 ** (loan.creditAsset?.decimals ?? 6)).toLocaleString()
                        : '—'}{' '}
                      <Text variant="heading3">{loan.creditAsset?.symbol ?? ''}</Text>{' '}
                      {header === 'Requests' || header === 'Offers' ? (isBorrow ? 'against' : 'for') : 'against'}{' '}
                      {'WETH/USDC'}
                    </Text>
                    <Flex flexDirection="row" alignItems="baseline" gap="$spacing4">
                      <Text color="$neutral1" variant="heading3">
                        {'at '}%{(loan.creditData?.apr / 10_00).toFixed(2)}
                      </Text>
                      <Text color="$neutral3" variant="body2">
                        APR
                      </Text>
                    </Flex>
                  </Flex>
                </Flex>
              </Button>
            ))}
        </Flex>
      </Flex>
    </Flex>
  )
}
