import { useLocation } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { Flex, Text, styled } from 'ui/src'

const NavLink = styled(Link, {
  textDecoration: 'none',
  color: 'inherit',
})

const NavItem = styled(Flex, {
  px: '$padding16',
  py: '$padding8',
  borderRadius: '$rounded24',
  cursor: 'pointer',
  transition: 'background-color 0.15s, color 0.15s',
  alignItems: 'center',
  justifyContent: 'center',
  variants: {
    isActive: {
      true: {
        backgroundColor: '$surface2',
      },
      false: {
        backgroundColor: 'transparent',
        hoverStyle: {
          backgroundColor: '$surface2Hovered',
        },
      },
    },
  },
})

export function Navigation() {
  const { pathname } = useLocation()

  const navItems = [
    { path: '/borrow', label: 'Borrow' },
    { path: '/lend', label: 'Lend' },
    { path: '/my-lending', label: 'My Lending' },
    { path: '/my-borrowing', label: 'My Borrowing' },
  ]

  return (
    <Flex row gap="$gap16" alignItems="center">
      {navItems.map((item) => {
        const isActive = pathname === item.path
        return (
          <NavItem key={item.path} isActive={isActive}>
            <NavLink to={item.path}>
              <Text
                variant="subheading1"
                color={isActive ? '$neutral1' : '$neutral2'}
                fontWeight={isActive ? '600' : '400'}
                style={{ transition: 'color 0.15s' }}
              >
                {item.label}
              </Text>
            </NavLink>
          </NavItem>
        )
      })}
    </Flex>
  )
} 