import { Flex, useMedia } from 'ui/src'
import { mockLoansPlural } from '../mocks/mockLoans'
import { mockLendingProposals } from '../mocks/mockProposal'
import { MyActivityTableLoans } from './MyActivityTableLoans'
import { MyActivityTableProposals } from './MyActivityTableProposals'

export const MyBorrowing = () => {
  const media = useMedia()
  return (
    <Flex width="$full" justifyContent="center" alignItems="center">
      <Flex
        flexDirection={media.xl ? 'column' : 'row'}
        gap="$spacing16"
        width="$full"
        justifyContent="center"
        alignItems="center"
      >
        <MyActivityTableProposals header="Requests" mode="borrow" proposals={mockLendingProposals} />
        <MyActivityTableLoans header="Loans" mode="borrow" loans={mockLoansPlural} />
      </Flex>
    </Flex>
  )
}
