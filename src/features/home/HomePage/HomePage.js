import React from 'react';
import styles from './HomePage.scss';

export default function HomePage(props) {
  return (
    <div className={styles.container}>
      <p>react app template</p>
      <p>props: {props.toString()}</p>
    </div>
  );
}
