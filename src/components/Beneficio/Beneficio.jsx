import { useNavigate } from 'react-router-dom'
import { useTeam } from '../../hooks/useTeam'
import { useMissionTimer } from '../../hooks/useMissionTimer'
import { getBusinessCaseById } from '../../data/businessCases'
import Button from '../Button/Button'
import styles from './Beneficio.module.css'
import logo from '../../assets/images/logo-onStar.png'

function Beneficio() {
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

  const { beneficio } = getBusinessCaseById(team.assignedCase)

  return (
    <section className={styles.screen}>
      <article className={styles.logo}>
        <img src={logo} alt="Logo OnStar" />
      </article>

      <p className={styles.timer}>{label}</p>

      <h1 className={styles.title}>Beneficio para la rentabilidad y protección del negocio</h1>
      <hr className={styles.divider} />

      <div className={styles.card}>
        <p className={styles.quote}>{beneficio}</p>
      </div>

      <div className={styles.actions}>
        <Button
          onClick={() => navigate('/puntos-obligatorios')}
        >
          Atrás
        </Button>
        <Button onClick={() => navigate('/cierre-sugerido')}>Siguiente</Button>
      </div>
    </section>
  )
}

export default Beneficio
