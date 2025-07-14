# Unicorn Data Fetching Infrastructure

This directory contains the data fetching infrastructure for the Unicorn lending/borrowing components.

## Overview

The fetching infrastructure has been set up to replace mock data with real SDK calls. The system includes:

- Custom hooks for fetching proposals and loans
- Automatic query invalidation when wallet address changes
- Loading and error states for all components
- TypeScript interfaces for data structures

## Files

### Hooks

- `hooks/useProposals.ts` - Hook for fetching proposals (offers/requests)
- `hooks/useLoans.ts` - Hook for fetching loans
- `hooks/useWalletAddressChange.ts` - Utility hook for handling wallet address changes

### Components

- `components/MyLending.tsx` - Updated to use real data fetching
- `components/MyBorrowing.tsx` - Updated to use real data fetching
- `components/MyActivityTableProposals.tsx` - Updated with loading/error states
- `components/MyActivityTableLoans.tsx` - Updated with loading/error states

### Providers

- `providers/UnicornDataProvider.tsx` - Provider for handling wallet address changes

## Implementation Required

### 1. SDK Integration

Replace the placeholder fetch calls in the hooks with your actual SDK calls:

**In `hooks/useProposals.ts`:**
```typescript
queryFn: async (): Promise<Proposal[]> => {
  // TODO: Replace this with your actual SDK call
  // Example:
  // const sdk = new UnicornSDK()
  // return await sdk.getProposals(account.address, mode)
  
  const response = await fetch(`/api/proposals?address=${account.address}&mode=${mode}`)
  if (!response.ok) {
    throw new Error('Failed to fetch proposals')
  }
  return response.json()
}
```

**In `hooks/useLoans.ts`:**
```typescript
queryFn: async (): Promise<Loan[]> => {
  // TODO: Replace this with your actual SDK call
  // Example:
  // const sdk = new UnicornSDK()
  // return await sdk.getLoans(account.address, mode)
  
  const response = await fetch(`/api/loans?address=${account.address}&mode=${mode}`)
  if (!response.ok) {
    throw new Error('Failed to fetch loans')
  }
  return response.json()
}
```

### 2. Data Types

Update the `Proposal` and `Loan` interfaces in the hooks to match your SDK response structure.

### 3. Provider Setup

Add the `UnicornDataProvider` to your app's component tree, typically near the root:

```typescript
import { UnicornDataProvider } from './pages/Unicorn/providers/UnicornDataProvider'

function App() {
  return (
    <UnicornDataProvider>
      {/* Your app components */}
    </UnicornDataProvider>
  )
}
```

## Features

### Automatic Refetching

- Queries automatically refetch when wallet address changes
- Queries are invalidated when switching between wallets
- Stale data is refetched after 5 minutes

### Loading States

- Components show loading indicators while data is being fetched
- Loading states are handled gracefully with proper UI feedback

### Error Handling

- Network errors and API errors are displayed to users
- Error messages are shown in the UI with retry capabilities

### Query Optimization

- Queries are only enabled when a wallet address is available
- Stale time is set to 5 minutes to reduce unnecessary requests
- Queries don't refetch on window focus to reduce API calls

## Usage

The components are now ready to use with real data. Simply implement the SDK calls in the hooks and the system will automatically:

1. Fetch data when components mount
2. Refetch when wallet address changes
3. Show loading states during fetches
4. Display errors if fetches fail
5. Cache data appropriately

## Testing

To test the infrastructure without implementing the SDK:

1. The hooks currently use placeholder fetch calls
2. You can temporarily return mock data from the `queryFn` functions
3. The loading and error states will work with the current implementation

Example temporary implementation:
```typescript
queryFn: async (): Promise<Proposal[]> => {
  // Temporary: return mock data for testing
  return mockLendingProposals
}
``` 