import { ChainSelector } from 'components/NavBar/ChainSelector'
import { CompanyMenu } from 'components/NavBar/CompanyMenu'
import { NewUserCTAButton } from 'components/NavBar/DownloadApp/NewUserCTAButton'
import { Navigation } from 'components/NavBar/Navigation'
import { useTabsVisible } from 'components/NavBar/ScreenSizes'
import TestnetModeTooltip from 'components/NavBar/TestnetMode/TestnetModeTooltip'
import { useIsAccountCTAExperimentControl } from 'components/NavBar/accountCTAsExperimentUtils'
import Web3Status from 'components/Web3Status'
import Row from 'components/deprecated/Row'
import { useAccount } from 'hooks/useAccount'
import { PageType, useIsPage } from 'hooks/useIsPage'
import deprecatedStyled, { css } from 'lib/styled-components'
import { useProfilePageState } from 'nft/hooks'
import { Flex, Nav as TamaguiNav, styled, useMedia } from 'ui/src'
import { INTERFACE_NAV_HEIGHT, breakpoints, zIndexes } from 'ui/src/theme'
import { useEnabledChains } from 'uniswap/src/features/chains/hooks/useEnabledChains'
import { FeatureFlags } from 'uniswap/src/features/gating/flags'
import { useFeatureFlag } from 'uniswap/src/features/gating/hooks'
import { APP_TABS, LendingStateProvider } from 'pages/Unicorn/contexts/LendingContext'
import { useLendingContext } from 'pages/Unicorn/contexts/LendingContext'
import { SegmentedControl, SegmentedControlOption, Text } from 'ui/src'
import { useLocation, useNavigate } from 'react-router-dom'
import { MultichainContextProvider } from 'state/multichain/MultichainContext'
import { PrefetchBalancesWrapper } from 'graphql/data/apollo/AdaptiveTokenBalancesProvider'
import { SwapFormContextProvider } from 'uniswap/src/features/transactions/swap/contexts/SwapFormContext'
import { TransactionSettingsContextProvider } from 'uniswap/src/features/transactions/settings/contexts/TransactionSettingsContext'
import { TransactionSettingKey } from 'uniswap/src/features/transactions/settings/slice'

// Flex is position relative by default, we must unset the position on every Flex
// between the body and search component
const UnpositionedFlex = styled(Flex, {
  position: 'unset',
})
const Nav = styled(TamaguiNav, {
  position: 'unset',
  px: '$padding12',
  width: '100%',
  height: INTERFACE_NAV_HEIGHT,
  zIndex: zIndexes.sticky,
  justifyContent: 'center',
})
const NavItems = css`
  gap: 12px;
  @media screen and (max-width: ${breakpoints.md}px) {
    gap: 4px;
  }
`
const Left = deprecatedStyled(Row)`
  display: flex;
  align-items: center;
  wrap: nowrap;
  ${NavItems}
`

const Center = deprecatedStyled(Row)`
  justify-content: center;
  ${NavItems}
`
const Right = deprecatedStyled(Row)`
  justify-content: flex-end;
  ${NavItems}
`
const SearchContainer = styled(UnpositionedFlex, {
  width: 'max-content',
  flex: 1,
  flexShrink: 1,
  flexDirection: 'row',
  justifyContent: 'center',
  alignSelf: 'center',
  alignItems: 'flex-start',
  height: 42,
})

function useShouldHideChainSelector() {
  const isNFTPage = useIsPage(PageType.NFTS)
  const isLandingPage = useIsPage(PageType.LANDING)
  const isSendPage = useIsPage(PageType.SEND)
  const isSwapPage = useIsPage(PageType.SWAP)
  const isLimitPage = useIsPage(PageType.LIMIT)
  const isExplorePage = useIsPage(PageType.EXPLORE)
  const isPositionsPage = useIsPage(PageType.POSITIONS)
  const isMigrateV3Page = useIsPage(PageType.MIGRATE_V3)
  const isBuyPage = useIsPage(PageType.BUY)

  const baseHiddenPages = isNFTPage
  const multichainHiddenPages =
    isLandingPage ||
    isSendPage ||
    isSwapPage ||
    isLimitPage ||
    baseHiddenPages ||
    isExplorePage ||
    isPositionsPage ||
    isMigrateV3Page ||
    isBuyPage

  return multichainHiddenPages
}

