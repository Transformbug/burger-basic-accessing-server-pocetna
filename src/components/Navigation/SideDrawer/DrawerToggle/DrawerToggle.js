import React from 'react';
import styles from './DrawerToggle.module.css';

const DrawerToggle = (props) => {
    return (
        <div onClick={props.clicked} className={styles.DrawerToggle}>
        {/* Ovi divovi su prazni jer css klase na koje je na njih primjenjuju su ancestor selekor. Divovi su one tri crtice za toggle botun.     */}
        <div></div>
        <div></div>
        <div></div>
        
         </div>
    );
};

export default DrawerToggle;