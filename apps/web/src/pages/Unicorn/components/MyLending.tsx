import { Flex, useMedia } from 'ui/src'
import { useProposals } from '../hooks/useProposals'
import { useLoans } from '../hooks/useLoans'
import { MyActivityTableLoans } from './MyActivityTableLoans'
import { MyActivityTableProposals } from './MyActivityTableProposals'

export const MyLending = () => {
  const media = useMedia()
  
  // Fetch proposals and loans for lending mode
  const { data: proposals, isLoading: proposalsLoading, error: proposalsError } = useProposals({ mode: 'lend' })
  const { data: loans, isLoading: loansLoading, error: loansError } = useLoans({ mode: 'lend' })

  return (
    <Flex justifyContent="center" alignItems="center" width={'100%'} maxWidth={'$full'}>
      <Flex
        flexDirection={media.lg ? 'column' : 'row'}
        gap="$spacing16"
        width={'$full'}
        justifyContent="center"
        alignItems="center"
      >
        <MyActivityTableProposals 
          header="Offers" 
          mode="lend" 
          proposals={proposals || []}
          isLoading={proposalsLoading}
          error={proposalsError}
        />
        <MyActivityTableLoans 
          header="Loans" 
          mode="lend" 
          loans={loans || []}
          isLoading={loansLoading}
          error={loansError}
        />
      </Flex>
    </Flex>
  )
}
