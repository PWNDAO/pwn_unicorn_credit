import { Flex } from 'ui/src'
import { mockLoansPlural } from '../mocks/mockLoans'
import { MyActivityTable } from './MyActivityTable'
export const MyLending = () => {
  return (
    <Flex width="30rem" justifyContent="center" alignItems="center">
      <Flex flexDirection="row" gap="$spacing16" width="100%" justifyContent="center" alignItems="center">
        <MyActivityTable header="Offers" mode="lend" loans={mockLoansPlural} />
        <MyActivityTable header="Loans" mode="lend" loans={mockLoansPlural} />
      </Flex>
    </Flex>
  )
}
