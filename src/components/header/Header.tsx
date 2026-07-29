import styles from "./Header.module.css";
import TfButton from "@/components/uikit/buttons/TfButton";
import plusIcon from "@/assets/plus.svg";
export interface HeaderProps {
  onAddTaskClick?: () => void;
}

export default function Header({ onAddTaskClick }: HeaderProps) {
  return (
    <div className={styles.header}>
      <div className={styles.container}>
        <div className={styles.logo}>TaskFlow</div>
        <TfButton size="sm" onClick={onAddTaskClick} iconOnly variant="primary">
          <img
            src={plusIcon}
            alt="Добавить"
            width={25}
            height={25}
            className="icon-white"
          />
        </TfButton>
      </div>
    </div>
  );
}
