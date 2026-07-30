const TEAM_ID_KEY = 'onstar_team_id'

export function getStoredTeamId() {
  return localStorage.getItem(TEAM_ID_KEY)
}

export function setStoredTeamId(teamId) {
  localStorage.setItem(TEAM_ID_KEY, teamId)
}

export function clearStoredTeamId() {
  localStorage.removeItem(TEAM_ID_KEY)
}
