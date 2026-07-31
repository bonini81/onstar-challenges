import { useNavigate } from 'react-router-dom'
import { useTeam } from '../../hooks/useTeam'
import { useMissionTimer } from '../../hooks/useMissionTimer'
import { getBusinessCaseById } from '../../data/businessCases'
import Button from '../Button/Button'
import styles from './PerfilCliente.module.css'
import logo from '../../assets/images/logo-onStar.png'

function PerfilCliente() {
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

  const { clientProfile } = getBusinessCaseById(team.assignedCase)

  return (
    <section className={styles.screen}>
      <article className={styles.logo}>
        <img src={logo} alt="Logo OnStar" />
      </article>

      <p className={styles.timer}>{label}</p>

      <h1 className={styles.title}>Perfil de Cliente</h1>
      <hr className={styles.divider} />

      <div className={styles.card}>
        <p>
          <strong>Cliente:</strong> {clientProfile.nombre}
        </p>
        <p>
          <strong>Empresa:</strong> {clientProfile.empresa}
        </p>
        <p>
          <strong>Actividad:</strong> {clientProfile.actividad}
        </p>
        <p>
          <strong>Flota:</strong> {clientProfile.flota}
        </p>
        <p>
          <strong>Operación:</strong> {clientProfile.operacion}
        </p>
        <p>
          <strong>Situación actual:</strong> {clientProfile.situacion}
        </p>
      </div>

      <div className={styles.actions}>
        <Button onClick={() => navigate('/problema-cliente')}>Siguiente</Button>
      </div>
    </section>
  )
}

export default PerfilCliente
