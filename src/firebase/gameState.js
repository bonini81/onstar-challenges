import { doc, getDoc, onSnapshot, setDoc } from 'firebase/firestore'
import { db } from './config'

export const GAME_STATE_DOC_ID = 'current'

const gameStateRef = doc(db, 'gameState', GAME_STATE_DOC_ID)

const ALL_CASE_IDS = [1, 2, 3, 4, 5, 6]

// eventDay 1 = día 1 del evento, 2 = día 2. Determina qué hace el botón
// "Reiniciar" de RankingFinal: de 1 a 2 conserva availableCases (los casos
// usados el día 1 quedan bloqueados); de 2 a 1 resetea todo, incluidos los casos.
const DEFAULT_GAME_STATE = {
  availableCases: ALL_CASE_IDS,
  rankingsUnlocked: false,
  eventDay: 1,
}

// Crea el documento gameState si todavia no existe. Seguro de llamar en cada carga de la app.
export async function ensureGameState() {
  const snapshot = await getDoc(gameStateRef)
  if (!snapshot.exists()) {
    await setDoc(gameStateRef, DEFAULT_GAME_STATE)
  }
}

export function getGameStateRef() {
  return gameStateRef
}

// Usado por RankingEspera para saltar a /ranking en cuanto rankingsUnlocked pasa a true.
export function subscribeGameState(callback) {
  return onSnapshot(gameStateRef, (snapshot) => {
    callback(snapshot.data() ?? DEFAULT_GAME_STATE)
  })
}

// Fin del día 1: limpia el ranking (teams/scores se borran aparte) pero conserva
// availableCases tal cual quedó, para que el día 2 reparta solo los casos que no
// se usaron el día 1.
export async function startNextEventDay() {
  await setDoc(gameStateRef, { rankingsUnlocked: false, eventDay: 2 }, { merge: true })
}

// Fin del día 2: reset completo del evento, incluidos los 6 business cases.
export async function resetFullEvent() {
  await setDoc(gameStateRef, DEFAULT_GAME_STATE)
}
