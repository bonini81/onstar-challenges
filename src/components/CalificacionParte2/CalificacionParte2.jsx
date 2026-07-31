import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useTeam } from '../../hooks/useTeam'
import { EVALUATION_CRITERIA } from '../../data/criteria'
import { saveTeamScore } from '../../firebase/scores'
import CriteriaRow from '../CriteriaRow/CriteriaRow'
import Button from '../Button/Button'
import styles from './CalificacionParte2.module.css'
import logo from '../../assets/images/logo-onStar.png'

// Parte 2: los 4 criterios restantes (4, 5, 6 y 7).
const PART2_CRITERIA = [EVALUATION_CRITERIA[3], EVALUATION_CRITERIA[4], EVALUATION_CRITERIA[5], EVALUATION_CRITERIA[6]]

function CalificacionParte2() {
  const navigate = useNavigate()
  const location = useLocation()
  const part1Scores = location.state
  const { team, loading } = useTeam()
  const [scores, setScores] = useState({})
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!part1Scores) {
      navigate('/calificacion-1', { replace: true })
    }
  }, [part1Scores, navigate])

  if (!part1Scores) return null

  if (loading) {
    return <section className={styles.screen} />
  }

  if (!team) {
    return (
      <section className={styles.screen}>
        <p>No se encontró un equipo registrado. Vuelve a la pantalla de inicio.</p>
      </section>
    )
  }

  const allSelected = PART2_CRITERIA.every((criterion) => scores[criterion.id])

  const handleSelect = (criterionId, value) => {
    setScores((current) => ({ ...current, [criterionId]: value }))
  }

  const handleNext = async () => {
    setSaving(true)
    await saveTeamScore(team.id, { ...part1Scores, ...scores })
    navigate('/score', { replace: true })
  }

  return (
    <section className={styles.screen}>
      <article className={styles.logo}>
        <img src={logo} alt="Logo OnStar" />
      </article>

      <h1 className={styles.title}>Equipo: {team.name}</h1>
      <p className={styles.intro}>
        Facilitador, califica al equipo según cada parámetro de evaluación siendo 1 el puntaje más bajo y 5 el más
        alto.
      </p>

      <div className={styles.rows}>
        {PART2_CRITERIA.map((criterion) => (
          <CriteriaRow
            key={criterion.id}
            label={criterion.label}
            value={scores[criterion.id]}
            onSelect={(value) => handleSelect(criterion.id, value)}
          />
        ))}
      </div>

      <Button onClick={handleNext} disabled={!allSelected || saving}>
        {saving ? 'Guardando…' : 'Siguiente'}
      </Button>
    </section>
  )
}

export default CalificacionParte2
