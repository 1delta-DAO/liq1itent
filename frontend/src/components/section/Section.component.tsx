import React from "react";
import styles from './Section.module.scss';

interface SectionProps {
  style: string
  children: JSX.Element | JSX.Element[];
}

export const SectionComponent: React.FC<SectionProps> = ({
  children
}: SectionProps) => {
  return (
    <div className={styles["section-wrapper"]}>
      {children}
    </div>
  );
};
