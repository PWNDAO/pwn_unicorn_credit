import { Flex, useMedia } from 'ui/src'
import { mockLoansPlural } from '../mocks/mockLoans'
import { mockLendingProposals } from '../mocks/mockProposal'
import { MyActivityTableLoans } from './MyActivityTableLoans'
import { MyActivityTableProposals } from './MyActivityTableProposals'

export const MyLending = () => {
  const media = useMedia()
  return (
    <Flex justifyContent="center" alignItems="center" width={'100%'} maxWidth={'$full'}>
      <Flex
        flexDirection={media.lg ? 'column' : 'row'}
        gap="$spacing16"
        width={'$full'}
        justifyContent="center"
        alignItems="center"
      >
        <MyActivityTableProposals header="Offers" mode="lend" proposals={mockLendingProposals} />
        <MyActivityTableLoans header="Loans" mode="lend" loans={mockLoansPlural} />
      </Flex>
    </Flex>
  )
}
