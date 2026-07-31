import { useNavigate } from 'react-router-dom'
import { useTeam } from '../../hooks/useTeam'
import { useMissionTimer } from '../../hooks/useMissionTimer'
import { getBusinessCaseById } from '../../data/businessCases'
import Button from '../Button/Button'
import styles from './FuncionesRecomendadas.module.css'
import logo from '../../assets/images/logo-onStar.png'

function FuncionesRecomendadas() {
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

  const { funcionesRecomendadas } = getBusinessCaseById(team.assignedCase)

  return (
    <section className={styles.screen}>
      <article className={styles.logo}>
        <img src={logo} alt="Logo OnStar" />
      </article>

      <p className={styles.timer}>{label}</p>

      <h1 className={styles.title}>Funciones Recomendadas</h1>
      <hr className={styles.divider} />

      <div className={styles.card}>
        <ul className={styles.list}>
          {funcionesRecomendadas.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>

      <div className={styles.actions}>
        <Button
          onClick={() => navigate('/mision-equipo')}
          bgColor="var(--color-bg)"
          textColor="var(--color-text)"
          icon="iconWhite"
        >
          Atrás
        </Button>
        <Button onClick={() => navigate('/puntos-obligatorios')}>Siguiente</Button>
      </div>
    </section>
  )
}

export default FuncionesRecomendadas
