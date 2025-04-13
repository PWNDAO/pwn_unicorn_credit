import { Flex, Text, styled } from 'ui/src'

const LoadingWrapper = styled(Flex, {
  flexDirection: 'column',
  gap: '$spacing8',
  p: '$spacing12',
  borderWidth: 1,
  borderColor: '$surface3',
  borderRadius: '$rounded16',
  backgroundColor: '$surface1',
  width: 380,
})

const TabWrapper = styled(Flex, {
  flexDirection: 'row',
  gap: '$spacing12',
  mb: '$spacing16',
})

const Tab = styled(Flex, {
  p: '$spacing8',
  px: '$spacing16',
  borderRadius: '$rounded8',
  variants: {
    active: {
      true: {
        backgroundColor: '$accent2',
      },
      false: {
        backgroundColor: 'transparent',
      },
    },
  },
})

const InputBlob = styled(Flex, {
  backgroundColor: '$surface2',
  borderRadius: '$rounded16',
  p: '$spacing16',
  gap: '$spacing8',
})

const TokenRow = styled(Flex, {
  flexDirection: 'row',
  alignItems: 'center',
  gap: '$spacing8',
  width: '100%',
})

const InputField = styled(Flex, {
  backgroundColor: '$surface3',
  px: '$spacing24',
  py: '$spacing8',
  borderRadius: '$rounded12',
  width: '50%',
})

const TokensGroup = styled(Flex, {
  flexDirection: 'row',
  alignItems: 'center',
  gap: '$spacing8',
  width: '50%',
  justifyContent: 'flex-end',
})

const TokenCircle = styled(Flex, {
  width: 36,
  height: 36,
  borderRadius: '$roundedFull',
  backgroundColor: '$surface3',
  alignItems: 'center',
  justifyContent: 'center',
  variants: {
    grow: {
      true: {
        flex: 1,
      },
    },
  },
})

export function MockSwapComponent() {
  return (
    <LoadingWrapper>
      <TabWrapper>
        <Tab active>
          <Text color="$neutral1" variant="buttonLabel1">
            Borrow
          </Text>
        </Tab>
        <Tab>
          <Text color="$neutral2" variant="buttonLabel1">
            Lend
          </Text>
        </Tab>
      </TabWrapper>

      <InputBlob>
        <Text color="$neutral2" variant="subheading2" mb="$spacing8">
          LP
        </Text>
        <TokenRow>
          <InputField>
            <Text color="$neutral2" variant="body2">
              420
            </Text>
          </InputField>
          <TokensGroup>
            <TokenCircle grow>
              <Text color="$neutral1" variant="body3">
                DAI
              </Text>
            </TokenCircle>
            <Text color="$neutral3" mx="$spacing8">
              🤝
            </Text>
            <TokenCircle grow>
              <Text color="$neutral1" variant="body3">
                USDC
              </Text>
            </TokenCircle>
          </TokensGroup>
        </TokenRow>
      </InputBlob>

      <InputBlob>
        <Text color="$neutral2" variant="subheading2">
          Credit
        </Text>
        <TokenRow>
          <InputField>
            <Text color="$neutral2" variant="body2">
              Any
            </Text>
          </InputField>
          <TokensGroup>
            <TokenCircle grow>
              <Text color="$neutral1" variant="body3">
                USDC
              </Text>
            </TokenCircle>
          </TokensGroup>
        </TokenRow>
      </InputBlob>
    </LoadingWrapper>
  )
}
