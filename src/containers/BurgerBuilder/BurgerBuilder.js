import React, { Component } from 'react';
import Aux from '../../hoc/Auxiliary/Auxiliary';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import axios from '../../axios-orders';

const INGREDIENT_PRICES={
   salad : 0.5,
   cheese: 0.4,
   meat: 1.3,
   bacon: 0.7
};

class BurgerBuilder extends Component {

    state={
            ingredients: null,
            totalPrice: 4,
            purchasable:false,
            purchasing: false,
            loading: false,
            error: false
        }

    componentDidMount() {
        axios.get('https://react-my-burger-47b75.firebaseio.com/ingredients.json')
        .then(response=>{
        //Ovaj .data je orginalno bio objekt koji je evkvivalnet originalnom ingrediens objekti gori koji nije bio na serveru
        //Ali je promjenio na firebase serveru tj. database vrijednost za propery meat i svaki put kada load-amo projekt vidimo da je netko stavio meso.
         this.setState({ingredients: response.data})
        })
        .catch(error=>{
         this.setState({error: true})
        })
    }    
   
    updatePurchaseState(ingredients) {
      
     const sum=Object.keys(ingredients)
        .map(igKey=>{
            return ingredients[igKey]
        })
        .reduce((sum,el)=>{
          return sum + el
        },0)
        this.setState({purchasable: sum>0})
    }    
    
    addIngredientHandler=(type)=> {
     const oldCount=this.state.ingredients[type]
     const updatedCount=oldCount+1;
     const updatedIngredients={
         ...this.state.ingredients
     }
     updatedIngredients[type]=updatedCount;
     const priceAdditon=INGREDIENT_PRICES[type];
     const oldPrice=this.state.totalPrice;
     const newPrice=oldPrice + priceAdditon;
     this.setState({totalPrice: newPrice, ingredients:updatedIngredients})
     this.updatePurchaseState(updatedIngredients)
    
   
    }   
    
    removeIngredientHandler=(type)=> {
    const oldCount=this.state.ingredients[type]
    if(oldCount <=0){
        return
    }
    const updatedCount=oldCount-1;
    const updatedIngredients={
                ...this.state.ingredients
            }
    updatedIngredients[type]=updatedCount;
    const priceDeduction=INGREDIENT_PRICES[type];
    const oldPrice=this.state.totalPrice;
    const newPrice=oldPrice - priceDeduction;
    this.setState({totalPrice: newPrice, ingredients:updatedIngredients})
    this.updatePurchaseState(updatedIngredients)
   
   }  
   
   purchaseHandler= ()=> {
       this.setState({purchasing: true})
   }

   purchaseCancelHandler=()=>{
       this.setState({purchasing:false})
   }

   purchaseContinueHandler=()=>{
    //    alert('You Continue');
    this.setState({loading: true})
    const order={
       ingredients: this.state.ingredients,
       price: this.state.totalPrice,
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
    axios.post('/orders.json', order)
    .then(response=>{
        console.log(response);
        //Purchasing false, zato jer želimo zatvorit Modal
        this.setState({loading: false, purchasing:false})
    })
    .catch(error=>{
     console.log(error);
     //Naravno i kad dobijemo error želimo da spinner se makne., purchasing:false
     this.setState({loading: false, purchasing:false})
    }
        )
   }

  render() {
    
    const disabledInfo={
        ...this.state.ingredients
    } 
    
    for(let key in disabledInfo){
        disabledInfo[key]=disabledInfo[key]<=0;
    }
    
    let orderSummary=null;
    
    let burger=this.state.error ?<p>Igrediends can't be loaded...</p>:<Spinner/>
    if(this.state.ingredients){
        burger= (
            <Aux>
             <Burger 
            ingredients={this.state.ingredients}
            />
            <BuildControls
            ingredientAdded={this.addIngredientHandler}
            ingredientRemoved={this.removeIngredientHandler}
            disabled={disabledInfo}
            purchasable={this.state.purchasable}
            ordered={this.purchaseHandler}
            price={this.state.totalPrice}/>
            </Aux>
            )
            //Ovo doli nema veze sa postvljanjem burgera, samo dijele if steament
            orderSummary=   <OrderSummary 
            ingredients={this.state.ingredients}
            price={this.state.totalPrice}
            purchaseCancelled={this.purchaseCancelHandler}
            purchaseContinued={this.purchaseContinueHandler}/> 
    }
    
    if(this.state.loading){
        orderSummary=<Spinner/>
    }
     
        return (
          <Aux>
               <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler} >
                   {orderSummary}
                  </Modal>
                  {burger}
          </Aux>
        );
    }
}

export default withErrorHandler(BurgerBuilder, axios);