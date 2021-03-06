import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import Avatar from '../avatar/avatar.component'
import ProfileButton from '../profile-button/profile-button.component';

import {ReactComponent as PersonIcon} from './assets/person.svg';
import {ReactComponent as MedicalIcon} from './assets/medical.svg';
import {ReactComponent as InstitutionalIcon} from './assets/institutional.svg';
import {ReactComponent as ContactIcon} from './assets/contact.svg';
import {ReactComponent as InfoIcon} from './assets/info.svg';
import {ReactComponent as LogoutIcon} from './assets/logout.svg';
import Modal from '../modal/modal.component';
import ImageUploader from './../image-uploader/image-uploader.component';

import './profile-card.styles.scss';
import { auth } from '../../firebase/firebase.utils';

const ProfileCard = ({ currentUser, history }) => {
  const modalRef = React.useRef();

  return (
  <div className="profile-card">
    <Modal ref={modalRef}>
        <ImageUploader userId={currentUser ? currentUser.id : ''}/>
    </Modal>
    <div className="data-container">
      <Avatar
        modalRef={modalRef}
        avatar={currentUser ? currentUser.photoURL : ''}
      />
      <h3 className="name">{currentUser ? currentUser.displayName : ''}</h3>
      <span className="email">{currentUser ? currentUser.email : ''}</span>
    </div>
    <div className="menu">
      <Link to='/profile/personal'>
        <ProfileButton text="Datos Personales" icon={<PersonIcon />}/>
      </Link>
      <Link to='/profile/medical'>
        <ProfileButton text="Datos Medicos" icon={<MedicalIcon />}/>
      </Link>
      <Link to='/profile/institutional'>
        <ProfileButton text="Datos Institucionales" icon={<InstitutionalIcon />}/>
      </Link>
      <Link to='/profile/contact'>
        <ProfileButton text="Contacto de Emergencias" icon={<ContactIcon />}/>
      </Link>
      {/* <ProfileButton text="Info" icon={<InfoIcon />}/> */}
      <div onClick={async () => {
        await auth.signOut()
        await history.push('/signin')
      }}>
        <ProfileButton
          text="Cerrar sesión"
          icon={<LogoutIcon />}
        />
      </div>
    </div>
  </div>
)};

const mapDispatchToProps = state => ({
  currentUser: state.user.currentUser
})

export default connect(mapDispatchToProps)(ProfileCard);