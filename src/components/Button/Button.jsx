import iconButton from '../../assets/images/iconButton.png'
import iconButton2 from '../../assets/images/iconButton2.png'
import styles from './Button.module.css'

const ICONS = {
  default: iconButton,
  iconWhite: iconButton2,
}

function Button({
  children,
  onClick,
  type = 'button',
  disabled = false,
  bgColor,
  textColor,
  icon = 'default',
  iconState = true,
  className = '',
}) {
  const style = {
    ...(bgColor ? { '--btn-bg': bgColor } : {}),
    ...(textColor ? { '--btn-color': textColor } : {}),
  }

  return (
    <button
      type={type}
      className={`${styles.button} ${icon ? '' : styles.noIcon} ${className}`}
      style={style}
      onClick={onClick}
      disabled={disabled}
    >
      <span className={styles.label}>{children}</span>
      {iconState && (
        <span className={styles.iconWrap}>
          <img src={ICONS[icon]} alt="Icono" className={styles.icon} />
        </span>
      )}
    </button>
  )
}

export default Button
