import { Flex } from 'ui/src'
import { mockLoansPlural } from '../mocks/mockLoans'
import { mockLendingProposals } from '../mocks/mockProposal'
import { MyActivityTableLoans } from './MyActivityTableLoans'
import { MyActivityTableProposals } from './MyActivityTableProposals'

export const MyLending = () => {
  return (
    <Flex width="30rem" justifyContent="center" alignItems="center">
      <Flex flexDirection="row" gap="$spacing16" width="100%" justifyContent="center" alignItems="center">
        <MyActivityTableProposals header="Offers" mode="lend" proposals={mockLendingProposals} />
        <MyActivityTableLoans header="Loans" mode="lend" loans={mockLoansPlural} />
      </Flex>
    </Flex>
  )
}
