'use client'

import { createContext, useCallback, useContext, useMemo, useSyncExternalStore } from 'react'

export type ThemePreference = 'system' | 'light' | 'dark'

const STORAGE_KEY = 'verba.theme'
const CHANGE_EVENT = 'verba:theme-change'

interface ThemeContextValue {
  theme: ThemePreference
  setTheme: (theme: ThemePreference) => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

/**
 * Applies the stored theme before the first paint so the page never flashes
 * the wrong colours. Kept inline and tiny on purpose.
 */
export const themeScript = `(function(){try{var t=localStorage.getItem('${STORAGE_KEY}')||'system';var d=document.documentElement;d.classList.remove('light','dark');if(t==='dark')d.classList.add('dark');else if(t==='light')d.classList.add('light');}catch(e){}})();`

function readTheme(): ThemePreference {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored === 'light' || stored === 'dark' || stored === 'system') return stored
  } catch {
    // Storage is unavailable in some private-browsing modes.
  }
  return 'system'
}

function subscribe(onChange: () => void): () => void {
  window.addEventListener(CHANGE_EVENT, onChange)
  window.addEventListener('storage', onChange)
  return () => {
    window.removeEventListener(CHANGE_EVENT, onChange)
    window.removeEventListener('storage', onChange)
  }
}

export function ThemeProvider({
  children,
  initialTheme = 'system',
}: {
  children: React.ReactNode
  initialTheme?: ThemePreference
}) {
  const getServerSnapshot = useCallback(() => initialTheme, [initialTheme])
  const theme = useSyncExternalStore(subscribe, readTheme, getServerSnapshot)

  const setTheme = useCallback((next: ThemePreference) => {
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {
      // The choice simply will not persist.
    }
    const root = document.documentElement
    root.classList.remove('light', 'dark')
    if (next === 'dark') root.classList.add('dark')
    if (next === 'light') root.classList.add('light')
    window.dispatchEvent(new Event(CHANGE_EVENT))
  }, [])

  const value = useMemo(() => ({ theme, setTheme }), [theme, setTheme])
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext)
  if (!context) throw new Error('useTheme must be used inside <ThemeProvider>')
  return context
}
