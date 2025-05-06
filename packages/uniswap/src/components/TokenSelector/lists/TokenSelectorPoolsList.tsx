import { formatUnits } from '@ethersproject/units'
import { PoolPosition, Position, PositionStatus, ProtocolVersion, Token } from '@uniswap/client-pools/dist/pools/v1/types_pb'
import { memo, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Skeleton, Flex, AnimateTransition, Loader, Text } from 'ui/src'
import { fonts } from 'ui/src/theme'
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
import { ITEM_SECTION_HEADER_ROW_HEIGHT } from '../constants'
import { GqlResult } from 'uniswap/src/data/types'
import { TokenSectionBaseList } from '../../lists/TokenSectionBaseList/TokenSectionBaseList'
import { useBottomSheetFocusHook } from '../../modals/hooks'
import { useAssetPrice } from '../../../../../../apps/web/src/pages/Unicorn/queries/useAssetPrice'
import { mockPositions } from '../../../../../../apps/web/src/pages/Unicorn/mocks/mockPosition'
export interface PoolOption {
  tokenId: string
  tickLower: string
  tickUpper: string
  liquidity: string
  token0: {
    chainId: number
    address: string
    symbol: string
    decimals: number
    name: string
    logo?: string
    isNative: boolean
  }
  token1: {
    chainId: number
    address: string
    symbol: string
    decimals: number
    name: string
    logo?: string
    isNative: boolean
  }
  feeTier: string
  currentTick: string
  currentPrice: string
  tickSpacing: string
  token0UncollectedFees: string
  token1UncollectedFees: string
  amount0: string
  amount1: string
  poolId: string
  isDynamicFee: boolean
  totalLiquidityUsd: string
  currentLiquidity: string
  apr: number
  owner: string
}

