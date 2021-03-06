import React from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';

import FormInput from '../form-input/form-input.compoent';
import CustomButton from '../custom-button/custom-buton.components';
import {ReactComponent as Logo} from '../../assets/logo.svg';
import './signin-form.styles.scss'

import { auth, signInWithGoogle } from '../../firebase/firebase.utils';
import { addFlashMessage } from '../../redux/flashmessage/flashmessage.action';

class SignInForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: ''
    }
  }

  handleSubmit = async event => {
    event.preventDefault()

    const { email, password } = this.state;

    try {
      await auth.signInWithEmailAndPassword(email, password);
      await this.setState({ email: '', password: ''});
      await this.props.history.push('/profile')
    } catch(err) {
      // console.log('Error signing in with email and password.', err);
      this.props.addFlashMessage({type: 'error',...err})
      this.setState({ email: '', password: ''})
    }

  }

  handleChange = event => {
    const { value, name } = event.target;
    
    this.setState({ [name] : value})
  }

  render() {
    return (
      <div className='signin-wrapper'>
        <div className="card-signin">
          <h2 className='form-title'></h2>
          <div className='logo'>
            <Logo />
          </div>
          <form onSubmit={this.handleSubmit}>
            <FormInput
              type='text'
              name='email'
              label='Email'
              value={this.state.email}
              placeholder='Ingrese su email...'
              handleChange={this.handleChange}
              required
            />
            <FormInput
              type='password'
              name='password'
              label='Contraseña'
              value={this.state.password}
              placeholder='Ingrese su contraseña...'
              handleChange={this.handleChange}
              required
            />
            <CustomButton type='submit'>Ingresar</CustomButton>
          </form>
          <CustomButton
            secondary
            onClick={async() => {
              try {
                await signInWithGoogle()
              } catch(err) {
                this.props.addFlashMessage({type: 'error',...err})
              }
            }}
          >Ingresar con Google</CustomButton>
        </div>
        <span className='signup-link'>No tienes una cuenta? <Link to='/signup'>Registrate aquí</Link></span>
      </div>
    );
  }
} 

const mapStateToProps = state => ({

})

const mapsDispatchToProps = dispatch => ({
  addFlashMessage: (message) => dispatch(addFlashMessage(message))
})

export default connect(null, mapsDispatchToProps)(withRouter(SignInForm));