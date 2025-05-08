import { Button, Flex, Text } from 'ui/src'
import { chainName } from 'uniswap/src/components/TokenSelector/lists/TokenSelectorPoolsList'
import { mockLendingProposals } from '../mocks/mockProposal'
import { formatUnits } from 'viem'
import { useMemo } from 'react'

export const TOKEN_BY_ADDRESS = {
    ['0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913']: {
        symbol: 'USDC',
        name: 'USD Coin',
        logoUrl: "https://imgs.search.brave.com/qVfnM06301I6nmM20XJwh7E1dtjKpAU1IA0dllgkXNo/rs:fit:40:40:1:0/g:ce/aHR0cHM6Ly9jb2lu/LWltYWdlcy5jb2lu/Z2Vja28uY29tL2Nv/aW5zL2ltYWdlcy82/MzE5L2xhcmdlL3Vz/ZGMucG5nPzE2OTY1/MDY2OTQ",
        decimals: 6,
        chainId: 8453,
        address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913'
    },
    ['0x4200000000000000000000000000000000000006']: {
        symbol: 'WETH',
        name: 'Wrapped Ether',
        logoUrl: 'https://assets.coingecko.com/coins/images/2518/standard/weth.png?1696503332',
        decimals: 18,
        chainId: 8453,
        address: '0x4200000000000000000000000000000000000006'
    }
}

export const AvailableOffersCards = (
    {
        creditAmount,
        ltv,
        interestRate,
        mode = 'all',
        handleAcceptProposal
    }: {
        creditAmount?: bigint,
        ltv?: number,
        interestRate?: number,
        mode?: 'borrow' | 'lend' | 'all',
        handleAcceptProposal?: (proposal: any) => void
    }
) => {

    const proposals = useMemo(() => {
        return mockLendingProposals
            .filter(p => {
                if (mode === 'borrow') {
                    return interestRate ? p.apr <= interestRate : true
                } else if (mode === 'lend') {
                    return (ltv ? p.loanToValue <= ltv : true) && (interestRate ? p.apr >= interestRate : true)
                } else {
                    return true
                }
            })
            .sort((a, b) => {
                // Sort by credit amount first
                if (a.creditAmount !== b.creditAmount) {
                    return Number(b.creditAmount - a.creditAmount)
                }
                
                // Then sort by LTV based on mode
                if (a.loanToValue !== b.loanToValue) {
                    return mode === 'lend' ? 
                        b.loanToValue - a.loanToValue :
                        a.loanToValue - b.loanToValue
                }
                
                // Finally sort by APR based on mode
                return mode === 'lend' ?
                    b.apr - a.apr :
                    a.apr - b.apr
            })
    }, [creditAmount, ltv, mode, interestRate, mockLendingProposals])
  return (
    <Flex
        backgroundColor="$surface1"
        width="25rem"
        height="30rem"
        borderRadius="$rounded16"
        overflow="hidden"
    >
        <Text variant="subheading2" color="$neutral2" px="$spacing16" py="$spacing16">Choose from the following offers</Text>
        <Flex flexDirection="column" gap="$spacing8" px="$spacing16" py="$spacing16" overflow="scroll" height="100%">
        {   proposals.map((proposal, index) => {
                const creditAsset = TOKEN_BY_ADDRESS[proposal.creditAsset.address as keyof typeof TOKEN_BY_ADDRESS]
                const tokenA = TOKEN_BY_ADDRESS[proposal.tokenAAllowList[0] as keyof typeof TOKEN_BY_ADDRESS]
                const tokenB = TOKEN_BY_ADDRESS[proposal.tokenBAllowList[0] as keyof typeof TOKEN_BY_ADDRESS]
            return (
            <Button
                key={index}
                width={'$full'} 
                height={proposals.length === 1 ? '2rem' : '$full'}
                backgroundColor="$surface1"
                borderColor="$surface3"
                borderRadius="$rounded20"
                borderWidth="$spacing1"
                px="$spacing16"
                py={72}
                pressStyle={{
                backgroundColor: 'rgb(35, 33, 34)',
                }}
                hoverStyle={{
                backgroundColor: 'rgb(35, 33, 34)',
                }}
                animation="quick"
                size="large"
                justifyContent='unset'
                flex={0}
                mb={proposals.length - 1 === index ? 64 : '0'}
                onPress={() => handleAcceptProposal?.(proposal)}
            >
                <Flex flexDirection="column" height={'$spacing120'} width="100%" gap="$spacing4" justifyContent="space-between">
                <Flex flexDirection="row" justifyContent="space-between">
                    <Text color="$neutral2" variant="subheading2">Position</Text>
                    <Text color="$neutral1" variant="subheading2">{tokenA.symbol} / {tokenB.symbol}</Text>
                </Flex>
                <Flex flexDirection="row" justifyContent="space-between">
                    <Text color="$neutral2" variant="subheading2">Liquidity</Text>
                    <Text color="$neutral1" variant="subheading2">{formatUnits(BigInt(proposal.creditAmount ?? 0), creditAsset.decimals)} {creditAsset.symbol}</Text>
                </Flex>
                <Flex flexDirection="row" justifyContent="space-between">
                    <Text color="$neutral2" variant="subheading2">LTV</Text>
                    <Text color="$neutral1" variant="subheading2">{proposal.loanToValue / 10_00}%</Text>
                </Flex>
                <Flex flexDirection="row" justifyContent="space-between">
                    <Text color="$neutral2" variant="subheading2">Interest Rate</Text>
                    <Text color="$neutral1" variant="subheading2">{proposal.apr / 10_00}%</Text>
                </Flex>
                <Flex flexDirection="row" justifyContent="space-between">
                    <Text color="$neutral2" variant="subheading2">Chain</Text>
                    <Text color="$neutral1" variant="subheading2">{chainName(proposal.chainId)}</Text>
                </Flex>
                </Flex>
            </Button>
            )
        })}
        </Flex>
    </Flex>
  )
}
