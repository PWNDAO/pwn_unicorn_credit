import { Token } from '@uniswap/client-pools/dist/pools/v1/types_pb'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Button, Flex, Text } from 'ui/src'
import { RotatableChevron } from 'ui/src/components/icons/RotatableChevron'
import { TokenLogo } from 'uniswap/src/components/CurrencyLogo/TokenLogo'
import { CurrencyInfo } from 'uniswap/src/features/dataApi/types'
import { useDebounce } from 'utilities/src/time/timing'
import { maxUint256 } from 'viem'
import { LOAN_TO_VALUE_PERCENT } from '../constants/ltv'
import { useLendingContext } from '../contexts/LendingContext'
import { useAssetPrice } from '../queries/useAssetPrice'

export const InputLpPairTokens = ({
  label,
  onChangeText,
  disabled = false,
  fixedValue,
  onOpenTokenSelector,
  selectedToken,
  maxValue = Number(maxUint256),
  includeInputField = true,
  label2,
  mode = 'default',
  firstPredefined = null,
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
  mode?: 'default' | 'borrow-computed'
  firstPredefined?: null | {
    symbol: string
    address: Address
    logoUrl: string | null
  }
}) => {
  const [value, setValue] = useState('')
  const debouncedValue = useDebounce(value, 300)

  const { selectedPool } = useLendingContext()

  const { data: assetPrice } = useAssetPrice(
    selectedToken?.currency.chainId,
    (selectedToken?.currency as unknown as Token)?.address,
  )

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

  const maxBorrowAmount = useMemo(() => {
    if (mode !== 'borrow-computed') return '0'
    if (!selectedPool || !selectedToken) return '0'

    const maxBorrowUsd = selectedPool.totalUsdValue * LOAN_TO_VALUE_PERCENT
    const maxBorrowAmount = maxBorrowUsd / Number(assetPrice)
    return maxBorrowAmount.toString()
  }, [selectedPool, selectedToken, assetPrice])

  const placeholderValue = useMemo(() => {
    // Determine the number of decimals needed, but cap at 6
    function getMaxDecimals(num: number, maxDecimals = 6) {
      if (!isFinite(num)) return 0
      const str = num.toString()
      if (str.indexOf('.') === -1) return 0
      // Remove trailing zeros for accurate count
      const decimals = str.split('.')[1]?.replace(/0+$/, '') ?? ''
      return Math.min(decimals.length, maxDecimals)
    }

    if (mode === 'borrow-computed' && maxBorrowAmount) {
      const num = Number(maxBorrowAmount)
      const decimals = getMaxDecimals(num, 6)
      return num.toFixed(decimals)
    }
    if (!fixedValue) return '0'
    return fixedValue
  }, [mode, maxBorrowAmount, fixedValue])

  const inputPrice = useMemo(() => {
    if (!assetPrice) return 0
    if (!value && fixedValue) return (Number(fixedValue) * Number(assetPrice)).toFixed(2)
    if (mode === 'borrow-computed' && maxBorrowAmount) {
      return (Number(maxBorrowAmount) * Number(assetPrice)).toFixed(2)
    }
    if (!value) return 0
    return (Number(value) * Number(assetPrice)).toFixed(2)
  }, [assetPrice, value, fixedValue])

  const boxHeight = useMemo(() => {
    // if (mode === 'borrow-computed') return 'unset'
    // if (includeInputField) return '100%'
    // return '8rem'
    return '8rem'
  }, [mode, includeInputField])

  // syncs computed value to input state
  useEffect(() => {
    if (mode === 'borrow-computed' && maxBorrowAmount) {
      const numOrZero = Number(maxBorrowAmount) ? Number(maxBorrowAmount).toFixed(6) : '0'
      setValue(numOrZero)
    }
  }, [mode, maxBorrowAmount, placeholderValue])

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
      height={'max-content'}
      minHeight={'7rem'}
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
      <Flex row alignItems="center" justifyContent="flex-start" width="100%" gap="$spacing6">
        <Flex flexDirection="row" alignItems="center" gap="$spacing8" width="max-content">
          {!firstPredefined && !selectedToken ? (
            <Text>---</Text>
          ) : (
            <>
              <TokenLogo size={28} url={firstPredefined?.logoUrl} />
              <Text variant="buttonLabel2" color="$neutral1">
                {firstPredefined?.symbol}
              </Text>
            </>
          )}
        </Flex>
        <Flex width={'max-content'} justifyContent="center" alignItems="center">
          <Text>{' / '}</Text>
        </Flex>
        <Flex width={'max-content'} justifyContent="center" alignItems="center">
          {!firstPredefined && '---'}
          {firstPredefined && (
            <Button
              backgroundColor={!firstPredefined ? '$surface2Hovered' : !selectedToken ? '$accent1' : '$surface1'}
              borderRadius="$rounded20"
              borderColor={!firstPredefined ? '$surface1Hovered' : !selectedToken ? '$accent1' : '$surface3'}
              borderWidth="$spacing1"
              px="$spacing4"
              py="$spacing16"
              pressStyle={{
                backgroundColor: 'rgb(192, 92, 152)',
              }}
              hoverStyle={{
                backgroundColor: 'rgb(192, 92, 152)',
              }}
              animation="quick"
              size="medium"
              isDisabled={disabled || !firstPredefined}
              onPress={onOpenTokenSelector}
              width={'max-content'}
            >
              {!selectedToken ? (
                <Text variant="buttonLabel3" color="$neutral1">
                  Select token
                </Text>
              ) : (
                <Flex flexDirection="row" alignItems="center" gap="$spacing8">
                  <TokenLogo size={28} url={selectedToken?.logoUrl} />
                  <Text variant="buttonLabel2" color="$neutral1">
                    {selectedToken?.currency.symbol}
                  </Text>
                </Flex>
              )}
              {!disabled && <RotatableChevron color="$neutral1" direction="down" height="$spacing16" scale={1.5} />}
            </Button>
          )}
        </Flex>
      </Flex>
    </Flex>
  )
}
