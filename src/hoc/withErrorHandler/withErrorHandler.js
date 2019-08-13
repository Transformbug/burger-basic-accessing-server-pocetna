import React,{Component} from 'react';
import Modal from '../../components/UI/Modal/Modal';
import Aux from '../Auxiliary/Auxiliary';

const withErrorHandler = (WrappedComponent, axios) => {

    //važno: primjti kako returnamo anonimnu class-u,prvi put vidim anonimnu class
    //withErrorHandler je odličan primjer higher order fn. Ovo nam omogućuje da imamo jasan pattern za error handling http requests sa axiosom, samo
    //treba imporati ovu komponentu i eksportatit je u fn. call gdje ubacimo tu komponentu i axios koja je u file gdje smo importali withErrorHandler
   
    return class extends Component{

        state={
            error: null
        }
      
     constructor() {
     //VAŽNO: ovaj withErrorHandler smo testirali na axios.post() i tada nije se nije pojavio ovaj problem radi kojeg smo morali promjniti componentDidMount u Construcotor.
     //btw. Max je promjenio u ComponentWillMount, to je zastrjelo u međuvrmeneu
     //Kada samo u BurgerBulder korisiti .get() onda se ovaj ne bi uhvatili error ovim patternom jer je BurgerBuilder child element withErrorHandler i kada ova kompneta
     //dođe do render() onda će se aktivirati lifecycle hooks BugerBuilder.js. Zato kada stavimo da je ovo construcotr onda se code unutar ovoga ima šansu izvršiti.
     //Također je unutar BugerBuilder.js zaboravio hendlati error sa .catch metodom gdje je nastao pa se onaj tamo .then aktvirao.   
         
      super()
         this.reqInterceptor=axios.interceptors.request.use((req)=>{
           //Ovo ovdje radimo jer svaki put kada pošaljemo neki http request želimo maknuti error  
             this.setState({error: null})
             return req
         })
         this.resInterceptor=axios.interceptors.response.use(res=>res, error=>{
            this.setState({error: error})
         })
     }
     
     componentWillUnmount() {
         console.log('withErrorHandler','componentWillUnmout')
         //Ovi interceptors su noćna mora. Navodno je ovo trebalo stavit jer će nam ovo biti od korisiti kada dodamo routing.Nešto je govorio oko dead interceptors...
         //Prvo treba saznati kada će se točno ova komponenta Unmontati tj. compnentWillUnmout aktivirati...
       axios.interceptors.request.eject(this.reqInterceptor)
       axios.interceptors.response.eject(this.reqInterceptor)
     }
     
     errorConfirmedHandler=()=>{
        this.setState({error: null})
     }

        render() {
            return (
                <Aux>
                    <Modal 
                      show={this.state.error}
                      modalClosed={this.errorConfirmedHandler}
                      >
                         {this.state.error? this.state.error.message: null}
                        </Modal>
                <WrappedComponent {...this.props}/>
                </Aux>
            )
        }
     
    }
};

export default withErrorHandler;