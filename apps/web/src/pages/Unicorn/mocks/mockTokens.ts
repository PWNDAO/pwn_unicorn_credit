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
            address: '0x94a9D9AC8a22534E3FaCa9F4e7F2E2cf85d5E4C8',
            buyFeeBps: undefined,
            chainId: 11155111,
            decimals: 6,
            isNative: false,
            isToken: true,
            name: 'USDC Coin',
            sellFeeBps: undefined,
            symbol: 'USDC',
          },
          currencyId: '11155111-0x94a9D9AC8a22534E3FaCa9F4e7F2E2cf85d5E4C8',
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
            address: '0x7b79995e5f793A07Bc00c21412e50Ecae098E7f9',
            buyFeeBps: undefined,
            chainId: 11155111,
            decimals: 18,
            isNative: false,
            isToken: true,
            name: 'Wrapped Ether',
            sellFeeBps: undefined,
            symbol: 'WETH',
          },
          currencyId: '11155111-0x7b79995e5f793A07Bc00c21412e50Ecae098E7f9',
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
