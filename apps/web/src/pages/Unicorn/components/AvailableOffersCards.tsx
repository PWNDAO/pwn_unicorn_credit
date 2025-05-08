import { Button, Flex, Text } from 'ui/src'
import { mockPositions } from '../mocks/mockPosition'
import { chainName } from 'uniswap/src/components/TokenSelector/lists/TokenSelectorPoolsList'
import { PoolPosition } from '@uniswap/client-pools/dist/pools/v1/types_pb'
export const AvailableOffersCards = () => {
  return (
    <Flex flexDirection="column" gap="$spacing8" px="$spacing16" py="$spacing16">
        <Text variant="subheading2" color="$neutral2">Choose from the following offers</Text>
      {mockPositions
        .filter(p => Boolean(p.position.value))
        .map((position, index) => {
        const positionData = position.position.value as PoolPosition
        return (
          <Button
            key={index}
            width={'$full'} 
            height={'$full'}
            backgroundColor="$surface1"
            borderColor="$surface3"
            borderRadius="$rounded20"
            borderWidth="$spacing1"
            px="$spacing16"
            py={48}
            pressStyle={{
              backgroundColor: 'rgb(35, 33, 34)',
            }}
            hoverStyle={{
              backgroundColor: 'rgb(35, 33, 34)',
            }}
            animation="quick"
            size="large"
            justifyContent='unset'
          >
            <Flex flexDirection="column" height={'$spacing120'} width="100%" justifyContent="space-between">
              <Flex flexDirection="row" gap="$spacing12" justifyContent="space-between">
                <Flex flexDirection="row" gap="$spacing12" justifyContent="space-between">
                  <Text color="$neutral1" variant="subheading2">
                    {positionData?.token0?.symbol} / {positionData?.token1?.symbol}
                  </Text>
                  <Text color="$neutral1" variant="subheading2">
                    {Number(positionData?.feeTier) / 10000}%
                  </Text>
                </Flex>
                <Text color="$neutral1" variant="subheading2">
                  ${Number(positionData.totalLiquidityUsd).toLocaleString(undefined, {maximumFractionDigits: 2})}
                </Text>
              </Flex>
              <Flex flexDirection="row" width="$full" justifyContent="space-between">
                <Text color="$neutral1" variant="subheading2">
                  Chain: {chainName(positionData?.token0?.chainId ?? 0)}
                </Text>
              </Flex>
            </Flex>
          </Button>
        )
      })}
    </Flex>
  )
}
