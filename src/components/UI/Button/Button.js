import React from 'react';
import styles from './Button.module.css';

const Button = (props) => {
 
    return (
        <button 
        disabled={props.disabled}
         //Podjetnik da je .join metoda na Array.prototype.join() i da returna string.
         className={[styles.Button, styles[props.btnType]].join(' ')}
        onClick={props.clicked}
        > {props.children}</button>
    );
};

export default Button;

