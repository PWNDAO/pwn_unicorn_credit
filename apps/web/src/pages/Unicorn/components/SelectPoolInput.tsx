import { Button, Flex, Text } from 'ui/src'
import { RotatableChevron } from 'ui/src/components/icons/RotatableChevron'
import { PoolData, chainName } from 'uniswap/src/components/TokenSelector/lists/TokenSelectorPoolsList'

export const SelectPoolInput = ({
  selectedPool,
  onOpenTokenSelector,
}: {
  selectedPool: PoolData | null
  onOpenTokenSelector: () => void
}) => {
  const handleOpenTokenSelector = () => {
    onOpenTokenSelector()
  }
  return (
    <Flex
      animation="simple"
      borderColor={true ? '$surface3' : '$transparent'}
      borderRadius="$rounded20"
      backgroundColor={true ? '$surface1' : '$surface2'}
      borderWidth="$spacing1"
      overflow="hidden"
      px="$spacing16"
      py="$spacing16"
      width={'30rem'}
      gap="$spacing24"
      pb="$spacing24"
    >
      <Text color="$neutral2" variant="subheading2">
        Borrow Against
      </Text>
      {!selectedPool ? (
        <Flex centered>
          <Button
            backgroundColor="$accent1"
            borderRadius="$rounded20"
            px="$spacing16"
            py="$spacing16"
            pressStyle={{
              backgroundColor: 'rgb(192, 92, 152)',
            }}
            hoverStyle={{
              backgroundColor: 'rgb(192, 92, 152)',
            }}
            animation="quick"
            size="large"
            onPress={handleOpenTokenSelector}
          >
            <Text variant="buttonLabel1" color="$sporeWhite">
              Select Uniswap V3 Position
            </Text>
            <RotatableChevron color="$neutral1" direction="down" height="$spacing24" />
          </Button>
        </Flex>
      ) : (
        <Flex width={'$full'} minHeight={100}>
          <Button
            width={'$full'}
            height={'$full'}
            backgroundColor="$surface1"
            borderColor="$surface3"
            borderRadius="$rounded20"
            borderWidth="$spacing1"
            px="$spacing16"
            py="$spacing16"
            pressStyle={{
              backgroundColor: 'rgb(35, 33, 34)',
            }}
            hoverStyle={{
              backgroundColor: 'rgb(35, 33, 34)',
            }}
            animation="quick"
            size="large"
            onPress={handleOpenTokenSelector}
            justifyContent="unset"
          >
            <Flex flexDirection="column" height={'$spacing120'} width="100%" justifyContent="space-between">
              <Flex flexDirection="row" gap="$spacing12" justifyContent="space-between">
                <Flex flexDirection="row" gap="$spacing12" justifyContent="space-between">
                  <Text color="$neutral1" variant="subheading2">
                    {selectedPool.tokens.token0.symbol} / {selectedPool.tokens.token1.symbol}
                  </Text>
                  <Text color="$neutral1" variant="subheading2">
                    {selectedPool.feeTier / 10000}%
                  </Text>
                </Flex>
                <Text color="$neutral1" variant="subheading2">
                  ${selectedPool.totalUsdValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                </Text>
              </Flex>
              <Flex flexDirection="row" width="$full" justifyContent="space-between">
                <Text color="$neutral1" variant="subheading2">
                  Chain: {chainName(selectedPool.tokens.token0.chainId)}
                </Text>
                <RotatableChevron color="$neutral1" direction="down" height="$spacing24" />
              </Flex>
            </Flex>
          </Button>
        </Flex>
      )}
    </Flex>
  )
}
