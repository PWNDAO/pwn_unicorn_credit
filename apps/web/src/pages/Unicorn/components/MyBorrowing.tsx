import { Flex } from 'ui/src'
import { mockLoansPlural } from '../mocks/mockLoans'
import { mockLendingProposals } from '../mocks/mockProposal'
import { MyActivityTableLoans } from './MyActivityTableLoans'
import { MyActivityTableProposals } from './MyActivityTableProposals'

export const MyBorrowing = () => {
  return (
    <Flex width="30rem" justifyContent="center" alignItems="center">
      <Flex flexDirection="row" gap="$spacing16" width="100%" justifyContent="center" alignItems="center">
        <MyActivityTableProposals header="Requests" mode="borrow" proposals={mockLendingProposals} />
        <MyActivityTableLoans header="Loans" mode="borrow" loans={mockLoansPlural} />
      </Flex>
    </Flex>
  )
}
