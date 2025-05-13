import { Token } from '@uniswap/client-pools/dist/pools/v1/types_pb'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Button, Flex, Text } from 'ui/src'
import { RotatableChevron } from 'ui/src/components/icons/RotatableChevron'
import { TokenLogo } from 'uniswap/src/components/CurrencyLogo/TokenLogo'
import { TextInput } from 'uniswap/src/components/input/TextInput'
import { CurrencyInfo } from 'uniswap/src/features/dataApi/types'
import { useDebounce } from 'utilities/src/time/timing'
import { maxUint256 } from 'viem'
import { useAssetPrice } from '../queries/useAssetPrice'

export const InputAmountSelectToken = ({
  label,
  onChangeText,
  disabled = false,
  fixedValue,
  onOpenTokenSelector,
  selectedToken,
  maxValue = Number(maxUint256),
  includeInputField = true,
  label2,
}: {
  label: string
  onChangeText: (newValue: string) => void
  maxValue?: number
  disabled?: boolean
  fixedValue?: string
  onOpenTokenSelector: () => void
  selectedToken: CurrencyInfo | null
  includeInputField?: boolean
  label2?: string
}) => {
  const [value, setValue] = useState('')
  const debouncedValue = useDebounce(value, 300)

  const { data: assetPrice } = useAssetPrice(
    selectedToken?.currency.chainId,
    (selectedToken?.currency as unknown as Token)?.address,
  )

  const inputPrice = useMemo(() => {
    if (!assetPrice) return 0
    if (!value && fixedValue) return (Number(fixedValue) * Number(assetPrice)).toFixed(2)
    if (!value) return 0
    return (Number(value) * Number(assetPrice)).toFixed(2)
  }, [assetPrice, value, fixedValue])

  const handleChangeText = useCallback((newValue: string) => {
    const numValue = Number(newValue)
    if (isNaN(numValue) || numValue > maxValue) {
      return
    }
    setValue(newValue)
  }, [])

  useEffect(() => {
    onChangeText(debouncedValue)
  }, [debouncedValue, onChangeText])

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
      width={'100%'}
      height={includeInputField ? (disabled ? '100%' : 'unset') : '8rem'}
      flexShrink={'unset'}
    >
      <Flex row justifyContent="space-between" gap={8} mb={8}>
        <Text color="$neutral2" variant="subheading2">
          {label}
        </Text>
        {label2 && (
          <Text color="$neutral2" variant="subheading2">
            {label2}
          </Text>
        )}
      </Flex>
      {includeInputField && (
        <TextInput
          value={value}
          fontSize={32}
          ml={-15}
          fontWeight={'300'}
          onChangeText={handleChangeText}
          placeholder={fixedValue ?? '0'}
          placeholderTextColor={'$neutral2'}
          color={'$neutral1'}
          keyboardType="numeric"
          disabled={disabled}
        />
      )}
      {includeInputField && (
        <Text variant="subheading2" color="$neutral2">
          ${inputPrice}
        </Text>
      )}
      <Flex
        position="absolute"
        right="$spacing16"
        top={includeInputField ? '55%' : '50%'}
        left={includeInputField ? 'unset' : '3.5rem'}
        transform={[{ translateY: includeInputField ? '-50%' : '0%' }]}
      >
        <Button
          backgroundColor={!selectedToken ? '$accent1' : '$surface1'}
          borderRadius="$rounded20"
          borderColor={!selectedToken ? '$accent1' : '$surface3'}
          borderWidth="$spacing1"
          px="$spacing8"
          py="$spacing16"
          pressStyle={{
            backgroundColor: 'rgb(192, 92, 152)',
          }}
          hoverStyle={{
            backgroundColor: 'rgb(192, 92, 152)',
          }}
          animation="quick"
          size="medium"
          isDisabled={!includeInputField && disabled}
          onPress={onOpenTokenSelector}
          width={selectedToken ? '8rem' : '100%'}
        >
          {!selectedToken ? (
            <Text variant="buttonLabel2" color="$neutral1">
              Select token
            </Text>
          ) : (
            <Flex flexDirection="row" alignItems="center" gap="$spacing8">
              <TokenLogo size={28} url={selectedToken.logoUrl} />
              <Text variant="buttonLabel2" color="$neutral1">
                {selectedToken.currency.symbol}
              </Text>
            </Flex>
          )}
          <RotatableChevron color="$neutral1" direction="down" height="$spacing16" scale={1.5} />
        </Button>
      </Flex>
    </Flex>
  )
}
