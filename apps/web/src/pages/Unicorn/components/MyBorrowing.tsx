import { Flex } from 'ui/src'
import { mockLoansPlural } from '../mocks/mockLoans'
import { MyActivityTable } from './MyActivityTable'

export const MyBorrowing = () => {
  return (
    <Flex width="30rem" justifyContent="center" alignItems="center">
      <Flex flexDirection="row" gap="$spacing16" width="100%" justifyContent="center" alignItems="center">
        <MyActivityTable header="Requests" mode="borrow" loans={mockLoansPlural} />
        <MyActivityTable header="Loans" mode="borrow" loans={mockLoansPlural} />
      </Flex>
    </Flex>
  )
}