export default function Navbar() {
  const isNFTPage = useIsPage(PageType.NFTS)
  const isLandingPage = useIsPage(PageType.LANDING)

  const sellPageState = useProfilePageState((state) => state.state)
  const media = useMedia()
  const isSmallScreen = media.md
  const isMediumScreen = media.lg
  const areTabsVisible = useTabsVisible()
  const collapseSearchBar = media.xl
  const account = useAccount()
  const NAV_SEARCH_MAX_HEIGHT = 'calc(100vh - 30px)'

  const hideChainSelector = useShouldHideChainSelector()

  const { isTestnetModeEnabled } = useEnabledChains()
  const isEmbeddedWalletEnabled = useFeatureFlag(FeatureFlags.EmbeddedWallet)

  const { isControl, isLoading: isSignInExperimentControlLoading } = useIsAccountCTAExperimentControl()

  const isSignInExperimentControl = !isEmbeddedWalletEnabled && isControl

  const { selectedAppTab, handleResetStates, selectAppTab } = useLendingContext()

  const navigate = useNavigate()

  const tabCounts: Record<string, number> = {
    [APP_TABS.MY_LENDING]: 6,
    [APP_TABS.MY_BORROWING]: 11,
  }

  const handleOnChangeTab = (option: APP_TABS) => {
    // reset state
    handleResetStates('full')

    // select tab
    selectAppTab(option)
    navigate(`/${option.toLowerCase()}`, { replace: true })
  }

  const tabs: SegmentedControlOption[] = Object.values(APP_TABS).map((tab) => ({
    display: (
      <Flex position="relative" alignItems="center" justifyContent="center">
        <Text
          variant="buttonLabel3"
          hoverStyle={{ color: '$neutral1' }}
          color={selectedAppTab === tab ? '$neutral1' : '$neutral2'}
          tag="h1"
        >
          {tab.includes('-')
            ? tab
                .split('-')
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                .join(' ')
            : tab.charAt(0).toUpperCase() + tab.slice(1).toLowerCase().replace('_', ' ')}
        </Text>
        {typeof tabCounts[tab] === 'number' && tabCounts[tab] > 0 && (
          <Flex
            position="absolute"
            top={-12}
            right={-13}
            minWidth={18}
            height={18}
            px={2}
            backgroundColor="$neutral3"
            borderRadius={9}
            alignItems="center"
            justifyContent="center"
            zIndex={1}
          >
            <Text color="white" fontSize={12} fontWeight={400} userSelect="none" lineHeight={1}>
              {`${tabCounts[tab]}`}
            </Text>
          </Flex>
        )}
      </Flex>
    ),
    value: tab.toLowerCase(),
  }))

  return (

    <Nav>
      <UnpositionedFlex row centered width="100%">
        <Left>
          <CompanyMenu />
        </Left>
        <Center>
        <SegmentedControl
          options={tabs}
          disabled={false}
          selectedOption={selectedAppTab}
          onSelectOption={(option) => handleOnChangeTab(option as APP_TABS)}
          outlined={false}
          size={media.sm ? 'small' : 'large'}
        />
        </Center>
        <Right>
          {!hideChainSelector && <ChainSelector />}
          {isTestnetModeEnabled && <TestnetModeTooltip />}
          <Web3Status />
          {!isSignInExperimentControl && !isSignInExperimentControlLoading && !account.address && !isMediumScreen && (
            <NewUserCTAButton />
          )}
        </Right>
      </UnpositionedFlex>
    </Nav>
  )
}
