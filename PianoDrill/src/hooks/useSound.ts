import { useCallback, useRef } from 'react'

export function useSound() {
  const ctxRef = useRef<AudioContext | null>(null)

  function getCtx(): AudioContext {
    if (!ctxRef.current) {
      ctxRef.current = new AudioContext()
    }
    // モバイルなどで suspend している場合に再開
    if (ctxRef.current.state === 'suspended') {
      ctxRef.current.resume()
    }
    return ctxRef.current
  }

  const playCorrect = useCallback(() => {
    const ctx = getCtx()
    const now = ctx.currentTime
    const freqs = [523.25, 659.25] // C5 → E5
    freqs.forEach((freq, i) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.type = 'sine'
      osc.frequency.value = freq
      gain.gain.setValueAtTime(0.25, now + i * 0.12)
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.12 + 0.35)
      osc.start(now + i * 0.12)
      osc.stop(now + i * 0.12 + 0.35)
    })
  }, [])

  const playWrong = useCallback(() => {
    const ctx = getCtx()
    const now = ctx.currentTime
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.type = 'sawtooth'
    osc.frequency.value = 180
    gain.gain.setValueAtTime(0.15, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3)
    osc.start(now)
    osc.stop(now + 0.3)
  }, [])

  /** Play Mode用：鍵盤を押したときのピアノ音 */
  const playPianoNote = useCallback((noteStr: string) => {
    const NOTE_SEMITONES: Record<string, number> = {
      C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11,
    }
    const name   = noteStr.slice(0, -1)
    const octave = parseInt(noteStr.slice(-1), 10)
    const semi   = NOTE_SEMITONES[name] ?? 0
    const midi   = (octave + 1) * 12 + semi
    const freq   = 440 * Math.pow(2, (midi - 69) / 12)

    const ctx = getCtx()
    const now = ctx.currentTime
    const partials = [
      { ratio: 1, gain: 0.4 },
      { ratio: 2, gain: 0.15 },
      { ratio: 3, gain: 0.07 },
    ]
    partials.forEach(({ ratio, gain: gainVal }) => {
      const osc  = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.type = 'sine'
      osc.frequency.value = freq * ratio
      gain.gain.setValueAtTime(gainVal, now)
      gain.gain.setTargetAtTime(0, now + 0.05, 0.3)
      osc.start(now)
      osc.stop(now + 1.5)
    })
  }, [])

  return { playCorrect, playWrong, playPianoNote }
}
