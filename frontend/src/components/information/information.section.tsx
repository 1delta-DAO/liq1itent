import React from "react";
import styles from './Information.module.scss';

interface InformationProps {
  icon: string | undefined;
  title: string;
  description: string;
}

export const InformationSection: React.FC<InformationProps> = ({
  icon, title, description
}: InformationProps) => {
  return (
    <div className={styles["information"]}>
      <div className={styles["column"]}>
        <div className={styles["header"]}>
          <div className={styles['icon-wrapper']}>
            <img
              id="icon"
              alt="icon"
              className={styles["icon"]}
              src={icon}
            />
          </div>
          <h2>{title}</h2>
        </div>
      </div>
      <div className={styles["column"]}>
        <p className={styles["about-text"]}>
          {description}
        </p>
      </div>
    </div>
  );
};