export const mockHooks: Hook[] = [
  {
    address: '0x1234567890123456789012345678901234567890',
    protocol: 'Aave_v3',
    chainId: 8453,
    apr: 1234,
    underlyingAddress: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
  },
  {
    address: '0x1234567890123456789012345678901234567890',
    protocol: 'Morpho',
    chainId: 8453,
    apr: 2422,
    underlyingAddress: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
  },
  {
    address: '0x1234567890123456789012345678901234567890',
    protocol: 'Euler',
    chainId: 8453,
    apr: 1953,
    underlyingAddress: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
  },
  {
    address: '0x1234567890123456789012345678901234567890',
    protocol: 'Compound_v3',
    chainId: 8453,
    apr: 852,
    underlyingAddress: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
  },
]

export type Hook = {
  address: string
  protocol: 'Aave_v3' | 'Morpho' | 'Euler' | 'Compound_v3'
  chainId: number
  apr: number
  underlyingAddress: string
}
