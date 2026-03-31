import { useState } from 'react'
import type { Song } from '../types'

type Props = {
  song: Song
  onAnother: () => void
  onReset: () => void
  looped: boolean
}

export function SongCard({ song, onAnother, onReset, looped }: Props) {
  const [copied, setCopied] = useState(false)

  const handleShare = async () => {
    const text = `今の気分にぴったりの一曲\n\n🎵 ${song.title} / ${song.artist}\n\n「${song.reason}」\n\n#キモチミュージック`
    if (navigator.share) {
      await navigator.share({ text })
    } else {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="song-card">
      {looped && (
        <p className="looped-notice">一周しました。また最初から紹介します</p>
      )}

      <div className="song-info">
        <p className="song-title">{song.title}</p>
        <p className="song-artist">{song.artist}</p>
        <p className="song-reason">「{song.reason}」</p>
        {song.youtubeUrl && (
          <a
            href={song.youtubeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="link-btn youtube"
          >
            YouTube で聴く
          </a>
        )}
      </div>

      <div className="song-actions">
        <button className="another-btn" onClick={onAnother}>
          もう一曲
        </button>
        <div className="song-sub-actions">
          <button className="share-btn" onClick={handleShare}>
            {copied ? 'コピーしました！' : 'シェア'}
          </button>
          <button className="reset-btn" onClick={onReset}>
            最初に戻る
          </button>
        </div>
      </div>
    </div>
  )
}
