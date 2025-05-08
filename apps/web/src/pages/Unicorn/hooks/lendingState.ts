import { useReducer, useRef, useState } from 'react'
import { CurrencyInputPanelRef } from 'uniswap/src/components/CurrencyInputPanel/CurrencyInputPanel'
import { PoolData } from 'uniswap/src/components/TokenSelector/lists/TokenSelectorPoolsList'
import { CurrencyInfo } from 'uniswap/src/features/dataApi/types'
import { useAccount } from 'wagmi'

export enum SelectionModalMode {
    ASSET = 'asset',
    POOL = 'pool'
}

export enum ModalState {
    OPEN = 'open',
    CLOSE = 'close'
}

export enum APP_TABS {
    BORROW = 'borrow',
    LEND = 'lend',
    MY_ACTIVITY = 'my_activity',
    MARKET = 'market',
}

type SelectionModalState = {
    mode: SelectionModalMode | null
    isOpen: boolean
}

type SelectionModalAction = 
    | { type: ModalState.OPEN; mode: SelectionModalMode }
    | { type: ModalState.CLOSE }

export const useLendingState = () => {
    const { address } = useAccount()

    // states
    const selectionModalReducer = (
        state: SelectionModalState, 
        action: SelectionModalAction
    ): SelectionModalState => {
        switch (action.type) {
            case ModalState.OPEN:
                return {
                    isOpen: true,
                    mode: action.mode
                }
            case ModalState.CLOSE:
                return {
                    isOpen: false,
                    mode: null
                }
            default:
                return state
        }
    }

    const [
        selectionModalState, 
        selectionModalDispatch
    ] = useReducer(selectionModalReducer, {
        mode: null,
        isOpen: false
    })

    const [assetInputValue, setAssetInputValue] = useState<string>('')
    const [selectedAppTab, selectAppTab] = useState<APP_TABS>(APP_TABS.BORROW)
    const [selectedLendAsset, setSelectedLendAsset] = useState<CurrencyInfo | PoolData | null>(null)
    const [selectedBorrowAsset, setSelectedBorrowAsset] = useState<CurrencyInfo | PoolData | null>(null)
    const [focusOnFirstNotSecondInput, setFocusOnFirstNotSecondInput] = useState<boolean>(false)

    // refs
    const firstInputRef = useRef<CurrencyInputPanelRef>(null)
    const secondInputRef = useRef<CurrencyInputPanelRef>(null)

    const onToggleFocusOnFirstNotSecondInput = (value: boolean) => {
        setFocusOnFirstNotSecondInput(value)
    }

    const onSelectLendAsset = (asset: CurrencyInfo | PoolData | null) => {
        setSelectedLendAsset(asset)
    }

    const onSelectBorrowAsset = (asset: CurrencyInfo | PoolData | null) => {
        setSelectedBorrowAsset(asset)
    }
    
    return {
        // state
        selectionModalState,
        selectedLendAsset,
        selectedBorrowAsset,
        assetInputValue,
        focusOnFirstNotSecondInput,
        selectedAppTab,
        // refs
        firstInputRef,
        secondInputRef,
        // functions
        selectionModalDispatch,
        selectAppTab,
        onSelectLendAsset,
        onSelectBorrowAsset,
        onToggleFocusOnFirstNotSecondInput,
        setAssetInputValue,
    }
}