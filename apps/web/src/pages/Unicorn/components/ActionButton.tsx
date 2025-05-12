import { Button, Flex, Text } from 'ui/src'
import { useWalletClient } from 'wagmi'

export const ActionButton = ({ label, onPress }: { label?: string; onPress?: () => void }) => {
  const { data: walletClient } = useWalletClient()
  return (
    <Flex
      animation="quick"
      enterStyle={{ opacity: 0 }}
      exitStyle={{ opacity: 0 }}
      gap="$spacing2"
      width="max-content"
      alignSelf="center"
      justifyContent="center"
      mt={50}
    >
      <Button
        backgroundColor="$accent1"
        borderRadius="$rounded20"
        px="$spacing16"
        py="$spacing16"
        pressStyle={{
          backgroundColor: 'rgb(192, 92, 152)',
        }}
        hoverStyle={{
          backgroundColor: 'rgb(192, 92, 152)',
        }}
        animation="quick"
        size="large"
        onPress={async () => {
          try {
            const signature = await walletClient?.signMessage({
              message: 'You will be creating the request in here, in your wallet.',
            })
            console.log('signature', signature)
          } catch (error) {
            console.error('error', error)
          }
        }}
      >
        <Text variant="buttonLabel1" color="$sporeWhite">
          {label || 'Sign and Create'}
        </Text>
      </Button>
    </Flex>
  )
}
