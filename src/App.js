import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import HomePage from './pages/homepage/homepage.component';
import Layout from './components/layout/layout.component';
import SignIn from './pages/sign-in/signin.component';
import SignUp from './pages/sign-up/sign-up.component';
import Profile from './pages/profile/profile.component';
import PersonalData from './pages/personal-data/personal-data.component';
import MedicalData from './pages/medical-data/medical-data.component';
import InstitutionalData from './pages/institutional-data/institutional-data.component';
import ContactData from './pages/contact-data/contact-data.component';
import Loading from './components/loading/loading.component';
import EmailVerify from './pages/email-verify/email-verify.component';
import FlashmessageList from './components/flashmessage-list/flashmessage-list.component';
import BuildPage from './pages/buildpage/buildpage.component';

import './App.css';
import { auth, createUserProfileDocument } from './firebase/firebase.utils';
import { setCurrentUser } from './redux/user/user.action';
import requiredAuth from './routerProtector';
import { firestore } from './firebase/firebase.utils';
import eventReducer from './redux/event/event.reducer';
import { setEvents } from './redux/event/event.actions';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      working: false
    }
  }
  unsubscribeFromAuth = null

  componentWillMount() {
    const { setCurrentUser } = this.props;
    this.unsubscribeFromAuth = auth.onAuthStateChanged(async userAuth => {
      if (userAuth) {
        const userRef = await createUserProfileDocument(userAuth);

        await userRef.onSnapshot(snapShot => {
          setCurrentUser({
              id: snapShot.id,
              emailVerified: userAuth.emailVerified,
              ...snapShot.data()
            })
        });

        // Load Events
        let events = [];
        const eventsSnapshot = await firestore.collection('events').where('public', '==', true).get();
        await eventsSnapshot.docs.forEach((doc) => {
          events.push({id: doc.id ,...doc.data()})
        })
        this.props.setEvents(events)

      } else {
        await setCurrentUser(userAuth)
      }

      setTimeout(async() => {
        await this.setState({loading: false})
      }, 1000)
    })
  }

  componentWillUnmount() {
    this.unsubscribeFromAuth();
  }

  render() {
    const { loading, working } = this.state;
    return (
      <div className='app'>
        {
          working ? (<BuildPage />)
          :
          (
            <>
              <FlashmessageList />
              {
                !loading ?
                <Switch>
                  <Route exact path='/signin' component={SignIn} />
                  <Route exact path='/signup' component={SignUp} />
                  <Route exact path='/email-verify' component={EmailVerify} />
                  <Layout>
                    <Route exact path='/' component={requiredAuth(HomePage)} />
                    <Route exact path='/profile' component={requiredAuth(Profile)} />
                    <Route exact path='/profile/personal' component={requiredAuth(PersonalData)} />
                    <Route exact path='/profile/medical' component={requiredAuth(MedicalData)} />
                    <Route exact path='/profile/institutional' component={requiredAuth(InstitutionalData)} />
                    <Route exact path='/profile/contact' component={requiredAuth(ContactData)} />
                  </Layout>
                </Switch>
                :
                <Loading />
              }
            </>
          )
        }
      </div>
    );
  }
}

const mapStateToProps = ({user}) => ({
  currentUser: user.currentUser,
})

const mapDispatchToProps = dispatch => ({
  setCurrentUser: user => dispatch(setCurrentUser(user)),
  setEvents: events => dispatch(setEvents(events))
})

export default connect(mapStateToProps, mapDispatchToProps)(App);
