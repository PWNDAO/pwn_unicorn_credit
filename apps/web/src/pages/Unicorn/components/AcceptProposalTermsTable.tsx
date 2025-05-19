import { ReactNode } from 'react'
import { Flex, Text } from 'ui/src'

interface TermRow {
  label: string
  value: ReactNode
  url?: string | undefined
}

interface AcceptProposalTermsTableProps {
  terms: TermRow[]
  header?: {
    label: string
  }
}

const TableHeader = ({ label }: { label: string }) => (
  <Flex flexDirection="row" backgroundColor="$surface2" px="$spacing16" py="$spacing8">
    <Flex flex={1}>
      <Text color="$neutral2" variant="subheading2">
        {label}
      </Text>
    </Flex>
  </Flex>
)

const TableRow = ({ label, value, url }: TermRow) => {
  const handleMaybeOpenUrl = () => {
    console.log('url', url)
    if (url) {
      console.log('opening url', url)
      window.open(url, '_blank')
    }
  }

  return (
    <Flex flexDirection="row" px="$spacing24" py="$spacing8" alignItems="center">
      <Flex flex={1}>
        <Text color="$neutral2">{label}</Text>
      </Flex>
      <Flex
        flex={1}
        alignItems="flex-end"
        onPress={url ? handleMaybeOpenUrl : undefined}
        pressStyle={{ opacity: url ? 0.5 : 1 }}
        hoverStyle={{ cursor: url ? 'pointer' : 'default' }}
      >
        <Text color="$neutral1" hoverStyle={{ textDecorationLine: url ? 'underline' : 'none' }}>
          {value}
        </Text>
      </Flex>
    </Flex>
  )
}

export const AcceptProposalTermsTable = ({ terms, header }: AcceptProposalTermsTableProps) => (
  <Flex
    flexDirection="column"
    width="100%"
    backgroundColor="$surface1"
    borderRadius="$rounded20"
    borderWidth="$spacing1"
    borderColor="$surface3"
    overflow="hidden"
  >
    {header && <TableHeader label={header.label} />}
    <Flex flexDirection="column" py="$spacing16">
      {terms &&
        terms.length > 0 &&
        terms.map((term, idx) => (
          <TableRow key={term.label + idx} label={term.label} value={term.value} url={term.url} />
        ))}
    </Flex>
  </Flex>
)
