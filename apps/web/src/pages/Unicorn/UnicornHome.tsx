import { Button, Flex, Text, useMedia } from 'ui/src'
import { MockSwapComponent } from './MockSwapComponent'

export default function UnicornHome() {
  const media = useMedia()

  return (
    <Flex
      minHeight="100vh"
      justifyContent="center"
      alignItems="center"
      backgroundColor="$background"
      p="$spacing24"
      position="relative"
    >
      {/* Background Mock Component */}
      <Flex
        position="absolute"
        width="100%"
        height="100%"
        justifyContent="center"
        alignItems="center"
        pointerEvents="none"
        transform="translateY(-10%)"
        filter="blur(1.5px)"
      >
        <MockSwapComponent />
      </Flex>

      {/* Main Content */}
      <Flex
        backgroundColor="$accent2"
        p={media.sm ? '$spacing24' : '$spacing40'}
        borderRadius="$rounded16"
        mt="200px"
        mb="$spacing24"
        alignItems="center"
        width="100%"
        maxWidth={480}
        zIndex={1}
        shadowColor="$accent1"
        shadowOffset={{ width: 0, height: 2 }}
        shadowOpacity={0.25}
        shadowRadius={3.84}
      >
        <Text
          color="$white"
          variant={media.sm ? 'heading2' : 'heading1'}
          mb="$spacing16"
          textAlign="center"
          fontWeight="bold"
          style={{ textShadow: '0 0 20px rgba(252, 114, 255, 0.2)' }}
        >
          Coming Soon
        </Text>
        <Text
          color="$white"
          variant={media.sm ? 'subheading1' : 'heading3'}
          textAlign="center"
          style={{ textShadow: '0 0 20px rgba(70, 115, 250, 0.2)' }}
        >
          put your 🦄 unicorn assets to work
        </Text>
      </Flex>
      <Flex
        backgroundColor="$accent2"
        py="$spacing8"
        px="$spacing16"
        borderRadius="$rounded12"
        pressStyle={{ opacity: 0.8 }}
        hoverStyle={{ backgroundColor: '$accent2' }}
        zIndex={1}
      >
        <Button
          backgroundColor="$accent2"
          py="$spacing8"
          px="$spacing16"
          borderRadius="$rounded32"
          size="medium"
          hoverStyle={{ backgroundColor: '$accent2' }}
          onPress={() => {
            window.open('https://x.com/pwndao', '_blank')
          }}
        >
          <Text color="$white" variant="buttonLabel2">
            Follow for updates
          </Text>
        </Button>
      </Flex>
    </Flex>
  )
}
