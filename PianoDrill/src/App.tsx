import { useState } from 'react'
import type { AppMode } from './types/music'
import ModeSelect from './components/ModeSelect/ModeSelect'
import KeyMode from './components/KeyMode/KeyMode'
import NoteMode from './components/NoteMode/NoteMode'
import './App.css'

function App() {
  const [mode, setMode] = useState<AppMode>('select')

  return (
    <div className="app">
      {mode === 'select' && <ModeSelect onSelect={setMode} />}
      {mode === 'key'    && <KeyMode  onBack={() => setMode('select')} />}
      {mode === 'note'   && <NoteMode onBack={() => setMode('select')} />}
    </div>
  )
}

export default App
