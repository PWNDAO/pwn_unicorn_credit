import React, { useCallback, useMemo, useState } from 'react'
import { Button, Flex, Text, TouchableArea, useSporeColors } from 'ui/src'
import Check from 'ui/src/assets/icons/check.svg'
import { iconSizes } from 'ui/src/theme'
import { TokenLogo } from 'uniswap/src/components/CurrencyLogo/TokenLogo'
import { TokenOptionItemWrapper } from 'uniswap/src/components/TokenSelector/items/TokenOptionItemWrapper'
import { TokenOption } from 'uniswap/src/components/lists/types'
import { WarningSeverity } from 'uniswap/src/components/modals/WarningModal/types'
import WarningIcon from 'uniswap/src/components/warnings/WarningIcon'
import { getWarningIconColors } from 'uniswap/src/components/warnings/utils'
import { NATIVE_TOKEN_PLACEHOLDER } from 'uniswap/src/constants/addresses'
import TokenWarningModal from 'uniswap/src/features/tokens/TokenWarningModal'
import { getTokenWarningSeverity } from 'uniswap/src/features/tokens/safetyUtils'
import { getSymbolDisplayText } from 'uniswap/src/utils/currency'
import { shortenAddress } from 'utilities/src/addresses'
import { dismissNativeKeyboard } from 'utilities/src/device/keyboard'
import { isInterface } from 'utilities/src/platform'

export type Hook = {
  address: string
  protocol: "Aave_v3" | "Morpho" | "Euler" | "Compound_v3"
  chainId: number
  apr: number
  underlyingAddress: string
}

const getProtocolName = (protocol: "Aave_v3" | "Morpho" | "Euler" | "Compound_v3") => {
  switch (protocol) {
    case "Aave_v3":
      return "Aave v3"
    case "Morpho":
      return "Morpho"
    case "Euler":
      return "Euler"
    case "Compound_v3":
      return "Compound v3"
    default:
      return protocol
  }
}

const formatApr = (apr: number) => {
  return Number(apr / 1000).toFixed(2)
}

interface OptionProps {
  option: TokenOption
  showWarnings: boolean
  onPress: () => void
  showTokenAddress?: boolean
  tokenWarningDismissed: boolean
  quantity: number | null
  // TODO(WEB-4731): Remove isKeyboardOpen dependency
  isKeyboardOpen?: boolean
  // TODO(WEB-3643): Share localization context with WEB
  // (balance, quantityFormatted)
  balance: string
  quantityFormatted?: string
  isSelected?: boolean
  hooks?: Hook[]
}

