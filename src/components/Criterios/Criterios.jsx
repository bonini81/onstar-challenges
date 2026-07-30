import { useNavigate } from 'react-router-dom'
import { EVALUATION_CRITERIA } from '../../data/criteria'
import styles from './Criterios.module.css'

// El criterio 8 sigue sin confirmar por el cliente, así que en esta pantalla
// (visible para los equipos) solo se listan los 7 ya definidos.
const VISIBLE_CRITERIA = EVALUATION_CRITERIA.slice(0, 7)

function Criterios() {
  const navigate = useNavigate()

  return (
    <section className={styles.screen}>
      <h1 className={styles.title}>Conoce los criterios de evaluación</h1>
      <p className={styles.intro}>
        La evaluación será sobre 40 puntos, siendo 1 el puntaje más bajo y 5 el más alto de
        calificación en cada parámetro.
      </p>

      <ul className={styles.list}>
        {VISIBLE_CRITERIA.map((criterion) => (
          <li key={criterion.id}>{criterion.label}</li>
        ))}
      </ul>

      <button className={styles.primaryButton} onClick={() => navigate('/registro')}>
        Entendido
      </button>
    </section>
  )
}

export default Criterios
