import { Flex } from 'ui/src'
import { ActionDialog } from './ActionDialog'

export default function UnicornHome() {
  return (
    <Flex>
      <Flex gap={'$gap16'}>
        <ActionDialog />
      </Flex>
    </Flex>
  )
}
