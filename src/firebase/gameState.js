import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from './config'

export const GAME_STATE_DOC_ID = 'current'

const gameStateRef = doc(db, 'gameState', GAME_STATE_DOC_ID)

const DEFAULT_GAME_STATE = {
  availableCases: [1, 2, 3, 4, 5, 6],
  rankingsUnlocked: false,
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
