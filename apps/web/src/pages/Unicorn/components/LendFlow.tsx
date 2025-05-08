import { Flex, Text } from "ui/src"
import { SelectionModalMode } from "../hooks/lendingState"
import { InputAmountSelectToken } from "./InputAmountSelectToken"
import { CurrencyInfo } from "uniswap/src/features/dataApi/types"
import { ModalState } from "../hooks/lendingState"
import { CustomInputComponent } from "./CustomInputComponent"
import { ActionButton } from "./ActionButton"

export const LendFlow = (
    {
        selectedAsset,
        selectedAsset2,
        setAssetInputValue,
        selectionModalDispatch,
    }: {
        selectedAsset: CurrencyInfo | null,
        selectedAsset2: CurrencyInfo | null,
        setAssetInputValue: (value: string) => void,
        selectionModalDispatch: (action: { type: ModalState, mode: SelectionModalMode }) => void,
    }
) => {
    return (
        <Flex flexDirection="column" gap="$spacing16" width={'30rem'}>
            <InputAmountSelectToken
                label="Lend"
                onChangeText={(value) => setAssetInputValue(value)}
                onOpenTokenSelector={() => selectionModalDispatch({ type: ModalState.OPEN, mode: SelectionModalMode.ASSET })}
                selectedToken={selectedAsset as CurrencyInfo}
            />
            <Flex flexDirection="row" gap="$spacing16" width={'30rem'}>
                <InputAmountSelectToken
                    label="1st Token in Pair"
                    onChangeText={() => {}}
                    onOpenTokenSelector={() => {}}
                    selectedToken={selectedAsset as CurrencyInfo}
                    includeInputField={false}
                    disabled={true}
                />
                <InputAmountSelectToken
                    label="2nd Token in Pair"
                    onChangeText={() => {}} 
                    onOpenTokenSelector={() => selectionModalDispatch({ type: ModalState.OPEN, mode: SelectionModalMode.ASSET_2 })}
                    selectedToken={selectedAsset2 as CurrencyInfo}
                    includeInputField={false}
                />
            </Flex>
            {
                selectedAsset2 &&
                <Flex flexDirection="row" gap="$spacing16" width={'30rem'}>
                    <CustomInputComponent label="LTV (%)" onChangeText={() => { }} />
                    <CustomInputComponent label="Interest (%)" onChangeText={() => { }} />
                </Flex>
            }
            {
                selectedAsset && selectedAsset2 &&
                <ActionButton />
            }
        </Flex>
    )
}