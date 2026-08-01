import { useNavigate } from 'react-router-dom'
import { useTeam } from '../../hooks/useTeam'
import { useMissionTimer } from '../../hooks/useMissionTimer'
import { getBusinessCaseById } from '../../data/businessCases'
import Button from '../Button/Button'
import styles from './CierreSugerido.module.css'
import logo from '../../assets/images/logo-onStar.png'

function CierreSugerido() {
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

  const { cierreSugerido, beneficio } = getBusinessCaseById(team.assignedCase)

  return (
    <section className={styles.screen}>
      <article className={styles.logo}>
        <img src={logo} alt="Logo OnStar" />
      </article>

      <p className={styles.timer}>{label}</p>

      <h1 className={styles.title}>Cierre Sugerido</h1>
      <hr className={styles.divider} />

      <div className={styles.card}>
        <p className={styles.quote}>{cierreSugerido}</p>
        <p className={styles.beneficio}>{beneficio}</p>
      </div>

      <div className={styles.actions}>
        <Button
          onClick={() => navigate('/puntos-obligatorios')}
        >
          Atrás
        </Button>
      </div>
    </section>
  )
}

export default CierreSugerido
