import { useRef, useState } from 'react'
import { CurrencyInputPanelRef } from 'uniswap/src/components/CurrencyInputPanel/CurrencyInputPanel'
import { PoolData } from 'uniswap/src/components/TokenSelector/lists/TokenSelectorPoolsList'
import { CurrencyInfo } from 'uniswap/src/features/dataApi/types'
import { useAccount } from 'wagmi'

export const useLendingState = () => {
    const { address } = useAccount()

    // states
    const [isLendNotBorrow, setIsLendNotBorrow] = useState<boolean>(false)
    const [selectedLendAsset, setSelectedLendAsset] = useState<CurrencyInfo | PoolData | null>(null)
    const [selectedBorrowAsset, setSelectedBorrowAsset] = useState<CurrencyInfo | PoolData | null>(null)
    const [isTokenSelectorOpen, setIsTokenSelectorOpen] = useState<boolean>(false)
    const [tokenSelectorMode, setTokenSelectorMode] = useState<'lend' | 'borrow'>('borrow')
    const [lendValue, setLendValue] = useState<string>('')
    const [borrowValue, setBorrowValue] = useState<string>('')
    const [focusOnFirstNotSecondInput, setFocusOnFirstNotSecondInput] = useState<boolean>(false)

    // refs
    const firstInputRef = useRef<CurrencyInputPanelRef>(null)
    const secondInputRef = useRef<CurrencyInputPanelRef>(null)

    const onToggleFocusOnFirstNotSecondInput = (value: boolean) => {
        setFocusOnFirstNotSecondInput(value)
    }

    const onToggleLendNotBorrow = (value: boolean) => {
        setIsLendNotBorrow(value)
    }

    const onSelectLendAsset = (asset: CurrencyInfo | PoolData) => {
        setSelectedLendAsset(asset)
    }

    const onSelectBorrowAsset = (asset: CurrencyInfo | PoolData) => {
        setSelectedBorrowAsset(asset)
    }

    const onShowTokenSelector = (mode: 'lend' | 'borrow') => {
        setIsTokenSelectorOpen(true)
        if (mode === 'lend') {
            onToggleLendNotBorrow(true)
        } else {
            onToggleLendNotBorrow(false)
        }
    }

    const onCloseTokenSelector = () => {
        setIsTokenSelectorOpen(false)
    }

    const handleChangeTokenSelectorMode = (mode: 'lend' | 'borrow') => {
        setTokenSelectorMode(mode)
    }

    const handleUpdateLendValue = (value: string) => {
        setLendValue(value)
    }

    const handleUpdateBorrowValue = (value: string) => {
        setBorrowValue(value)
    }
    
    return {
        // state
        isLendNotBorrow,
        selectedLendAsset,
        selectedBorrowAsset,
        isTokenSelectorOpen,
        tokenSelectorMode,
        lendValue,
        borrowValue,
        focusOnFirstNotSecondInput,
        // refs
        firstInputRef,
        secondInputRef,
        // functions
        onToggleLendNotBorrow,
        onSelectLendAsset,
        onSelectBorrowAsset,
        onShowTokenSelector,
        onCloseTokenSelector,
        handleChangeTokenSelectorMode,
        handleUpdateLendValue,
        handleUpdateBorrowValue,
        onToggleFocusOnFirstNotSecondInput,
    }
}