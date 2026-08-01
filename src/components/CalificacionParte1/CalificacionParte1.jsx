import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTeam } from '../../hooks/useTeam'
import { EVALUATION_CRITERIA } from '../../data/criteria'
import CriteriaRow from '../CriteriaRow/CriteriaRow'
import Button from '../Button/Button'
import styles from './CalificacionParte1.module.css'
import logo from '../../assets/images/logo-onStar.png'

// Parte 1: criterios 1, 2, 3 y el criterio 8 (placeholder, ver CLAUDE.md > Decisiones Tomadas).
const PART1_CRITERIA = [EVALUATION_CRITERIA[0], EVALUATION_CRITERIA[1], EVALUATION_CRITERIA[2], EVALUATION_CRITERIA[3]]

function CalificacionParte1() {
  const navigate = useNavigate()
  const { team, loading } = useTeam()
  const [scores, setScores] = useState({})

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

  const allSelected = PART1_CRITERIA.every((criterion) => scores[criterion.id])

  const handleSelect = (criterionId, value) => {
    setScores((current) => ({ ...current, [criterionId]: value }))
  }

  const handleNext = () => {
    navigate('/calificacion-2', { state: scores })
  }

  return (
    <section className={styles.screen}>
      <article className={styles.logo}>
        <img src={logo} alt="Logo OnStar" />
      </article>

      <h1 className={styles.title}>Equipo: {team.name}</h1>
          <hr className={styles.divider} />
      <p className={styles.intro}>
        Facilitador, califica al equipo según cada parámetro de evaluación siendo 1 el puntaje más bajo y 5 el más
        alto.
      </p>

      <div className={styles.rows}>
        {PART1_CRITERIA.map((criterion) => (
          <CriteriaRow
            key={criterion.id}
            label={criterion.label}
            value={scores[criterion.id]}
            onSelect={(value) => handleSelect(criterion.id, value)}
          />
        ))}
      </div>

      <Button onClick={handleNext} disabled={!allSelected}>
        Siguiente
      </Button>
    </section>
  )
}

export default CalificacionParte1
