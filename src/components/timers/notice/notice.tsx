import styles from './notice.module.css';

export function Notice() {
  return (
    <p className={styles.notice}>
      计时器运行时请不要关闭此选项卡，否则所有计时器都将停止。
    </p>
  );
}
