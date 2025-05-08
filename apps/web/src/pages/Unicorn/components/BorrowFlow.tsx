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
        selectedPool,
        selectedAsset,
        setAssetInputValue,
        selectionModalDispatch,
        amountInputValue,
    }: {
        selectedPool: PoolData | null,
        selectedAsset: CurrencyInfo | null,
        setAssetInputValue: (value: string) => void,
        selectionModalDispatch: (action: { type: ModalState, mode: SelectionModalMode }) => void,
        amountInputValue: string,
    }
) => {
    const ltv = useMemo(() => calculateLtv(Number(amountInputValue), Number(selectedPool?.totalUsdValue ?? 0)), [amountInputValue, selectedPool])
    return (
        <>
            <SelectPoolInput onOpenTokenSelector={() => selectionModalDispatch({ type: ModalState.OPEN, mode: SelectionModalMode.POOL })} selectedPool={selectedPool as PoolData} />
            <InputAmountSelectToken
                label="Borrow"
                onChangeText={(value) => setAssetInputValue(value)}
                onOpenTokenSelector={() => selectionModalDispatch({ type: ModalState.OPEN, mode: SelectionModalMode.ASSET })}
                selectedToken={selectedAsset as CurrencyInfo}
            />
            {
                selectedAsset &&
                <Flex flexDirection="row" gap="$spacing16" width={'30rem'}>
                    <CustomInputComponent label="LTV (%)" onChangeText={() => { }} disabled={true} fixedValue={ltv?.toString()} />
                    <CustomInputComponent label="Interest (%)" onChangeText={() => { }} />
                </Flex>
            }
            <ActionButton />
        </>
    )
}