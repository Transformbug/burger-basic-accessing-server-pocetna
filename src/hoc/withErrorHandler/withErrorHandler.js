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
      
     componentDidMount() {
         axios.interceptors.request.use((req)=>{
           //Ovo ovdje radimo jer svaki put kada pošaljemo neki http request želimo maknuti error  
             this.setState({error: null})
             return req
         })
         axios.interceptors.response.use(res=>res, error=>{
            this.setState({error: error})
         })
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