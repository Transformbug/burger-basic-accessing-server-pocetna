import React from 'react';
import burgerLogo from '../../assets/images/burger-logo.png';
import styles from './Logo.module.css';

//VAŽNO: ovdje smo morali na ovakav način uvest i korisiti sliku radi Webpacka, znači ne smije se izravno staviti src
const Logo = (props) => {
    return (
        <div className={styles.Logo}>
            <img src={burgerLogo} alt="MyBurger"/> 
        </div>
    );
};

export default Logo;