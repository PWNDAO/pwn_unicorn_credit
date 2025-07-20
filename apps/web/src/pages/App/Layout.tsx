import styled from 'lib/styled-components'
import { Body } from 'pages/App/Body'
import { Header } from 'pages/App/Header'
import { GRID_AREAS } from 'pages/App/utils/shared'
import { LendingStateProvider } from 'pages/Unicorn/contexts/LendingContext'
import { breakpoints } from 'ui/src/theme'
import { TransactionSettingsContextProvider } from 'uniswap/src/features/transactions/settings/contexts/TransactionSettingsContext'
import { MultichainContextProvider } from 'state/multichain/MultichainContext'
import { PrefetchBalancesWrapper } from 'graphql/data/apollo/AdaptiveTokenBalancesProvider'
import { SwapFormContextProvider } from 'uniswap/src/features/transactions/swap/contexts/SwapFormContext'
import { TransactionSettingKey } from 'uniswap/src/features/transactions/settings/slice'

const AppContainer = styled.div`
  min-height: 100vh;
  max-width: 100vw;

  // grid container settings
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: auto auto 1fr;
  grid-template-areas: '${GRID_AREAS.HEADER}' '${GRID_AREAS.MAIN}' '${GRID_AREAS.MOBILE_BOTTOM_BAR}';
`
const AppBody = styled.div`
  grid-area: ${GRID_AREAS.MAIN};
  width: 100vw;
  min-height: 100%;
  max-width: ${({ theme }) => `${theme.maxWidth}px`};
  display: flex;
  flex-direction: column;
  position: relative;
  align-items: center;
  flex: 1;
  position: relative;
  margin: auto;

  @media screen and (max-width: ${breakpoints.md}px) {
    padding-left: 10px;
    padding-right: 10px;
  }
`

export function AppLayout() {
  return (
    <MultichainContextProvider initialChainId={1}>
    <TransactionSettingsContextProvider settingKey={TransactionSettingKey.Swap}>
      <PrefetchBalancesWrapper>
        <SwapFormContextProvider prefilledState={{} as any} hideFooter hideSettings>
          <LendingStateProvider>
    <AppContainer>
      <Header />
      <AppBody>
        <Body />
      </AppBody>
    </AppContainer>

    </LendingStateProvider>
            </SwapFormContextProvider>
          </PrefetchBalancesWrapper>
        </TransactionSettingsContextProvider>
      </MultichainContextProvider>
  )
}
