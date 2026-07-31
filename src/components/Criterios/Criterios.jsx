import { useNavigate } from 'react-router-dom'
import { EVALUATION_CRITERIA } from '../../data/criteria'
import Button from '../Button/Button'
import styles from './Criterios.module.css'

// El criterio 8 sigue sin confirmar por el cliente, así que en esta pantalla
// (visible para los equipos) solo se listan los 7 ya definidos.
const VISIBLE_CRITERIA = EVALUATION_CRITERIA.slice(0, 7)

function Criterios() {
  const navigate = useNavigate()

  return (
    <section className={styles.screen}>

       <article className={styles.logo}>
                <img src="/src/assets/images/logo-onStar.png" alt="Logo OnStar" />
              </article>

  

    <div className={styles.ring}>
      <Button onClick={() => navigate('/registro')}>
         Entendido
        </Button>
   </div>
    </section>
  )
}

export default Criterios
