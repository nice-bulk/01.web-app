import { TagSelector } from './components/TagSelector'
import { SongCard } from './components/SongCard'
import { useSong } from './hooks/useSong'
import './App.css'

export default function App() {
  const { currentSong, selectedTag, looped, handleTagSelect, pickAnother, reset } = useSong()

  return (
    <div className="app">
      <header className="header">
        <h1 className="app-title">キモチミュージック</h1>
        <p className="app-subtitle">今の気分に、一曲だけ。</p>
      </header>

      <main className="main">
        {!currentSong ? (
          <>
            <p className="instruction">今の気分を選んでください</p>
            <TagSelector selectedTag={selectedTag} onSelect={handleTagSelect} />
          </>
        ) : (
          <SongCard song={currentSong} onAnother={pickAnother} onReset={reset} looped={looped} />
        )}
      </main>
    </div>
  )
}
