/* eslint-disable max-len */
import React from "react";
import styles from './IllustratedTextList.module.scss';

interface IllustratedText {
  image: string;
  title: string;
  text: string;
}

interface IllustratedTextListProps {
  items: IllustratedText[];
}

export const IllustratedTextListComponent: React.FC<IllustratedTextListProps> = ({
  items
}) => {
  return (
    <div className={styles["illustrated-text-list"]}>
      {items
        .map((item: IllustratedText) => {
          return (
            <div key={item.title} className={styles["row"]}>
              <div className={styles["image-wrapper"]}>
                <img className={styles["image"]} src={item.image} alt={item.title}/>
              </div>
              <div className={styles["text"]}>
                <h4>{item.title}</h4>
                <p>
                  {item.text}
                </p>
              </div>
            </div>
          );
        })
      }
    </div>
  );
};