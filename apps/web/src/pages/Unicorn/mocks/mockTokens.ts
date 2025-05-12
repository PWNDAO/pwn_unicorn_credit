import { TokenOption } from '../../../../../../packages/uniswap/src/components/lists/types'
import { TokenSection } from '../../../../../../packages/uniswap/src/components/TokenSelector/types'

export const mockTokensBalances = [
  {
    data: [
      {
        balanceUSD: 1523.85423,
        cacheId:
          'TokenBalance:VG9rZW5CYWxhbmNlOjB4YTdGRjMyZmI3MjRFMEQ0NkIyYTE0ODk2QzRiYjUxM0VmMmRiMjJiMV9WRzlyWlc0NlFrRlRSVjl1ZFd4c19VU0Q=',
        currencyInfo: {
          currency: {
            address: '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913',
            buyFeeBps: undefined,
            chainId: 8453,
            decimals: 6,
            isNative: false,
            isToken: true,
            name: 'USDC Coin',
            sellFeeBps: undefined,
            symbol: 'USDC',
          },
          currencyId: '8453-0x833589fcd6edb6e08f4c7c32d4f71b54bda02913',
          isSpam: false,
          logoUrl: 'https://coin-images.coingecko.com/coins/images/6319/large/usdc.png?1696506694',
          safetyInfo: {
            attackType: undefined,
            blockaidFees: {
              buyFeePercent: undefined,
              sellFeePercent: undefined,
            },
            potectionResult: 'BENIGN',
            tokenList: 'default',
          },
          spamCode: 0,
        },
        isHidden: false,
        quantity: 1522.958,
        relativeChange24: 0.1888848248,
      },
      {
        balanceUSD: 3242.2342,
        cacheId:
          'TokenBalance:VG9rZW5CYWxhbmNlOjB4YTdGRjMyZmI3MjRFMEQ0NkIyYTE0ODk2QzRiYjUxM0VmMmRiMjJiMV9WRzlyWlc0NlFrRlRSVjl1ZFd4c19V1f=',
        currencyInfo: {
          currency: {
            address: '0x4200000000000000000000000000000000000006',
            buyFeeBps: undefined,
            chainId: 8453,
            decimals: 18,
            isNative: false,
            isToken: true,
            name: 'Wrapped Ether',
            sellFeeBps: undefined,
            symbol: 'WETH',
          },
          currencyId: '8453-0x4200000000000000000000000000000000000006',
          isSpam: false,
          logoUrl: 'https://assets.coingecko.com/coins/images/2518/standard/weth.png?1696503332',
          safetyInfo: {
            attackType: undefined,
            blockaidFees: {
              buyFeePercent: undefined,
              sellFeePercent: undefined,
            },
            potectionResult: 'BENIGN',
            tokenList: 'default',
          },
          spamCode: 0,
        },
        isHidden: false,
        quantity: 0.57,
        relativeChange24: 10.213,
      },
    ],
    endElement: undefined,
    name: undefined,
    rightElement: undefined,
    sectionKey: 'yourTokens',
  } as unknown as TokenSection<TokenOption>,
]
