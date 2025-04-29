import { useQuery } from "@tanstack/react-query";

export const useAssetPrice = (
    chainId: number | undefined,
    contractAddress: string | undefined,
) => {
    console.log('chainId:', chainId, 'contractAddress:', contractAddress, 'will this run?:', !!chainId && !!contractAddress)
    return useQuery({
        queryKey: ['assetPrice', chainId, contractAddress],
        queryFn: async () => {
            const url = `https://api-staging.pwn.xyz/api/v1/asset/price/${encodeURIComponent(String(chainId))}/${encodeURIComponent(String(contractAddress))}/null`
            const response = await fetch(url, { method: "GET", headers: { "Content-Type": "application/json" }})
            const data = await response.json()
            const priceData = Number(data?.best_price?.price?.usd_amount || 0) ?? 0
            console.log('priceData', priceData)
            return priceData
        },
        enabled: !!chainId && !!contractAddress,
    })
}