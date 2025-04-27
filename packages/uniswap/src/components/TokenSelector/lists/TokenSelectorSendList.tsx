import { formatUnits } from '@ethersproject/units'
import { PoolPosition, PositionStatus, ProtocolVersion } from '@uniswap/client-pools/dist/pools/v1/types_pb'
import { memo, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Flex } from 'ui/src'
import { BaseCard } from 'uniswap/src/components/BaseCard/BaseCard'
import { TokenSelectorList } from 'uniswap/src/components/TokenSelector/TokenSelectorList'
import { usePortfolioTokenOptions } from 'uniswap/src/components/TokenSelector/hooks/usePortfolioTokenOptions'
import {
  OnSelectCurrency,
  TokenOptionSection,
  TokenSection,
  TokenSectionsHookProps,
} from 'uniswap/src/components/TokenSelector/types'
import { useTokenOptionsSection } from 'uniswap/src/components/TokenSelector/utils'
import { SectionHeader } from 'uniswap/src/components/lists/TokenSectionHeader'
import { TokenOption } from 'uniswap/src/components/lists/types'
import { useGetPositionsQuery } from 'uniswap/src/data/rest/getPositions'
import { GqlResult } from 'uniswap/src/data/types'

function useTokenSectionsForSend({
  activeAccountAddress,
  chainFilter,
}: TokenSectionsHookProps): GqlResult<TokenSection<TokenOption>[]> {
  const {
    data: portfolioTokenOptions,
    error: portfolioTokenOptionsError,
    refetch: refetchPortfolioTokenOptions,
    loading: portfolioTokenOptionsLoading,
  } = usePortfolioTokenOptions(activeAccountAddress, chainFilter)

  const { data, isLoading, error: positionsError, refetch: refetchPositions } = useGetPositionsQuery({
    address: activeAccountAddress,
    chainIds: chainFilter ? [Number(chainFilter)] : undefined,
    positionStatuses: [PositionStatus.IN_RANGE, PositionStatus.OUT_OF_RANGE],
    protocolVersions: [ProtocolVersion.V2, ProtocolVersion.V3, ProtocolVersion.V4],
    includeHidden: true,
  })

  // TODO: this is an attempt to hack LPs into token selector
  const positions: TokenOption[] = (data?.positions ?? []).map((position): TokenOption => {
    const token = position.position.value as PoolPosition
    return {
      currencyInfo: {
        // Attempt to construct CurrencyInfo from the assumed 'token' object
        currency: {
          chainId: position.chainId,
          isNative: false,
          isToken: true,
          address: token?.token0?.address ?? '',
          decimals: token?.token0?.decimals ?? 0,
          equals: () => false,
          sortsBefore: () => false,
          wrapped: token?.token0 as any,
        },
        currencyId: `${position.chainId}-${token?.token0?.address}`,
        logoUrl: token?.token0?.logo ?? '',
        isSpam: false,
        spamCode: undefined,
        safetyInfo: undefined,
      },
      quantity: token?.amount0 ? parseFloat(formatUnits(token.amount0, token.token0?.decimals ?? 0)) : null,
      balanceUSD: 0,
      isUnsupported: false,
    }
  })

  const combinedOptions = useMemo(
    () => [...(portfolioTokenOptions ?? []), ...positions],
    [portfolioTokenOptions, positions],
  )

  const loading = portfolioTokenOptionsLoading || isLoading // Combine loading states
  // Combine errors: use the first error encountered, or undefined if none.
  const error = portfolioTokenOptionsError || positionsError;

  const sections = useTokenOptionsSection({
    sectionKey: TokenOptionSection.YourTokens,
    tokenOptions: combinedOptions, // Use the combined list
  })

  return useMemo(
    () => ({
      data: sections,
      loading,
      error: error || undefined,
      refetch: () => { // Combine refetch functions
        refetchPortfolioTokenOptions?.()
        refetchPositions?.() // Call positions refetch if it exists
      },
    }),
    [error, loading, refetchPortfolioTokenOptions, refetchPositions, sections],
  )
}

function EmptyList({ onEmptyActionPress }: { onEmptyActionPress?: () => void }): JSX.Element {
  const { t } = useTranslation()

  return (
    <Flex>
      <SectionHeader sectionKey={TokenOptionSection.YourTokens} />
      <Flex pt="$spacing16" px="$spacing16">
        <BaseCard.EmptyState
          buttonLabel={
            onEmptyActionPress ? t('tokens.selector.empty.buy.title') : t('tokens.selector.empty.receive.title')
          }
          description={t('tokens.selector.empty.buy.message')}
          title={t('tokens.selector.empty.title')}
          onPress={onEmptyActionPress}
        />
      </Flex>
    </Flex>
  )
}

function _TokenSelectorSendList({
  activeAccountAddress,
  chainFilter,
  isKeyboardOpen,
  onSelectCurrency,
  onEmptyActionPress,
}: TokenSectionsHookProps & {
  onSelectCurrency: OnSelectCurrency
  onEmptyActionPress: () => void
}): JSX.Element {
  const {
    data: sections,
    loading,
    error,
    refetch,
  } = useTokenSectionsForSend({
    activeAccountAddress,
    chainFilter,
  })
  const emptyElement = useMemo(() => <EmptyList onEmptyActionPress={onEmptyActionPress} />, [onEmptyActionPress])

  return (
    <TokenSelectorList
      showTokenAddress
      chainFilter={chainFilter}
      emptyElement={emptyElement}
      hasError={Boolean(error)}
      isKeyboardOpen={isKeyboardOpen}
      loading={loading}
      refetch={refetch}
      sections={sections}
      showTokenWarnings={false}
      onSelectCurrency={onSelectCurrency}
    />
  )
}

export const TokenSelectorSendList = memo(_TokenSelectorSendList)
