'use client'

import * as React from 'react'

interface GlobalNavigationContextType {
  isOpen: boolean
  setIsOpen: (val: boolean) => void
}

const globalNavigationContext: GlobalNavigationContextType = {
  isOpen: false,
  setIsOpen: () => {},
}

export const GlobalNavigationContext = React.createContext(
  globalNavigationContext
)

interface Props {
  children?: React.ReactNode
}

export function GlobalNavigationProvider({ children }: Props) {
  const [isOpen, setIsOpenState] = React.useState(false)

  const setIsOpen = React.useCallback((newIsOpen: boolean) => {
    setIsOpenState(newIsOpen)
  }, [])

  const value = React.useMemo(() => ({
    isOpen,
    setIsOpen,
  }), [isOpen, setIsOpen])

  return (
    <GlobalNavigationContext.Provider value={value}>
      {children}
    </GlobalNavigationContext.Provider>
  )
}
