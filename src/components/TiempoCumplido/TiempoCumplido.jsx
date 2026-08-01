import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTeam } from '../../hooks/useTeam'
import { lockTeam, setTeamStatus } from '../../firebase/teams'
import Button from '../Button/Button'
import styles from './TiempoCumplido.module.css'
import logo from '../../assets/images/logo-onStar.png'

function TiempoCumplido() {
  const navigate = useNavigate()
  const { team, loading } = useTeam()

  // Defensivo: asegura que el equipo quede 'locked' aunque esta pantalla se
  // haya alcanzado por otra vía distinta al vencimiento normal del timer.
  useEffect(() => {
    if (team) {
      lockTeam(team.id)
    }
  }, [team])

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

  const handleFacilitatorAccess = async () => {
    await setTeamStatus(team.id, 'scoring')
    navigate('/calificacion-1')
  }

  return (
    <section className={styles.screen}>
      <article className={styles.logo}>
        <img src={logo} alt="Logo OnStar" />
      </article>

      <h1 className={styles.title}>Tiempo Cumplido</h1>

      <div className={styles.card}>
        <p>
          Entreguen la tablet al facilitador y presenten su pitch para ser calificados y conocer si son los
          ganadores.
        </p>
      </div>

      <Button onClick={handleFacilitatorAccess} className={styles.buttonTiempoComplido}>Acceso facilitador</Button>
    </section>
  )
}

export default TiempoCumplido
