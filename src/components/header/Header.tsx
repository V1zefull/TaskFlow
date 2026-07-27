import styles from "./Header.module.css"

export default function Header() {
  return (
    <div className={styles.header}>
      <div className={styles.container}>
        <div className={styles.logo}>
          TaskFlow
        </div>
      </div>
    </div>
  );
}
