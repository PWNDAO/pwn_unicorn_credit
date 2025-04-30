import { ComponentProps, memo, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Flex, Text, TouchableArea, getContrastPassingTextColor, getHoverCssFilter, isWeb, useIsDarkMode } from 'ui/src'
import { RotatableChevron } from 'ui/src/components/icons/RotatableChevron'
import { iconSizes, spacing, validColor } from 'ui/src/theme'
import { CurrencyLogo } from 'uniswap/src/components/CurrencyLogo/CurrencyLogo'
import { CurrencyInfo } from 'uniswap/src/features/dataApi/types'
import { TestIDType } from 'uniswap/src/test/fixtures/testIDs'
import { getSymbolDisplayText } from 'uniswap/src/utils/currency'
import { isInterface, isMobileWeb } from 'utilities/src/platform'
import { PoolData } from '../TokenSelector/lists/TokenSelectorPoolsList'

interface SelectTokenButtonProps {
  onPress?: () => void
  selectedCurrencyInfo?: CurrencyInfo | PoolData | null
  testID?: TestIDType
  tokenColor?: string
}

export const SelectTokenButton = memo(function _SelectTokenButton({
  selectedCurrencyInfo,
  onPress,
  testID,
  tokenColor,
}: SelectTokenButtonProps): JSX.Element {
  const { t } = useTranslation()
  const isDarkMode = useIsDarkMode()
  const validTokenColor = validColor(tokenColor)
  const hoverStyle: { backgroundColor: ComponentProps<typeof Flex>['backgroundColor'] } = useMemo(
    () => ({
      backgroundColor: selectedCurrencyInfo ? '$surface1Hovered' : validTokenColor ?? '$accent1Hovered',
      filter: validTokenColor ? getHoverCssFilter({ isDarkMode }) : undefined,
    }),
    [selectedCurrencyInfo, validTokenColor, isDarkMode],
  )

  const isCompact = !isInterface || isMobileWeb
  const isNotPool = !(selectedCurrencyInfo && typeof selectedCurrencyInfo === 'object' && 'poolId' in selectedCurrencyInfo)

  if (!onPress && selectedCurrencyInfo) {
    return (
      <Flex centered row gap="$spacing4" p="$spacing4" pr={isWeb ? undefined : '$spacing12'}>
        <CurrencyLogo currencyInfo={isNotPool ? selectedCurrencyInfo : null} size={iconSizes.icon28} />
        <Text color="$neutral1" pl="$spacing4" testID={`${testID}-label`} variant="buttonLabel1">
          {isNotPool ? getSymbolDisplayText(selectedCurrencyInfo.currency.symbol) : `${selectedCurrencyInfo.tokens.token0.symbol}/${selectedCurrencyInfo.tokens.token1.symbol}`}
        </Text>
      </Flex>
    )
  }

  const textColor = selectedCurrencyInfo
    ? '$neutral1'
    : tokenColor
      ? getContrastPassingTextColor(tokenColor) ?? '$white'
      : '$white'
  const chevronColor = selectedCurrencyInfo ? '$neutral2' : textColor

  return (
    <TouchableArea
      backgroundColor={selectedCurrencyInfo ? '$surface1' : validTokenColor ?? '$accent1'}
      borderRadius="$roundedFull"
      testID={testID}
      borderColor="$surface3Solid"
      borderWidth="$spacing1"
      shadowColor="$surface3"
      shadowRadius={10}
      shadowOpacity={0.04}
      scaleTo={0.98}
      hoverable={!!selectedCurrencyInfo}
      hoverStyle={hoverStyle}
      onPress={onPress}
    >
      <Flex centered row gap="$spacing6" px="$spacing12" height="$spacing36">
        {selectedCurrencyInfo && (
          <Flex ml={-spacing.spacing8}>
            <CurrencyLogo currencyInfo={isNotPool ? selectedCurrencyInfo : null} size={iconSizes.icon28} />
          </Flex>
        )}
        <Text color={textColor} testID={`${testID}-label`} variant="buttonLabel2">
          {selectedCurrencyInfo
            ? isNotPool ? getSymbolDisplayText(selectedCurrencyInfo.currency.symbol) : `${selectedCurrencyInfo.tokens.token0.symbol}/${selectedCurrencyInfo.tokens.token1.symbol}`
            : t('tokens.selector.button.choose')}
        </Text>
        {!isCompact && (
          <RotatableChevron color={chevronColor} direction="down" height="$spacing24" mx={-spacing.spacing2} />
        )}
      </Flex>
    </TouchableArea>
  )
})
