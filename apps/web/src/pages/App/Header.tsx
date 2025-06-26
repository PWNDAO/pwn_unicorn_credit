import Navbar from 'components/NavBar/index'
import { useScroll } from 'hooks/useScroll'
import styled from 'lib/styled-components'
import { useBag } from 'nft/hooks'
import { GRID_AREAS } from 'pages/App/utils/shared'
import { memo } from 'react'
import { Z_INDEX } from 'theme/zIndex'

const AppHeader = styled.div`
  grid-area: ${GRID_AREAS.HEADER};
  width: 100vw;
  position: -webkit-sticky;
  position: sticky;
  top: 0px;
  z-index: ${Z_INDEX.sticky};
  pointer-events: none;

  & > * {
    pointer-events: auto;
  }
`
const NavOnScroll = styled.div<{ $transparent?: boolean }>`
  width: 100%;
  transition: transform ${({ theme }) => theme.transition.duration.slow};
`

export const Header = memo(function Header() {
  const { isScrolledDown } = useScroll()
  const isBagExpanded = useBag((state) => state.bagExpanded)
  const isHeaderTransparent = !isScrolledDown && !isBagExpanded

  return (
    <AppHeader id="AppHeader">
      <NavOnScroll $transparent={isHeaderTransparent}>
        <Navbar />
      </NavOnScroll>
    </AppHeader>
  )
})
