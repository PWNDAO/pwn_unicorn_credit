import { SelectionModalMode } from "../hooks/lendingState"

import { InputAmountSelectToken } from "./InputAmountSelectToken"

import { ModalState } from "../hooks/lendingState"

import { CurrencyInfo } from "uniswap/src/features/dataApi/types"
import { ActionButton } from "./ActionButton"
import { CustomInputComponent } from "./CustomInputComponent"
import { SelectPoolInput } from "./SelectPoolInput"
import { PoolData } from "uniswap/src/components/TokenSelector/lists/TokenSelectorPoolsList"
import { Flex } from "ui/src"
import { calculateLtv } from "../utils/math"
import { useMemo } from "react"

export const BorrowFlow = (
    {
        selectedLendAsset,
        selectedBorrowAsset,
        setAssetInputValue,
        selectionModalDispatch,
        amountInputValue,
    }: {
        selectedLendAsset: PoolData | null,
        selectedBorrowAsset: CurrencyInfo | null,
        setAssetInputValue: (value: string) => void,
        selectionModalDispatch: (action: { type: ModalState, mode: SelectionModalMode }) => void,
        amountInputValue: string,
    }
) => {
    const ltv = useMemo(() => calculateLtv(Number(amountInputValue), Number(selectedLendAsset?.totalUsdValue ?? 0)), [amountInputValue, selectedLendAsset])
    return (
        <>
            <SelectPoolInput onOpenTokenSelector={() => selectionModalDispatch({ type: ModalState.OPEN, mode: SelectionModalMode.POOL })} selectedPool={selectedLendAsset as PoolData} />
            <InputAmountSelectToken
                label="Borrow"
                onChangeText={(value) => setAssetInputValue(value)}
                onOpenTokenSelector={() => selectionModalDispatch({ type: ModalState.OPEN, mode: SelectionModalMode.ASSET })}
                selectedToken={selectedBorrowAsset as CurrencyInfo}
            />
            {
                selectedBorrowAsset &&
                <Flex flexDirection="row" gap="$spacing16" width={'30rem'}>
                    <CustomInputComponent label="LTV (%)" onChangeText={() => { }} disabled={true} fixedValue={ltv?.toString()} />
                    <CustomInputComponent label="Interest (%)" onChangeText={() => { }} />
                </Flex>
            }
            <ActionButton />
        </>
    )
}