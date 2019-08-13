import React from 'react';
import styles from './NavigationItems.module.css';
import NavigationItem from './NavigationItem/NavigationItem';


const NavigationItems = (props) => {
    return (
       <ul className={styles.NavigationItems}>
           {/* VAŽNO: ovaj link linka navodno na početnu stranicu, dok ovaj active bez value znači da mu je value boolan true. Mogli smo i napisat active=true */}
           <NavigationItem link="/" active>Burger builder </NavigationItem>
           <NavigationItem> Checkout </NavigationItem>
       </ul>
    );
};

export default NavigationItems;