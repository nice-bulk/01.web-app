import { useCallback, useRef } from 'react'

export function useSound() {
  const ctxRef = useRef<AudioContext | null>(null)

  function getCtx(): AudioContext {
    if (!ctxRef.current) {
      ctxRef.current = new AudioContext()
    }
    return ctxRef.current
  }

  const playCorrect = useCallback(() => {
    const ctx = getCtx()
    const now = ctx.currentTime

    // 明るい2音（C5 → E5）
    const freqs = [523.25, 659.25]
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

    // 低いブザー音
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

  return { playCorrect, playWrong }
}
