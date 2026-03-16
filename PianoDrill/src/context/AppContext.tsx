import { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react'

export type Lang = 'en' | 'ja'

interface AppContextValue {
  lang: Lang
  setLang: (l: Lang) => void
}

const AppContext = createContext<AppContextValue>({ lang: 'en', setLang: () => {} })

export function AppProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>('en')
  return <AppContext.Provider value={{ lang, setLang }}>{children}</AppContext.Provider>
}

export function useLang() {
  return useContext(AppContext)
}
