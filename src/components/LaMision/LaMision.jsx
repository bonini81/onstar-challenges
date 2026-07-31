import { useNavigate } from 'react-router-dom'
import { useTeam } from '../../hooks/useTeam'
import { startMission } from '../../firebase/teams'
import Button from '../Button/Button'
import styles from './LaMision.module.css'
import logo from '../../assets/images/logo-onStar.png'

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
          <img src={logo} alt="Logo OnStar" />
        </article>
        
      <h2 className={styles.teamName}>{team.name}</h2>
      
    <div className={styles.ring}>
        <Button onClick={handleStart} iconState={false}>¡Iniciar Misión Ahora!</Button>
    </div>
    </section>
  )
}

export default LaMision