function _TokenOptionItem({
  option,
  showWarnings,
  onPress,
  showTokenAddress,
  tokenWarningDismissed,
  balance,
  quantity,
  quantityFormatted,
  isKeyboardOpen,
  isSelected,
  hooks,
}: OptionProps): JSX.Element {
  const { currencyInfo, isUnsupported } = option
  const { currency } = currencyInfo
  const [showWarningModal, setShowWarningModal] = useState(false)
  const colors = useSporeColors()

  const [showPoolHooks, setShowPoolHooks] = useState(false)

  const severity = getTokenWarningSeverity(currencyInfo)
  const isBlocked = severity === WarningSeverity.Blocked
  // in token selector, we only show the warning icon if token is >=Medium severity
  const { colorSecondary: warningIconColor } = getWarningIconColors(severity)
  const shouldShowWarningModalOnPress = isBlocked || (severity !== WarningSeverity.None && !tokenWarningDismissed)

  const handleShowWarningModal = useCallback((): void => {
    dismissNativeKeyboard()
    setShowWarningModal(true)
  }, [setShowWarningModal])

  const onPressTokenOption = useCallback(() => {
    if (showWarnings && shouldShowWarningModalOnPress) {
      // On mobile web we need to wait for the keyboard to hide
      // before showing the modal to avoid height issues
      if (isKeyboardOpen && isInterface) {
        const activeElement = document.activeElement as HTMLElement | null
        activeElement?.blur()
        setTimeout(handleShowWarningModal, 700)
      } else {
        handleShowWarningModal()
      }
      return
    }

    onPress()
  }, [showWarnings, shouldShowWarningModalOnPress, onPress, isKeyboardOpen, handleShowWarningModal])

  const onAcceptTokenWarning = useCallback(() => {
    setShowWarningModal(false)
    onPress()
  }, [onPress])

  const hooksForThisToken = useMemo(
    () => hooks?.filter(v => v.underlyingAddress?.toLowerCase() === (currency as any).address?.toLowerCase()),
    [hooks, currency]
  )

  return (
    <TokenOptionItemWrapper
      tokenInfo={{
        address: currency.isNative ? NATIVE_TOKEN_PLACEHOLDER : currency.address,
        chain: currency.chainId,
        isNative: currency.isNative,
      }}
    >
      <TouchableArea
        animation="300ms"
        hoverStyle={{ backgroundColor: '$surface1Hovered' }}
        opacity={(showWarnings && severity === WarningSeverity.Blocked) || isUnsupported ? 0.5 : 1}
        width="100%"
        onPress={onPressTokenOption}
      >
        <Flex
          row
          alignItems="center"
          gap="$spacing8"
          justifyContent="space-between"
          px="$spacing16"
          py="$spacing12"
          style={{
            pointerEvents: 'auto',
          }}
          testID={`token-option-${currency.chainId}-${currency.symbol}`}
        >
          <Flex row shrink alignItems="center" gap="$spacing12">
            <TokenLogo
              chainId={currency.chainId}
              name={currency.name}
              symbol={currency.symbol}
              url={currencyInfo.logoUrl ?? undefined}
            />
            <Flex shrink>
              <Flex row alignItems="center" gap="$spacing8">
                <Text color="$neutral1" numberOfLines={1} variant="body1">
                  {currency.name}
                </Text>
                {warningIconColor && (
                  <Flex>
                    <WarningIcon severity={severity} size="$icon.16" strokeColorOverride={warningIconColor} />
                  </Flex>
                )}
              </Flex>
              <Flex row alignItems="center" gap="$spacing8">
                <Text color="$neutral2" numberOfLines={1} variant="body3">
                  {getSymbolDisplayText(currency.symbol)}
                </Text>
                {!currency.isNative && showTokenAddress && (
                  <Flex shrink>
                    <Text color="$neutral3" numberOfLines={1} variant="body3">
                      {shortenAddress(currency.address)}
                    </Text>
                  </Flex>
                )}
              </Flex>
            </Flex>
          </Flex>

          {isSelected && (
            <Flex grow alignItems="flex-end" justifyContent="center">
              <Check color={colors.accent1.get()} height={iconSizes.icon20} width={iconSizes.icon20} />
            </Flex>
          )}

          {!isSelected && quantity && quantity !== 0 ? (
            <Flex alignItems="flex-end">
              <Text variant="body1">{balance}</Text>
              {quantityFormatted && (
                <Text color="$neutral2" variant="body3">
                  {quantityFormatted}
                </Text>
              )}
            </Flex>
          ) : null}
        </Flex>
      </TouchableArea>
      {
        hooksForThisToken && hooksForThisToken.length > 0 && (
          <Flex width="100%" justifyContent="center" alignItems="center" position='relative'>
            <Text color="$accent1" fontSize={14} onPress={() => setShowPoolHooks(!showPoolHooks)} pressStyle={{ color: 'white' }} hoverStyle={{ color: 'white', cursor: 'pointer' }}>pool hooks {"(+4)"}</Text>
            {showPoolHooks && (
              <Flex 
                flexDirection="column" 
                gap="$spacing8" 
                zIndex={1000} 
                position='absolute' 
                top={35} 
                left={0} 
                right={0} 
                bottom={0} 
                justifyContent='center' 
                alignItems='center' 
                backgroundColor='$surface1'
                width='100%'
                height={35*hooksForThisToken.length}
                borderRadius={10}
                borderWidth={1}
                borderColor='$surface3'
              >
                {hooksForThisToken && hooksForThisToken.length > 0 && hooksForThisToken.map((hook) => (
                  <Flex 
                    key={hook.address} 
                    row 
                    alignItems='center' 
                    justifyContent='space-between'
                    width='100%'
                    px="$spacing16"
                    gap="$spacing8" 
                    borderBottomWidth={1} 
                    borderBottomColor='transparent' 
                    hoverStyle={{ cursor: 'pointer', backgroundColor: '$surface2' }}
                    onPress={onPressTokenOption}
                    >
                    <Text fontSize={14} color="$neutral1">{getProtocolName(hook.protocol)}</Text>
                    <Text fontSize={14} color="$neutral2">{shortenAddress(hook.address, 3, 3)}</Text>
                    <Text fontSize={14} color="$neutral1">{formatApr(hook.apr)}%</Text>
                    <Text fontSize={14} color="$neutral1">{(Math.random() * 10000).toFixed(2)}</Text>
                  </Flex>
                ))}
              </Flex>
            )}
          </Flex>
        )
      }

      <TokenWarningModal
        currencyInfo0={currencyInfo}
        isVisible={showWarningModal}
        closeModalOnly={(): void => setShowWarningModal(false)}
        onAcknowledge={onAcceptTokenWarning}
      />
    </TokenOptionItemWrapper>
  )
}

export const TokenOptionItem = React.memo(_TokenOptionItem)
