import React from 'react';
import styles from './NavigationItems.module.css';
import NavigationItem from './NavigationItem/NavigationItem';


const NavigationItems = (props) => {
    return (
       <ul className={styles.NavigationItems}>
     {/* Ovo ovdje je samo obično prop prebacivanje, naravno, value ovoga exact propa je true.Ovo nije route    */}
           <NavigationItem link="/" exact >Burger builder </NavigationItem>
           <NavigationItem link="/orders"> Orders </NavigationItem>
       </ul>
    );
};

export default NavigationItems;