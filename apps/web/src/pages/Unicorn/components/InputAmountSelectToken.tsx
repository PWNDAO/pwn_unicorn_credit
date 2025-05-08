import { Button, Flex, Text } from 'ui/src'
import { TextInput } from 'uniswap/src/components/input/TextInput'
import { useDebounce } from 'utilities/src/time/timing'
import { useCallback, useEffect, useState } from 'react'
import { RotatableChevron } from 'ui/src/components/icons/RotatableChevron'

export const InputAmountSelectToken = (
    {
      label,
      onChangeText,
      disabled = false,
      fixedValue,
      onOpenTokenSelector,
    }: {
      label: string
      onChangeText: (newValue: string) => void
      maxValue?: number
      disabled?: boolean
      fixedValue?: string
      onOpenTokenSelector: () => void
    }
  ) => {
    const [value, setValue] = useState('')
    const debouncedValue = useDebounce(value, 300)

    const handleChangeText = useCallback((newValue: string) => {
      const numValue = Number(newValue)
      if (isNaN(numValue) || numValue > 100) {
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
        width={"100%"}
        flexShrink={"unset"}
      >
        <Text color="$neutral2" variant="subheading2">{label}</Text>
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
        <Flex position="absolute" right="$spacing16" top="55%" transform={[{translateY: '-50%'}]}>
          <Button
            backgroundColor="$accent1"
            borderRadius="$rounded20"
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
            onPress={onOpenTokenSelector}
          >
            <Text variant="buttonLabel2" color="$neutral1">
              Select token
            </Text>
            <RotatableChevron color="$neutral1" direction="down" height="$spacing16" scale={(1.5)}/>
          </Button>
        </Flex>
      </Flex>
    )
  } 