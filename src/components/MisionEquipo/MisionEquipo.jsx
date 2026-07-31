import { useNavigate } from 'react-router-dom'
import { useTeam } from '../../hooks/useTeam'
import { useMissionTimer } from '../../hooks/useMissionTimer'
import { getBusinessCaseById } from '../../data/businessCases'
import Button from '../Button/Button'
import styles from './MisionEquipo.module.css'
import logo from '../../assets/images/logo-onStar.png'

function MisionEquipo() {
  const navigate = useNavigate()
  const { team, loading } = useTeam()
  const { label } = useMissionTimer(team)

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

  const { mision } = getBusinessCaseById(team.assignedCase)

  return (
    <section className={styles.screen}>
      <article className={styles.logo}>
        <img src={logo} alt="Logo OnStar" />
      </article>

      <p className={styles.timer}>{label}</p>

      <h1 className={styles.title}>Misión del Equipo</h1>
      <hr className={styles.divider} />

      <div className={styles.card}>
        <p className={styles.intro}>Presentar una solución que le permita:</p>
        <ul className={styles.list}>
          {mision.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>

      <div className={styles.actions}>
        <Button
          onClick={() => navigate('/problema-cliente')}
          bgColor="var(--color-bg)"
          textColor="var(--color-text)"
          icon="iconWhite"
        >
          Atrás
        </Button>
        <Button onClick={() => navigate('/funciones-recomendadas')}>Siguiente</Button>
      </div>
    </section>
  )
}

export default MisionEquipo
