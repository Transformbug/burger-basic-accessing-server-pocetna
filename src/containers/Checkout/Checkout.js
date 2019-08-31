import React, { Component } from 'react';
import {Route} from 'react-router-dom';
import CheckoutSummary from '../../components/Order/CheckoutSummary/CheckoutSummary';
import ContactData from './ContactData/ContactData';

class Checkout extends Component {
    state = {
        ingredients: null,
         //VAŽNO: lekcija 255, to će se dogodit to što inspira sve ove komentara ovdje.
        //VAŽNO: ovaj price uopće neće biti korišten. Sa setState dodamo novi key ovdje totalPrice i to prebacimo na child komponte u renderu. Incilano sam mislio da će biti error,
        //ali samo se ovaj property ne korist i doda se novi property, samo eto taj novi property nije zapisan ovdje.
         price:0
        }
   
         mySetState = (ingredients, price) => {
        console.log('customMetoda, mySetState');
        this.setState({ingredients:ingredients, totalPrice:price});
    }

    componentDidUpdate() {
      console.log('Chekout.js, componentDidUpdate');
    }
    
     componentDidMount() {
        //VAŽNO: kada kada sam htio stavit ovdje constructor umjesto componentDidMount, nije mi this.props radio jer sam zaboravio stavit props unutar consturctor (props) i doli super(props).
         //VAŽNO: ali i tada bi se dogodio error, vidi screenshot 94 unutar react foldera.
         //JAKO VAŽNO:Max je zbunjeno reako da se u konsrukoru postvljat stanje, je, postvlja se sa this.state={a: 'value'}, znači postvlja se inicijalno stanje, ali se ne smije 
         //zvati this.setState() unutar konsrukora, pa čak i na ovakva način gdje ne zovemo this.setState nego imamo funkciju koju ovdje zovemo koja će pozvati this.setState(). 
       
        const query = new URLSearchParams(this.props.location.search);
        const ingredients = {};
        let price = 0;
        for (let param of query.entries()) {
            if (param[0] === 'price') {
                price = param[1];
            } else { ingredients[param[0]] = +param[1]; }
        }
        console.log('Checkout.js, componetDidMOunt');
        this.mySetState(ingredients, price);
        //VAŽNO: ne razumim što se događa. Kad ovdje umjesto mySetState zovem normalno setState odjenom sve radi iako je ingredients:null. 
        //Radi toga je bio error pa je Max prebacio ovaj componentDidMount.
        //u componetWillMount(jer je to prije render !!!) ali to je sad depracted. Ovo je rješenje iz q/a na udemy.
        // this.setState({ingredients: ingredients, totalPrice:price})
        
        //VAŽNO: vidi doli: ključna je doli bila provjera unutar retruna rendera. Ali opet mi nije jasno zašto nije Max-ov asistent htio ovdje izravno zvati setState kada ta provjera riješi
        // problem i kada uključimo ovdje this.setState sve radi. Pa Max je zvao setState ovdje i sve je radilo dok nije stavio ingredined na null pa pošto je render child komponeti
        // prije componentDidMont te komponet se ne bi ispravno lodale jer oviso o ingredient propu.
        // Može doista nema nikave razlike i pogriješio je.
        //VAŽNO: scrollaj doli:
        //https://www.udemy.com/react-the-complete-guide-incl-redux/learn/lecture/8145976#questions/4029126
        //Kaže da navodno je dobra praksa ne zvatit setState iz componedDidMounta ako nije async koliko sam skužio iako nije ni sam siguran koliko to doista ima nekog efekta.
        //Ali u svakom slučaju će se dogoditi re-render tj. novi upadate ciklus bilo da zovemo izravno setState ovdje ili da zovemo neku fn. odadave koje će pozvati setState.
     
    }
    checkoutCancelledHandler = () => { this.props.history.goBack(); }
    checkoutContinuedHandler = () => { this.props.history.replace('/checkout/contact-data'); }
    render () {// in the return (below), all "ingredients" are null upon the initial render.
    
    //JAKO VAŽNO: on je dodao ovaj uvjet && i provjerava jel this.state.ingredients truthy radi toga kad bude ovaj ingredent u prvom renderu null(prije componetdidMount se aktivira) smo
    // se rend-a ovaj prazni div omotač.
    //Ali ono što je najzanimljvije je da kada drugi put this.state.indgredient bude objekt sa onim vrijednostima to se uopće ne prikaže unutar UI, praktiči bude kao da je null što se UI tiče
    //i prikaže se samo ovaj valid JSX tj. div koji sadrži komponetu ,ChekoutSummary i Route. 
      console.log('Checkout.js-this.state.indgredients, render metoda', this.state.ingredients);
        return (
            <div>
                {this.state.ingredients && (
                    <div>
                        <CheckoutSummary
                            ingredients={this.state.ingredients}
                            checkoutCancelled={this.checkoutCancelledHandler}
                            checkoutContinued={this.checkoutContinuedHandler}
                        />
                        <Route 
                            path={this.props.match.path + '/contact-data'} 
                            render={(props) => (
                                //JAKO VAŽNO: ovdje ovaj <ContactDate ne prima one history, serach i location prop-ove od Route jer je unutar fn. koje je na render propu.
                                //Ali ta funckija koja se stavi na render prima te prope u svome props objekut pa smo ih ovdje doli prebacili sa {...props}
                                <ContactData
                                    ingredients={this.state.ingredients}
                                    price={this.state.totalPrice}
                                    {...props}
                                />
                            )}
                        />
                    </div>
                )}
            </div>
        );
    }
}
export default Checkout;