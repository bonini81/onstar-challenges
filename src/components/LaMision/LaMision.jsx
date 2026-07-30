import { useNavigate } from 'react-router-dom'
import { useTeam } from '../../hooks/useTeam'
import { startMission } from '../../firebase/teams'
import styles from './LaMision.module.css'

const STEPS = ['Conoce a tu cliente', 'Detecta el problema', 'Construye la solución', 'Vende y cierra']

function LaMision() {
  const navigate = useNavigate()
  const { team, loading } = useTeam()

  const handleStart = async () => {
    if (!team) return
    await startMission(team.id)
    navigate('/perfil-cliente')
  }

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

  return (
    <section className={styles.screen}>
       <article className={styles.logo}>
          <img src="/src/assets/images/logo-onStar.png" alt="Logo OnStar" />
        </article>
        
      <h2 className={styles.teamName}>{team.name}</h2>
      <h1 className={styles.title}>
        <span className={styles.step}>2</span> La Misión
      </h1>

      <p className={styles.intro}>
        Visualiza rigurosamente el perfil y caso de tu cliente.
        <br />
        Resuélvanlo como si estuvieran frente a un cliente real.
      </p>

      <ul className={styles.checklist}>
        {STEPS.map((label) => (
          <li key={label}>
            {label}
            <span className={styles.check}>✓</span>
          </li>
        ))}
      </ul>

      <p className={styles.timeNote}>
        Tienes <strong>3 minutos</strong> para crear un pitch de venta ganador con tu equipo.
      </p>

      <button className={styles.primaryButton} onClick={handleStart}>
        ¡Iniciar Misión Ahora!
      </button>
    </section>
  )
}

export default LaMision
