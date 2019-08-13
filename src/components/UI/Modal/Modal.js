import React,{Component} from 'react';
import styles from './Modal.module.css';
import Aux from '../../../hoc/Auxiliary/Auxiliary';
import Backdrop from '../Backdrop/Backdrop';

class Modal extends Component {
    
    
    //Podsjetnik, shouldCompnent upadate mora uvijek vratit boolean, ako je false onda se neće nastaviti daljni update lifecycle ciklus ove komponente.
    shouldComponentUpdate(nextProps,nextState) {
        //Usporedđujemo children poprety jel želimo da se modal updata kad se dogodi promjena između Spinnera i orderSummary
        return nextProps.show !== this.props.show || nextProps.children!==this.props.children
    }

    componentDidUpdate () {
        console.log('Modal.js', 'componentDidUpadate')
    }

    render() {
        console.log('Modal.js')
        return (
            <Aux>
                <Backdrop show={this.props.show} clicked={this.props.modalClosed}/>
            <div className={styles.Modal}
              style={{
                     transform: this.props.show ? 'translateY(0)':'translateY(-100vh)',
                     opacity: this.props.show ? '1': '0' 
                 }}
            >
                {this.props.children}
            </div>
            </Aux>
        );

    }
 
};

export default Modal;