import { collection, deleteDoc, doc, getDoc, getDocs, setDoc } from 'firebase/firestore'
import { db } from './config'
import { getGameStateRef } from './gameState'
import { getAllTeams, setTeamStatus } from './teams'

const scoresCollection = collection(db, 'scores')

function computeTotal(criteriaScores) {
  return Object.values(criteriaScores).reduce((sum, value) => sum + value, 0)
}

// Guarda la calificación del facilitador, marca el equipo como 'completed' y,
// si con esto los 3 equipos ya terminaron, desbloquea el ranking final.
export async function saveTeamScore(teamId, criteriaScores) {
  const total = computeTotal(criteriaScores)

  await setDoc(doc(scoresCollection, teamId), { ...criteriaScores, total })
  await setTeamStatus(teamId, 'completed')

  const teams = await getAllTeams()
  const allCompleted = teams.length > 0 && teams.every((team) => team.status === 'completed')
  if (allCompleted) {
    await setDoc(getGameStateRef(), { rankingsUnlocked: true }, { merge: true })
  }
}

export async function getTeamScore(teamId) {
  const snapshot = await getDoc(doc(scoresCollection, teamId))
  return snapshot.exists() ? snapshot.data() : null
}

// Cruza teams + scores, filtra los equipos que ya terminaron y ordena por
// puntaje descendente. Usado por RankingFinal.
export async function getRanking() {
  const teams = await getAllTeams()
  const completedTeams = teams.filter((team) => team.status === 'completed')

  const ranking = await Promise.all(
    completedTeams.map(async (team) => {
      const score = await getTeamScore(team.id)
      return { id: team.id, name: team.name, total: score?.total ?? 0 }
    }),
  )

  return ranking.sort((a, b) => b.total - a.total)
}

// Usado por el botón "Reiniciar" de RankingFinal al cerrar un día del evento.
export async function deleteAllScores() {
  const snapshot = await getDocs(scoresCollection)
  await Promise.all(snapshot.docs.map((scoreDoc) => deleteDoc(scoreDoc.ref)))
}
