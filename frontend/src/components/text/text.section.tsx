import React from "react";
import styles from './Text.module.scss';

interface TextProps {
  title: string;
  description: string;
}

export const TextSection: React.FC<TextProps> = ({
  title, description
}: TextProps) => {
  return (
    <div className={styles["text"]}>
      <div className={styles["column"]}>
        <div className={styles["header"]}>
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