function useTokenSectionsForPools({
  activeAccountAddress,
  chainFilter,
}: TokenSectionsHookProps): GqlResult<Position[]> {
  const { data, isLoading, error: positionsError, refetch: refetchPositions } = useGetPositionsQuery({
    address: activeAccountAddress,
    chainIds: chainFilter ? [Number(chainFilter)] : undefined,
    positionStatuses: [PositionStatus.IN_RANGE, PositionStatus.OUT_OF_RANGE],
    protocolVersions: [ProtocolVersion.V2, ProtocolVersion.V3, ProtocolVersion.V4],
    includeHidden: true,
  })

  // TODO: this is an attempt to hack LPs into token selector
  // const positions: TokenOption[] = (data?.positions ?? []).map((position): TokenOption => {
  //   const token = position.position.value as PoolPosition
  //   return {
  //     currencyInfo: {
  //       // Attempt to construct CurrencyInfo from the assumed 'token' object
  //       currency: {
  //         chainId: position.chainId,
  //         isNative: false,
  //         isToken: true,
  //         address: token?.token0?.address ?? '',
  //         decimals: token?.token0?.decimals ?? 0,
  //         equals: () => false,
  //         sortsBefore: () => false,
  //         wrapped: token?.token0 as any,
  //       },
  //       currencyId: `${position.chainId}-${token?.token0?.address}`,
  //       logoUrl: token?.token0?.logo ?? '',
  //       isSpam: false,
  //       spamCode: undefined,
  //       safetyInfo: undefined,
  //     },
  //     quantity: token?.amount0 ? parseFloat(formatUnits(token.amount0, token.token0?.decimals ?? 0)) : null,
  //     balanceUSD: 0,
  //     isUnsupported: false,
  //   }
  // })

  const positions = data?.positions ?? []

  // const combinedOptions = useMemo(
  //   () => [...positions],
  //   [positions],
  // )

  const loading = isLoading // Combine loading states
  // Combine errors: use the first error encountered, or undefined if none.
  const error = positionsError;

  // const sections = useTokenOptionsSection({
  //   sectionKey: TokenOptionSection.YourTokens,
  //   tokenOptions: combinedOptions, // Use the combined list
  // })

  return useMemo(
    () => ({
      data: positions,
      loading,
      error: error || undefined,
      refetch: () => { // Combine refetch functions
        refetchPositions?.() // Call positions refetch if it exists
      },
    }),
    [error, loading, refetchPositions, positions],
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

enum Chain {
  ETHEREUM = 1,
  OPTIMISM = 10,
  ARBITRUM = 42161,
  BASE = 8453,
  POLYGON = 137,
}

const chainName = (chainId: number): string => {
  switch(chainId) {
    case Chain.ETHEREUM:
      return 'Ethereum'
    case Chain.OPTIMISM:
      return 'Optimism'
    case Chain.ARBITRUM:
      return 'Arbitrum'
    case Chain.BASE:
      return 'Base'
    case Chain.POLYGON:
      return 'Polygon'
    default:
      return 'Unknown'
  }
}

export interface ExtraCurrency {
  formattedAmount: string
  usdValue: number
}

export interface TokenCustom {
  chainId: number
  address: string 
  symbol: string
  decimals: number
  name: string
  logo?: string
  isNative: boolean
}

export interface PoolData {
  tokens: {
    token0: TokenCustom & ExtraCurrency
    token1: TokenCustom & ExtraCurrency
  }
  totalUsdValue: number
  poolId: number,
  feeTier: number,
}


const PoolOption = ({ position, onSelectCurrency }: { position: Position, onSelectCurrency: (poolData: PoolData) => void }): JSX.Element => {
  const v3Position = position?.position?.value as PoolPosition
  const formattedAmount0 = Number(formatUnits(v3Position.amount0, v3Position.token0?.decimals ?? 18)).toFixed(4)
  const formattedAmount1 = Number(formatUnits(v3Position.amount1, v3Position.token1?.decimals ?? 18)).toFixed(4)
  const { data: priceDataToken0 } = useAssetPrice(v3Position.token0?.chainId, v3Position.token0?.address)
  const { data: priceDataToken1 } = useAssetPrice(v3Position.token1?.chainId, v3Position.token1?.address)
  const usdValueToken0 = Number(formattedAmount0) * Number(priceDataToken0 ?? 0)
  const usdValueToken1 = Number(formattedAmount1) * Number(priceDataToken1 ?? 0)
  const totalUsdValue = usdValueToken0 + usdValueToken1

  const handleOnSelect = () => {
    if (!v3Position.token0 || !v3Position.token1) {
      return
    }
    const token0: TokenCustom & ExtraCurrency = {
      ...v3Position.token0,
      formattedAmount: formattedAmount0,
      usdValue: usdValueToken0,
    }
    const token1: TokenCustom & ExtraCurrency = {
      ...v3Position.token1,
      formattedAmount: formattedAmount1,
      usdValue: usdValueToken1,
    }
    onSelectCurrency({
      tokens: {
        token0,
        token1,
      },
      totalUsdValue,
      poolId: Number(v3Position.tokenId),
      feeTier: Number(v3Position.feeTier),
    })
  }

  return (
    <Flex
      backgroundColor="$surface2"
      borderRadius="$rounded16"
      borderWidth={1}
      borderColor="$surface3"
      p="$spacing16"
      mb="$spacing8"
      gap="$spacing8"
      flexDirection="column"
      hoverStyle={{
        backgroundColor: '$surface3',
        cursor: 'pointer'
      }}
      animation="quick"
      onPress={handleOnSelect}
    >
      <Flex row justifyContent="space-between" alignItems="center">
        <Text variant="subheading1" color="$neutral1">
          {v3Position.token0?.name ?? ''} / {v3Position.token1?.name ?? ''}
        </Text>
        <Text variant="body2" color="$neutral2">
          {Number(v3Position.feeTier) / 10_000}% Fee Tier
        </Text>
      </Flex>
      <Flex row justifyContent="space-between" alignItems="center">
        <Text variant="body2" color="$neutral2">
          Chain
        </Text>
        <Text variant="body2" color="$neutral1">
          {chainName(v3Position.token0?.chainId ?? 0)}
        </Text>
      </Flex>
      <Flex row justifyContent="space-between" alignItems="center">
        <Text variant="body2" color="$neutral2">
          Total LP Value
        </Text>
        <Text variant="body2" color="$neutral1">
          ${totalUsdValue.toFixed(2)}
        </Text>
      </Flex>
      <Flex row justifyContent="space-between" alignItems="center">
        <Text variant="body2" color="$neutral2">
          {v3Position.token0?.name} Amount
        </Text>
        <Text variant="body2" color="$neutral1">
          {formattedAmount0}
        </Text>
      </Flex>
      <Flex row justifyContent="space-between" alignItems="center">
        <Text variant="body2" color="$neutral2">
          {v3Position.token1?.name} Amount
        </Text>
        <Text variant="body2" color="$neutral1">
          {formattedAmount1}
        </Text>
      </Flex>
    </Flex>
  )
}

function PoolSelectorList({
  positions,
  loading,
  onSelectCurrency,
}: {
  positions: Position[]
  loading: boolean
  onSelectCurrency: (poolData: PoolData) => void
}): JSX.Element {
  const shortenAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }
  return (
    <Flex>
      <AnimateTransition animationType="fade" currentIndex={(!positions || !positions.length) && loading ? 0 : 1}>
        <Flex grow px="$spacing16">
          <Flex height={ITEM_SECTION_HEADER_ROW_HEIGHT} justifyContent="center" py="$spacing16" width={80}>
            <Skeleton>
              <Loader.Box height={fonts.subheading2.lineHeight} />
            </Skeleton>
          </Flex>
          <Loader.Token gap="$none" repeat={15} />
        </Flex>
        <Flex px="$spacing16">
          { positions
            .filter((position) => position?.position?.case === 'v3Position')
            .filter(v => Boolean(v.position.value))
            .map((position, index) => {
              return (
                <PoolOption key={index} position={position} onSelectCurrency={onSelectCurrency} />
              )
          })}
        </Flex>
      </AnimateTransition>
    </Flex>
  )
}

function _TokenSelectorPoolsList({
  activeAccountAddress,
  chainFilter,
  isKeyboardOpen,
  onSelectCurrency,
  onEmptyActionPress,
}: TokenSectionsHookProps & {
  onSelectCurrency: (poolData: PoolData) => void
  onEmptyActionPress: () => void
}): JSX.Element {
  // const {
  //   data: sections,
  //   loading,
  //   error,
  //   refetch,
  // } = useTokenSectionsForPools({
  //   activeAccountAddress,
  const sections = mockPositions;
  const emptyElement = useMemo(() => <EmptyList onEmptyActionPress={onEmptyActionPress} />, [onEmptyActionPress])

  const [loading, setLoading] = useState(true)
  useEffect(() => {
    setTimeout(() => { setLoading(false) }, 2000)
  }, [])

  return (
    <PoolSelectorList
      positions={sections ?? []}
      loading={loading}
      onSelectCurrency={onSelectCurrency}
    />
    // <TokenSelectorList
    //   showTokenAddress
    //   chainFilter={chainFilter}
    //   emptyElement={emptyElement}
    //   hasError={Boolean(error)}
    //   isKeyboardOpen={isKeyboardOpen}
    //   loading={loading}
    //   refetch={refetch}
    //   sections={sections}
    //   showTokenWarnings={false}
    //   onSelectCurrency={onSelectCurrency}
    // />
  )
}

export const TokenSelectorPoolsList = memo(_TokenSelectorPoolsList)
