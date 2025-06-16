import { formatUnits } from '@ethersproject/units'
import { PoolPosition, Position, PositionStatus, ProtocolVersion, Token } from '@uniswap/client-pools/dist/pools/v1/types_pb'
import { memo, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Skeleton, Flex, AnimateTransition, Loader, Text } from 'ui/src'
import { fonts } from 'ui/src/theme'
import { BaseCard } from 'uniswap/src/components/BaseCard/BaseCard'
import {
  TokenOptionSection,
  TokenSectionsHookProps,
} from 'uniswap/src/components/TokenSelector/types'
import { SectionHeader } from 'uniswap/src/components/lists/TokenSectionHeader'
import { useGetPositionsQuery } from 'uniswap/src/data/rest/getPositions'
import { ITEM_SECTION_HEADER_ROW_HEIGHT } from '../constants'
import { GqlResult } from 'uniswap/src/data/types'
import { useAssetPrice } from '../../../../../../apps/web/src/pages/Unicorn/queries/useAssetPrice'
import { mockPositions } from '../../../../../../apps/web/src/pages/Unicorn/mocks/mockPosition'
import { TokenLogo } from '../../CurrencyLogo/TokenLogo'
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

  const positions = data?.positions ?? []

  const loading = isLoading
  const error = positionsError;

  return useMemo(
    () => ({
      data: positions,
      loading,
      error: error || undefined,
      refetch: () => {
        refetchPositions?.()
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

export const chainName = (chainId: number): string => {
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

export const formatNumberWithSuffix = (num: number): string => {
  const suffixes = ['', 'k', 'M', 'B', 'T']
  const tier = Math.floor(Math.log10(Math.abs(num)) / 3)

  if (tier === 0) return num.toString()

  const suffix = suffixes[tier]
  const scale = Math.pow(10, tier * 3)
  const scaled = num / scale

  // Handle decimals - show up to 2 decimal places if needed
  return scaled.toFixed(scaled % 1 === 0 ? 0 : 2) + suffix
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
      borderRadius="$rounded16"
      borderWidth={1}
      borderColor="$neutral3"
      p="$spacing24"
      mb="$spacing8"
      gap="$spacing8"
      flexDirection="column"
      pressStyle={{
        backgroundColor: 'rgb(35, 33, 34)',
        cursor: 'pointer'
      }}
      hoverStyle={{
        backgroundColor: 'rgb(35, 33, 34)',
        cursor: 'pointer'
      }}
      animation="quick"
      onPress={handleOnSelect}
    >
      <Flex flexDirection="column" justifyContent="space-between" alignContent='stretch' height={"max-content"}>
        <Flex row gap="$spacing8" alignItems="center">
          <Flex row gap="$spacing4" alignItems="center">
            <TokenLogo 
              size={32} 
              url={'https://token-repository.dappradar.com/tokens?protocol=ethereum&contract=0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2&file=logo.png'} 
              />
            <Text fontSize={16} color="$neutral1">{v3Position.token0?.symbol}</Text>
          </Flex>
          <Text fontSize={16} color="$neutral1">/</Text>
          <Flex row gap="$spacing4" alignItems="center">
            <TokenLogo 
              size={32} 
              url={'https://imgs.search.brave.com/qVfnM06301I6nmM20XJwh7E1dtjKpAU1IA0dllgkXNo/rs:fit:40:40:1:0/g:ce/aHR0cHM6Ly9jb2lu/LWltYWdlcy5jb2lu/Z2Vja28uY29tL2Nv/aW5zL2ltYWdlcy82/MzE5L2xhcmdlL3Vz/ZGMucG5nPzE2OTY1/MDY2OTQ'} 
            />
            <Text fontSize={16} color="$neutral1">{v3Position.token1?.symbol}</Text>
          </Flex>
        </Flex>
      </Flex>
      <Flex row justifyContent="space-between" alignItems="center">
        <Flex flexDirection="row" alignItems="baseline" gap="$spacing8">
          <Text variant="body3" color="$neutral2">
            Value
          </Text>
          <Text variant="body2" color="$neutral1">
            ${totalUsdValue.toFixed(2).toLocaleString()}
          </Text>
        </Flex>
        <Flex flexDirection="row" alignItems="baseline" gap="$spacing8">
          <Text variant="body3" color="$neutral2">
            Fee Tier
          </Text>
          <Text variant="body2" color="$neutral1">
            {Number(v3Position.feeTier) / 10_000}%
          </Text>
        </Flex>
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
          { (!positions || positions.length === 0) && (
            <Flex
              backgroundColor="$surface2"
              borderRadius="$rounded16"
              borderWidth={1}
              borderColor="$surface3"
              p="$spacing16"
              mb="$spacing8"
              gap="$spacing8"
              flexDirection="column"
            >
              <Text variant="subheading2" color="$neutral2">
                You don't have any Uniswap V3 Positions yet, or we couldn't find any.
              </Text>
            </Flex>
          )}
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
  )
}

export const TokenSelectorPoolsList = memo(_TokenSelectorPoolsList)
