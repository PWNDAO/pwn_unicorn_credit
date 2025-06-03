export const mockHooks: Hook[] = [
  {
    address: '0xA1b2C3D4E5F60718293A4B5C6D7E8F9012345678',
    protocol: 'Aave_v3',
    chainId: 8453,
    apr: 1234,
    underlyingAddress: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
  },
  {
    address: '0xB2c3D4e5F60718293A4b5C6d7E8f9012345678A1',
    protocol: 'Morpho',
    chainId: 8453,
    apr: 2422,
    underlyingAddress: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
  },
  {
    address: '0xC3d4E5f60718293A4B5c6D7e8F9012345678A1B2',
    protocol: 'Euler',
    chainId: 8453,
    apr: 1953,
    underlyingAddress: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
  },
  {
    address: '0xD4e5F60718293A4b5C6d7E8F9012345678A1B2C3',
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
