import { Position } from '@uniswap/client-pools/dist/pools/v1/types_pb'

export const mockPositions = [
  {
    chainId: 8453,
    isHidden: false,
    position: {
      case: 'v3Position',
      value: {
        amount0: '2941700000000000000',
        amount1: '5000000000',
        apr: 15.57237732772,
        currentLiquidity: '1447237928415389201',
        currentPrice: '3324339109016524278071714',
        currentTick: '-201587',
        feeTier: '500',
        isDynamicFee: false,
        liquidity: '23586044991',
        owner: '',
        poolId: '0xd0b53D9277642d899DF5C87A3966A349A798F224',
        tickLower: '-887270',
        tickSpacing: '10',
        tickUpper: '887270',
        token0: {
          address: '0x4200000000000000000000000000000000000006',
          chainId: 8453,
          decimals: 18,
          name: 'Wrapped Ether',
          symbol: 'WETH',
          isNative: false,
        },
        token0UncollectedFees: '388683507184',
        token1: {
          address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
          chainId: 8453,
          decimals: 6,
          name: 'USDC',
          symbol: 'USDC',
          isNative: false,
        },
        token1UncollectedFees: '698',
        tokenId: '2939470',
        totalLiquidityUsd: '12496710.7086676253967284840401756',
      },
    },
    protocolVersion: 2,
    status: 1,
    timestamp: 1746538992293,
  },
  {
    chainId: 8453,
    isHidden: false,
    position: {
      case: 'v3Position',
      value: {
        amount0: '5621204529186940000',
        amount1: '9896480000',
        apr: 15.57237732772,
        currentLiquidity: '1447237928415389201',
        currentPrice: '3324339109016524278071714',
        currentTick: '-201587',
        feeTier: '500',
        isDynamicFee: false,
        liquidity: '23586044991',
        owner: '',
        poolId: '0xd0b53D9277642d899DF5C87A3966A349A798F224',
        tickLower: '-887270',
        tickSpacing: '10',
        tickUpper: '887270',
        token0: {
          address: '0x4200000000000000000000000000000000000006',
          chainId: 8453,
          decimals: 18,
          name: 'Wrapped Ether',
          symbol: 'WETH',
          isNative: false,
        },
        token0UncollectedFees: '388683507184',
        token1: {
          address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
          chainId: 8453,
          decimals: 6,
          name: 'USDC',
          symbol: 'USDC',
          isNative: false,
        },
        token1UncollectedFees: '698',
        tokenId: '2958370',
        totalLiquidityUsd: '12496710.7086676253967284840401756',
      },
    },
    protocolVersion: 2,
    status: 1,
    timestamp: 1746538992293,
  },
] as unknown as Position[]
