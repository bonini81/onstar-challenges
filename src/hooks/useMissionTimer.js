import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { lockTeam } from '../firebase/teams'

// TEMPORAL: subido a 1 hora para poder ajustar el frontend sin el límite de
// 3 minutos. Volver a 180 antes del evento — ver conversación del 2026-07-31.
export const MISSION_DURATION_SECONDS = 3600

const LOCKED_STATUSES = ['locked', 'scoring', 'completed']

function toMillis(timestamp) {
  if (!timestamp) return null
  if (typeof timestamp.toMillis === 'function') return timestamp.toMillis()
  if (typeof timestamp.seconds === 'number') return timestamp.seconds * 1000
  return null
}

function formatLabel(remainingSeconds) {
  const clamped = Math.max(0, remainingSeconds)
  const minutes = Math.floor(clamped / 60)
  const seconds = clamped % 60
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

// Cuenta regresiva de 3 minutos calculada desde team.readingStartedAt (no desde
// estado local, para sobrevivir recargas de la tablet). Si el equipo ya está
// bloqueado (volvió atrás tras vencer el timer) o el timer llega a 0, redirige
// a TIEMPO CUMPLIDO.
export function useMissionTimer(team) {
  const navigate = useNavigate()
  const [label, setLabel] = useState(formatLabel(MISSION_DURATION_SECONDS))

  useEffect(() => {
    if (!team) return undefined

    if (LOCKED_STATUSES.includes(team.status)) {
      navigate('/tiempo-cumplido', { replace: true })
      return undefined
    }

    const startedAtMs = toMillis(team.readingStartedAt)
    if (!startedAtMs) return undefined

    const tick = () => {
      const elapsedSeconds = Math.floor((Date.now() - startedAtMs) / 1000)
      const remaining = MISSION_DURATION_SECONDS - elapsedSeconds
      setLabel(formatLabel(remaining))

      if (remaining <= 0) {
        lockTeam(team.id)
        navigate('/tiempo-cumplido', { replace: true })
      }
    }

    tick()
    const intervalId = setInterval(tick, 1000)
    return () => clearInterval(intervalId)
  }, [team, navigate])

  return { label }
}
