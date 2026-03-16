import { useState } from 'react'
import type { AppMode } from './types/music'
import { AppProvider } from './context/AppContext'
import ModeSelect from './components/ModeSelect/ModeSelect'
import KeyMode from './components/KeyMode/KeyMode'
import NoteMode from './components/NoteMode/NoteMode'
import PlayMode from './components/PlayMode/PlayMode'
import './App.css'

function App() {
  const [mode, setMode] = useState<AppMode>('select')

  return (
    <AppProvider>
      <div className="app">
        {mode === 'select' && <ModeSelect onSelect={setMode} />}
        {mode === 'key'    && <KeyMode  onBack={() => setMode('select')} />}
        {mode === 'note'   && <NoteMode onBack={() => setMode('select')} />}
        {mode === 'play'   && <PlayMode onBack={() => setMode('select')} />}
      </div>
    </AppProvider>
  )
}

export default App
