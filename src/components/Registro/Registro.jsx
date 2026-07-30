import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Keyboard from 'react-simple-keyboard'
import 'react-simple-keyboard/build/css/index.css'
import styles from './Registro.module.css'

const MAX_LENGTH = 24

const KEYBOARD_LAYOUT = {
  default: [
    'Q W E R T Y U I O P',
    'A S D F G H J K L Ñ',
    '{shift} Z X C V B N M {bksp}',
    '{space}',
  ],
  shift: [
    'Q W E R T Y U I O P',
    'A S D F G H J K L Ñ',
    '{shift} Z X C V B N M {bksp}',
    '{space}',
  ],
}

const KEYBOARD_DISPLAY = {
  '{bksp}': '⌫',
  '{shift}': '⇧',
  '{space}': 'espacio',
}

function Registro() {
  const navigate = useNavigate()
  const location = useLocation()
  const [teamName, setTeamName] = useState(location.state?.teamName ?? '')
  const [layoutName, setLayoutName] = useState('default')
  const keyboardRef = useRef(null)

  // Solo al montar: sincroniza el valor inicial (viene de "Atrás" en Confirmación)
  // con el estado interno del teclado. No debe re-ejecutarse en cada tecleo.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (teamName) {
      keyboardRef.current?.setInput(teamName)
    }
  }, [])

  const handleChange = (value) => {
    setTeamName(value.slice(0, MAX_LENGTH))
  }

  const handleKeyPress = (button) => {
    if (button === '{shift}') {
      setLayoutName((current) => (current === 'default' ? 'shift' : 'default'))
    } else if (button === '{enter}') {
      handleSubmit()
    }
  }

  const handleSubmit = () => {
    const trimmed = teamName.trim()
    if (!trimmed) return
    navigate('/confirmacion', { state: { teamName: trimmed } })
  }

  return (
    <section className={styles.screen}>
      
        <article className={styles.logo}>
                <img src="/src/assets/images/logo-onStar.png" alt="Logo OnStar" />
              </article>
            
      <h1 className={styles.title}>
        <span className={styles.step}>1</span> Regístrate
      </h1>
      <hr class={styles.divider} />
      <p className={styles.label}>Ingresa el nombre de tu equipo o concesionario:</p>

      <div className={styles.inputDisplay}>{teamName || ' '}</div>

      <div className={styles.keyboardWrap}>
        <Keyboard
          keyboardRef={(ref) => (keyboardRef.current = ref)}
          layoutName={layoutName}
          layout={KEYBOARD_LAYOUT}
          display={KEYBOARD_DISPLAY}
          onChange={handleChange}
          onKeyPress={handleKeyPress}
          maxLength={MAX_LENGTH}
        />
      </div>

      <button className={styles.primaryButton} onClick={handleSubmit} disabled={!teamName.trim()}>
        Listo
      </button>
    </section>
  )
}

export default Registro
