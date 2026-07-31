import iconButton from '../../assets/images/iconButton.png'
import styles from './Button.module.css'

function Button({
  children,
  onClick,
  type = 'button',
  disabled = false,
  bgColor,
  textColor,
  icon = true,
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
      {icon && (
        <span className={styles.iconWrap}>
          <img src={iconButton} alt="" className={styles.icon} />
        </span>
      )}
    </button>
  )
}

export default Button
