import { Hook } from 'uniswap/src/components/TokenSelector/items/TokenOptionItem'
import { mockTokensBalances } from '../../../../../../apps/web/src/pages/Unicorn/mocks/mockTokens'
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

  const loading = portfolioTokenOptionsLoading // Combine loading states
  // Combine errors: use the first error encountered, or undefined if none.
  const error = portfolioTokenOptionsError;

  const sections = useTokenOptionsSection({
    sectionKey: TokenOptionSection.YourTokens,
    tokenOptions: portfolioTokenOptions, // Use the combined list
  })

  return useMemo(
    () => ({
      data: sections,
      loading,
      error: error || undefined,
      refetch: () => { // Combine refetch functions
        refetchPortfolioTokenOptions?.()
      },
    }),
    [error, loading, refetchPortfolioTokenOptions, sections],
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
  predefinedAssets,
  hooks,
}: TokenSectionsHookProps & {
  onSelectCurrency: OnSelectCurrency
  onEmptyActionPress: () => void
  predefinedAssets?: TokenOption[] | TokenSection<TokenOption>[]
  hooks?: Hook[]
}): JSX.Element {
  // const {
    // data,
    // loading,
    // error,
    // refetch,
  // } = useTokenSectionsForSend({
  //   activeAccountAddress,
  //   chainFilter,
  // })
  function isTokenSection(data: unknown): data is TokenSection<TokenOption>[] {
    return Array.isArray(data) && 'sectionKey' in (data[0] ?? {}) && 'data' in (data[0] ?? {})
  }

  const sections = predefinedAssets 
    ? isTokenSection(predefinedAssets)
      ? predefinedAssets
      : [{
          sectionKey: TokenOptionSection.PredefinedAssets,
          data: predefinedAssets as TokenOption[]
        }]
    : mockTokensBalances
  const loading = false
  const error = false
  const refetch = () => {}
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
      hooks={hooks}
    />
  )
}

export const TokenSelectorSendList = memo(_TokenSelectorSendList)
