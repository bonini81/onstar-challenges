import { collection, deleteDoc, doc, getDoc, getDocs, onSnapshot, runTransaction, serverTimestamp, updateDoc } from 'firebase/firestore'
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

// Idempotente: solo bloquea equipos que siguen en 'reading' (evita pisar un
// estado más avanzado si el timer local dispara tarde).
export async function lockTeam(teamId) {
  const teamRef = doc(teamsCollection, teamId)
  const snapshot = await getDoc(teamRef)
  if (!snapshot.exists() || snapshot.data().status !== 'reading') return

  await updateDoc(teamRef, { status: 'locked' })
}

export async function setTeamStatus(teamId, status) {
  await updateDoc(doc(teamsCollection, teamId), { status })
}

export async function getAllTeams() {
  const snapshot = await getDocs(teamsCollection)
  return snapshot.docs.map((teamDoc) => ({ id: teamDoc.id, ...teamDoc.data() }))
}

// Usado por RankingEspera para mostrar el progreso (equipos completados / total)
// mientras se espera a que terminen los demás equipos.
export function subscribeTeams(callback) {
  return onSnapshot(teamsCollection, (snapshot) => {
    callback(snapshot.docs.map((teamDoc) => ({ id: teamDoc.id, ...teamDoc.data() })))
  })
}

// Usado por el botón "Reiniciar" de RankingFinal al cerrar un día del evento.
export async function deleteAllTeams() {
  const snapshot = await getDocs(teamsCollection)
  await Promise.all(snapshot.docs.map((teamDoc) => deleteDoc(teamDoc.ref)))
}
