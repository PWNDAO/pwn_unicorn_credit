import { useRef, useState } from 'react'
import { CurrencyInputPanelRef } from 'uniswap/src/components/CurrencyInputPanel/CurrencyInputPanel'
import { CurrencyInfo } from 'uniswap/src/features/dataApi/types'
import { useAccount } from 'wagmi'

export const useLendingState = () => {
    const { address } = useAccount()

    // states
    const [isLendNotBorrow, setIsLendNotBorrow] = useState<boolean>(false)
    const [selectedLendAsset, setSelectedLendAsset] = useState<CurrencyInfo | null>(null)
    const [selectedBorrowAsset, setSelectedBorrowAsset] = useState<CurrencyInfo | null>(null)
    const [isTokenSelectorOpen, setIsTokenSelectorOpen] = useState<boolean>(false)
    const [tokenSelectorMode, setTokenSelectorMode] = useState<'lend' | 'borrow'>('borrow')

    // refs
    const firstInputRef = useRef<CurrencyInputPanelRef>(null)
    const secondInputRef = useRef<CurrencyInputPanelRef>(null)

    const onToggleLendNotBorrow = (value: boolean) => {
        setIsLendNotBorrow(value)
    }

    const onSelectLendAsset = (asset: CurrencyInfo) => {
        setSelectedLendAsset(asset)
    }

    const onSelectBorrowAsset = (asset: CurrencyInfo) => {
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
    
    return {
        // state
        isLendNotBorrow,
        selectedLendAsset,
        selectedBorrowAsset,
        isTokenSelectorOpen,
        tokenSelectorMode,
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
    }
}