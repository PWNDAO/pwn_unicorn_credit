import { useCallback, useEffect, useState } from 'react'
import { Flex, Text } from 'ui/src'
import { TextInput } from 'uniswap/src/components/input/TextInput'
import { useDebounce } from 'utilities/src/time/timing'

export const CustomInputComponent = ({
  label,
  onChangeText,
  disabled = false,
  fixedValue,
}: {
  label: string
  onChangeText: (newValue: string) => void
  disabled?: boolean
  fixedValue?: string
}) => {
  const [value, setValue] = useState('')
  const debouncedValue = useDebounce(value, 300)

  const handleChangeText = useCallback((newValue: string) => {
    const numValue = Number(newValue)
    if (isNaN(numValue)) {
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
      width={'$full'}
      flexShrink={'unset'}
      flex={1}
    >
      <Text color="$neutral2" variant="subheading2">
        {label}
      </Text>
      <TextInput
        value={value}
        fontSize={32}
        ml={-15}
        fontWeight={'300'}
        onChangeText={handleChangeText}
        placeholder={fixedValue ?? '0'}
        placeholderTextColor={'$neutral2'}
        color={fixedValue ? '$neutral2' : '$neutral1'}
        keyboardType="numeric"
        disabled={disabled}
      />
    </Flex>
  )
}
