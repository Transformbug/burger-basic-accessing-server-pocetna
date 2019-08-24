import React, { Component } from 'react';
import Button from '../../../components/UI/Button/Button';
import Spinner from '../../../components/UI/Spinner/Spinner';  
import styles from './ContactData.module.css';
import axios from '../../../axios-orders';

class ContactData extends Component {

     state={
        name: '',
        email: '',
        address: {
            street: '',
            postalCode: ''
        },
        loading: false
    }

    orderHandler=(event)=>{
     //Ovo zovemo jer se form reloada kada kliknemo na Order.   
     event.preventDefault();  
    console.log(this.props.ingredients);

     this.setState({loading: true})
    const order={
       ingredients: this.props.ingredients,
       price: this.props.totalPrice,
       customer: {
           name: 'Max Schwarzmuller',
           address: {
             street: 'Teststreet 1',
             zipCode: '41351',
             country: 'Germany'
       },
       email: 'test@test.com'
    },
     deliveryMethod: 'fastest'  
    }
    //Ovo je ovdje post metoda
    axios.post('/orders.json', order)
    .then(response=>{
        console.log(response);
        this.setState({loading: false })
        this.props.history.push('/')
    })
    .catch(error=>{
     console.log(error);
   this.setState({loading: false})
    }
        )

    }


    render() {
        let form=( 
            <form>
            <input className={styles.Input} type="text" name="name" placeholder="Your Name"/>
            <input className={styles.Input} type="email" name="email" placeholder="Your Mail"/>
            <input className={styles.Input} type="text" name="street" placeholder="Street"/>
            <input className={styles.Input} type="text" name="postal" placeholder="Postal Code"/>
            <Button btnType="Success" clicked={this.orderHandler}>ORDER</Button>
        </form>);
        
        if(this.state.loading){
            form=<Spinner/>
        }
        return (
            <div className={styles.ContactData}>
                <h4>Enter your Contact Data</h4>
                 {form}
            </div>
        );
    }
}

export default ContactData;