import styles from './CriteriaRow.module.css'

const SCALE = [1, 2, 3, 4, 5]

function CriteriaRow({ label, value, onSelect }) {
  return (
    <div className={styles.row}>
      <span className={styles.label}>{label}</span>
      <div className={styles.scale}>
        {SCALE.map((option) => (
          <button
            key={option}
            type="button"
            className={`${styles.option} ${value === option ? styles.selected : ''}`}
            onClick={() => onSelect(option)}
            aria-pressed={value === option}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  )
}

export default CriteriaRow
