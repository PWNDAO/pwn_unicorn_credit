import { Button, Flex, Text } from 'ui/src'
import { RotatableChevron } from 'ui/src/components/icons/RotatableChevron'
import { TokenLogo } from 'uniswap/src/components/CurrencyLogo/TokenLogo'
import { PoolData, formatNumberWithSuffix } from 'uniswap/src/components/TokenSelector/lists/TokenSelectorPoolsList'

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
              Select Your Uniswap V3 Position
            </Text>
            <RotatableChevron color="$neutral1" direction="down" height="$spacing24" />
          </Button>
        </Flex>
      ) : (
        <Flex
          py="$spacing24"
          px="$spacing8"
          onPress={handleOpenTokenSelector}
          pressStyle={{
            backgroundColor: 'rgb(35, 33, 34)',
          }}
          hoverStyle={{
            backgroundColor: 'rgb(35, 33, 34)',
          }}
          borderRadius={16}
        >
          <Flex flexDirection="column" justifyContent="space-between" alignContent="stretch" height={'100%'} mt={-10}>
            <Flex row gap="$spacing8" alignItems="center">
              <Flex row gap="$spacing4" alignItems="center">
                <TokenLogo
                  size={32}
                  url={
                    'https://imgs.search.brave.com/qVfnM06301I6nmM20XJwh7E1dtjKpAU1IA0dllgkXNo/rs:fit:40:40:1:0/g:ce/aHR0cHM6Ly9jb2lu/LWltYWdlcy5jb2lu/Z2Vja28uY29tL2Nv/aW5zL2ltYWdlcy82/MzE5L2xhcmdlL3Vz/ZGMucG5nPzE2OTY1/MDY2OTQ'
                  }
                />
                <Text fontSize={16} color="$neutral1">
                  {selectedPool.tokens.token0.symbol}
                </Text>
              </Flex>
              <Text fontSize={16} color="$neutral1">
                /
              </Text>
              <Flex row gap="$spacing4" alignItems="center">
                <TokenLogo
                  size={32}
                  url={
                    'https://token-repository.dappradar.com/tokens?protocol=ethereum&contract=0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2&file=logo.png'
                  }
                />
                <Text fontSize={16} color="$neutral1">
                  {selectedPool.tokens.token1.symbol}
                </Text>
              </Flex>
              <RotatableChevron color="$neutral1" direction="down" height="$spacing24" />
            </Flex>
          </Flex>
          <Flex row justifyContent="space-between" alignItems="center">
            <Text variant="body1" color="$neutral2">
              ${formatNumberWithSuffix(selectedPool.totalUsdValue)}
            </Text>
            <Text variant="body2" color="$neutral2">
              {Number(selectedPool.feeTier) / 10_000}%
            </Text>
          </Flex>
        </Flex>
      )}
    </Flex>
  )
}
