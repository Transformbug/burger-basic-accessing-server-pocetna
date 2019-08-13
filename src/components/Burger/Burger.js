import React from 'react';
import styles from './BurgerIngredient/Burger.module.css';
import BurgerIngredient from './BurgerIngredient/BurgerIngredient';

const burger = (props) => {
    
    let transformingIngredients=Object.keys(props.ingredients)
     .map(igKey=>{
       return [...Array(props.ingredients[igKey])].map((_, i)=>{
            return <BurgerIngredient key={igKey+i} type={igKey}/>
         })

    })
    .reduce((arr, el)=>{
      return arr.concat(el);
    },[])
    console.log(transformingIngredients)

   
   if(transformingIngredients.length===0){
     transformingIngredients=<p>Please start addding ingredients!</p>
   }
    
 
      return (
    
            <div className={styles.Burger}>
            {/* Zbunilo me zašto ne koristi BurgerIngredient nigdje children prop dok nisam skužio da su ovo self closing tags i da nije {transformingIngredients} između */}
                <BurgerIngredient type="bread-top"/>
                  {transformingIngredients}
                <BurgerIngredient type="bread-bottom"/>
            </div>
       
    );
};

export default burger;


