import React, { Component } from 'react';
import Button from '../../../components/UI/Button/Button';
import Spinner from '../../../components/UI/Spinner/Spinner';  
import styles from './ContactData.module.css';
import axios from '../../../axios-orders';
import Input from '../../../components/UI/Input/Input';

//Cijeli ContactData i Input.js je nastao u onaj sekciji 13, Forms and Form Validation

class ContactData extends Component {

     state={
       
        orderForm: {
            name:{
              elementType: 'input',
              elementConfig:{
               type: 'text',
               placeholder: 'Your Name'   
              }, 
              value: '',
              validation: {
                  required: true
              },
              valid: false ,
              touched: false
            } ,
            street: {
                elementType: 'input',
                elementConfig:{
                 type: 'text',
                 placeholder: 'Street'   
                }, 
                value: '' ,
                validation: {
                    required: true
                } ,
                valid: false ,
                touched: false
              },
            zipCode: {
                elementType: 'input',
                elementConfig:{
                 type: 'text',
                 placeholder: 'ZIP Code'   
                }, 
                value: '' ,
                validation: {
                    required: true,
                    minLenght: 5,
                    maxLength: 5
                } ,
                valid: false ,
                touched: false
              },
            country: {
                elementType: 'input',
                elementConfig:{
                 type: 'text',
                 placeholder: 'Country'   
                }, 
                value: '' ,
                validation: {
                    required: true
                } ,
                valid: false ,
                touched: false
              },
            email: {
                elementType: 'input',
                elementConfig:{
                 type: 'email',
                 placeholder: 'Your E-Mail'   
                }, 
                value: '',
                validation: {
                    required: true
                } ,
                valid: false ,
                touched: false
              },
            deliveryMethod: {
                elementType: 'select',
                elementConfig:{
                  options: [
                      {value: 'fastest', displayValue: 'Fastest'},
                      {value: 'cheapest', displayValue: 'Cheapest'}
                    ]
                }, 
                value: '',
                //Ovo smo dodali jer u fn. checkvalidty rules parametar predstvlja value ovoga validation property tj. neki objekt. Sad taj paramtera rules neće biti undefined kad
                // kada se taj. checkvalitiy pozove jer se promjenia vrijednost select elementa tj. ovaj gori fastest i chepest select nego 
                //prazan objekt. Znači {}.required, {}.minLength, {}.maxLength kada se pozove checkvalidity dok <Input> predstvlja onaj select botun će rezultirati sa undefined,
                // tj. dogodit će se da neće biti truthy, ali neće se dogoditi onaj error koji je dogodit kada pokušamo provjeriti undefined.required, undefined.minLength, undefined.maxLength
                validation: {},
                valid: true 
              }
            },
        formIsValid: false,    
        loading: false
        }
        
    

    orderHandler=(event)=>{
     //Ovo zovemo jer se form reloada kada kliknemo na Order.   
     event.preventDefault();  
     this.setState({loading: true})
     const formData={}
     for(let formElementIdentifier in this.state.orderForm){
         formData[formElementIdentifier]=this.state.orderForm[formElementIdentifier].value
     }
    const order={
       ingredients: this.props.ingredients,
       price: this.props.totalPrice,
       orderData: formData
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

    checkValidity(value, rules){
      let isValid=true
      //On je dodao ovdje još jednu nepotrebnu dodatnu provjeru koja je rješena gore kada smo dodali prazni objekt na validation property unutar deliberytMethod objekta

      if(rules.required){
          isValid=value.trim() !=='' && isValid;
      }
      if (rules.minLenght){
          isValid= value.length>=rules.minLenght && isValid;
      }
      if (rules.maxLenght){
        isValid= value.length<=rules.maxLenght && isValid;
    }
      return isValid
    }

    inputChangeHandler=(event,inputIdentifier)=>{
     const updatedOrderForm={
         ...this.state.orderForm
     }
     //On je nešto govrio oko shallow i deep copy u ovoj lekcija 268, ali to je zbunjujuće.Ovo doli radimo jer ne želimo napraviti ovo:
     //   this.state.orderForm[inputIdentifier].value=event.target.value
     //To bi bila izravno promjena stanja. 
     const updatedFormElement={
         ...updatedOrderForm[inputIdentifier]
     }
     updatedFormElement.value=event.target.value
     updatedFormElement.valid=this.checkValidity(updatedFormElement.value, updatedFormElement.validation)
     updatedFormElement.touched=true
     updatedOrderForm[inputIdentifier]=updatedFormElement

     let formIsValid=true
     for(let inputIdentifier in updatedOrderForm){
        formIsValid=updatedOrderForm[inputIdentifier].valid && formIsValid
     }
     
     this.setState({orderForm:updatedOrderForm, formIsValid: formIsValid})
    }


    render() {
      
        const formElementsArray=[]
        for(let key in this.state.orderForm){
           formElementsArray.push({
               id: key,
               config: this.state.orderForm[key]
           })   
        }


        let form=( 
            <form onSubmit={this.orderHandler}>
            {formElementsArray.map(formElement=>{
                return(
                  <Input 
                    key={formElement.id}
                    //Pazi ovaj fromElement predstvlja ove gori objekte koji ubacujemo sa .push unutar forElementsArray. Pa stoga fromElement.config predstvlja one objekte
                    // koji su vrijednosit key-eva orderForma unutar state objekta.
                    elementType={formElement.config.elementType}
                    elementConfig={formElement.config.elementConfig}
                    value={formElement.config.value}
                    invalid={!formElement.config.valid}
                    shouldValidate={formElement.config.validation}
                    touched={formElement.config.touched}
                    changed={(event)=>this.inputChangeHandler(event,formElement.id)}/> 
                )
            })}
            <Button btnType="Success" disabled={!this.state.formIsValid} >ORDER</Button>
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