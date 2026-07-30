import { useEffect, useState } from 'react'
import { getTeam } from '../firebase/teams'
import { getStoredTeamId } from '../utils/session'

// Lee el teamId de localStorage y trae el documento del equipo desde Firestore.
// Sirve tanto para pantallas que necesitan el estado actual del equipo como
// para la recuperación de sesión al recargar la tablet.
export function useTeam() {
  const [team, setTeam] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const teamId = getStoredTeamId()
    if (!teamId) {
      setLoading(false)
      return
    }

    getTeam(teamId)
      .then(setTeam)
      .catch(setError)
      .finally(() => setLoading(false))
  }, [])

  return { team, loading, error }
}
