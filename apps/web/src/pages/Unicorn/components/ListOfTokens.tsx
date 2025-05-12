import { Flex, Text } from 'ui/src'
import { TokenLogo } from 'uniswap/src/components/CurrencyLogo/TokenLogo'
import { CurrencyInfo } from 'uniswap/src/features/dataApi/types'

export const ListOfTokens = ({ tokens, label }: { tokens: CurrencyInfo[]; label: string }) => {
  return (
    <Flex
      animation="simple"
      borderColor="$surface3"
      borderRadius="$rounded20"
      backgroundColor="$surface1"
      borderWidth="$spacing1"
      overflow="hidden"
      px="$spacing16"
      py="$spacing16"
      width="100%"
      flexShrink="unset"
    >
      <Text color="$neutral2" variant="subheading2">
        {label}
      </Text>

      <Flex flexDirection="row" flexWrap="wrap" gap="$spacing12" mt="$spacing12">
        {tokens.map((token, index) => (
          <Flex
            key={index}
            backgroundColor="$surface2"
            borderRadius="$rounded12"
            p="$spacing8"
            alignItems="center"
            justifyContent="center"
          >
            <TokenLogo size={32} url={token.logoUrl} />
          </Flex>
        ))}
      </Flex>
    </Flex>
  )
}
