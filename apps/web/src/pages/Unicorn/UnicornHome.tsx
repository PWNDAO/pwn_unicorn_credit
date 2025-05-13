import { Button, Flex, Image, Text, useMedia } from 'ui/src'
// import { MockSwapComponent } from './MockSwapComponent'

export default function UnicornHome() {
  const media = useMedia()

  return (
    <Flex
      minHeight="100vh"
      justifyContent="center"
      alignItems="center"
      backgroundColor="transparent"
      p="$spacing24"
      position="relative"
    >
      {/* Background Mock Component */}
      {/* <Flex
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
      </Flex> */}

      {/* Main Content */}
      <Flex
        // backgroundColor="$accent2"
        p={media.sm ? '$spacing24' : '$spacing40'}
        borderRadius="$rounded16"
        mb="$spacing24"
        alignItems="center"
        width="100vw"
        zIndex={1}
        position="relative"
        // shadowColor="$accent1"
        // shadowOffset={{ width: 0, height: 2 }}
        // shadowOpacity={0.25}
        // shadowRadius={3.84}
      >
        <Text
          style={{
            opacity: 0.05,
            position: 'absolute',
            top: '50%',
            left: '45%',
            transform: 'translate(-50%, -50%)',
            zIndex: 0,
            lineHeight: 1,
            userSelect: 'none',
            pointerEvents: 'none',
            fontSize: '500px',
          }}
        >
          🦄
        </Text>
        <Text
          color="$white"
          variant={media.sm ? 'heading2' : 'heading1'}
          mb="$spacing16"
          textAlign="center"
          fontWeight="bold"
          fontSize={72}
          style={{ textShadow: '0 0 20px rgba(252, 114, 255, 0.2)', fontFamily: 'Screener' }}
        >
          Coming Soon
        </Text>
        <Text
          color="$white"
          variant={media.sm ? 'subheading1' : 'heading3'}
          textAlign="center"
          style={{ textShadow: '0 0 20px rgba(70, 115, 250, 0.2)', fontFamily: 'Screener' }}
        >
          put your 🦄 unicorn assets to work
        </Text>
      </Flex>
      <Flex backgroundColor="#333333" borderRadius="$rounded32">
        <Button
          backgroundColor="#333333"
          // py="$spacing8"
          // px="$spacing16"
          borderRadius="$rounded32"
          // size="medium"
          onPress={() => {
            window.open('https://form.typeform.com/to/Cu0P1U9d', '_blank')
          }}
        >
          <Text color="$white" variant="buttonLabel2" style={{ fontFamily: 'Screener' }}>
            Subscribe for early access
          </Text>
        </Button>
      </Flex>
      <Text
        position="absolute"
        bottom="$spacing24"
        right={64}
        color="$white"
        fontSize={24}
        style={{ fontFamily: 'Screener' }}
      >
        Built on{' '}
        <a
          href="https://pwn.xyz"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: 'inherit',
            textDecoration: 'underline',
            cursor: 'pointer',
            display: 'inline-block',
            lineHeight: 0,
          }}
        >
          <Image
            src="/images/pwn_logo_text_white.png"
            alt="PWN"
            width={64}
            height={64}
            style={{ verticalAlign: 'middle' }}
          />
        </a>
      </Text>
    </Flex>
  )
}
