import { collection, doc, getDoc, runTransaction, serverTimestamp, updateDoc } from 'firebase/firestore'
import { db } from './config'
import { getGameStateRef } from './gameState'

const teamsCollection = collection(db, 'teams')

// Transacción atómica: toma un business case disponible de gameState.availableCases
// y crea el equipo en un solo paso, para que dos equipos nunca reciban el mismo caso.
export async function createTeam(name) {
  const gameStateRef = getGameStateRef()
  const teamRef = doc(teamsCollection)
  let assignedCase

  await runTransaction(db, async (transaction) => {
    const gameStateSnap = await transaction.get(gameStateRef)
    const availableCases = gameStateSnap.data()?.availableCases ?? []
    if (availableCases.length === 0) {
      throw new Error('No hay business cases disponibles')
    }

    const index = Math.floor(Math.random() * availableCases.length)
    assignedCase = availableCases[index]
    const remainingCases = [...availableCases.slice(0, index), ...availableCases.slice(index + 1)]

    transaction.update(gameStateRef, { availableCases: remainingCases })
    transaction.set(teamRef, {
      name,
      status: 'registered',
      assignedCase,
      readingStartedAt: null,
    })
  })

  return { teamId: teamRef.id, assignedCase }
}

export async function getTeam(teamId) {
  const snapshot = await getDoc(doc(teamsCollection, teamId))
  if (!snapshot.exists()) return null
  return { id: snapshot.id, ...snapshot.data() }
}

// Idempotente: si el equipo ya tiene readingStartedAt (p.ej. volvió a esta pantalla
// tras recargar), no reinicia el timer.
export async function startMission(teamId) {
  const teamRef = doc(teamsCollection, teamId)
  const snapshot = await getDoc(teamRef)
  if (snapshot.exists() && snapshot.data().readingStartedAt) return

  await updateDoc(teamRef, {
    status: 'reading',
    readingStartedAt: serverTimestamp(),
  })
}
