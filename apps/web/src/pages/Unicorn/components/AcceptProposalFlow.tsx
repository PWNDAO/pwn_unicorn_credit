import { Flex } from "ui/src"
import { CurrencyInfo } from "uniswap/src/features/dataApi/types"
import { InputAmountSelectToken } from "./InputAmountSelectToken"
import { formatUnits } from "viem"
import { CustomInputComponent } from "./CustomInputComponent"
import { SelectPoolInput } from "./SelectPoolInput"
import { ActionButton } from "./ActionButton"
import { useMemo } from "react"
import { TOKEN_BY_ADDRESS } from "./AvailableOffersCards"
import { ListOfTokens } from "./ListOfTokens"

export const AcceptProposalFlow = (
    {
        selectedProposal
    }: {
        selectedProposal: any
    }
) => {
    const creditAssetObject: CurrencyInfo = {
        currency: {
            ...selectedProposal?.creditAsset,
        },
        currencyId: selectedProposal?.creditAsset.address,
        logoUrl: selectedProposal?.creditAsset.logoUrl,
    }
    const mode = selectedProposal?.mode as "borrow" | "lend"
    const maxBorrowableAmount = useMemo(() => {
        if (mode !== "borrow" && !selectedProposal?.pool) return 0
        return Number(selectedProposal?.pool?.totalUsdValue) * (selectedProposal?.loanToValue / 100_000)
    }, [selectedProposal])

    const selectedPairTokens = useMemo(() => {
        if (mode !== 'lend') return []
        const tokenAList: CurrencyInfo[] = selectedProposal?.tokenAAllowList?.map((token: string) => {
            return {
                currency: {
                    ...TOKEN_BY_ADDRESS[token as keyof typeof TOKEN_BY_ADDRESS],
                    isNative: false,
                    isToken: true,
                    equals: () => false,
                    sortsBefore: () => false,
                    wrapped: {} as any,
                },
                currencyId: token,
                logoUrl: TOKEN_BY_ADDRESS[token as keyof typeof TOKEN_BY_ADDRESS]?.logoUrl,
            }
        }) ?? []
        const tokenBList: CurrencyInfo[] = selectedProposal?.tokenBAllowList?.map((token: string) => {
            return {
                currency: {
                    ...TOKEN_BY_ADDRESS[token as keyof typeof TOKEN_BY_ADDRESS],
                    isNative: false,
                    isToken: true,
                    equals: () => false,
                    sortsBefore: () => false,
                wrapped: {} as any,
            },
                currencyId: token,
                logoUrl: TOKEN_BY_ADDRESS[token as keyof typeof TOKEN_BY_ADDRESS]?.logoUrl,
            }
        }) ?? []
        return [...tokenAList, ...tokenBList]
    }, [selectedProposal])
    return (
        <Flex flexDirection="column" gap="$spacing16">
            {mode === "borrow" ? (
                <>
                    <InputAmountSelectToken
                        label="Borrow"
                        onChangeText={() => {}}
                        onOpenTokenSelector={() => {}}
                        selectedToken={creditAssetObject}
                        disabled
                        fixedValue={maxBorrowableAmount?.toFixed(2)}
                    />
                    <SelectPoolInput onOpenTokenSelector={() => { }} selectedPool={selectedProposal?.pool} />
                </>
            ) : (
                <>
                    <InputAmountSelectToken
                        label="Lend"
                        onChangeText={() => {}}
                        onOpenTokenSelector={() => {}}
                        selectedToken={creditAssetObject}
                        disabled
                        fixedValue={formatUnits(selectedProposal?.creditAmount ?? 0n, creditAssetObject?.currency?.decimals ?? 18)}
                    />
                    <Flex flexDirection="row" gap="$spacing16" width={'30rem'}>
                        <ListOfTokens tokens={selectedPairTokens} label="Pools made from these tokens" />
                    </Flex>
                </>
            )}

            <Flex flexDirection="row" gap="$spacing16" width={'30rem'}>
                <CustomInputComponent label="LTV (%)" onChangeText={() => { }} disabled={true} fixedValue={(selectedProposal?.loanToValue / 1_000)?.toString()} />
                <CustomInputComponent label="Interest (%)" onChangeText={() => { }} disabled={true} fixedValue={(selectedProposal?.apr / 1_000)?.toString()} />
            </Flex>
            <CustomInputComponent label="Duration (days)" onChangeText={() => { }} disabled={true} fixedValue={"30 days"} />
            <ActionButton label="Accept Proposal" />
        </Flex>
    )
}