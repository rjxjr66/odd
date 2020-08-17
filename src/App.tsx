import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import {
  IonApp,
  IonRouterOutlet,
  IonLoading,
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';
import './App.css';

import Login from './pages/Login';
import SignIn from './pages/SignIn';
import LocationInfo from './pages/LocationInfo';
import { AddLocation } from './pages/AddLocation';
import firebase from 'firebase';
import userService from './services/user.service';
import SearchPage from './pages/SearchPage';
import ReservationPage from './pages/ReservationPage';
import AddPage from './pages/AddPage';
import MyPage from './pages/MyPage';
import Nearby from './pages/Nearby';
import Keyword from './pages/Keyword';

const App: React.FC = () => {
  const [loading, setLoading] = React.useState<boolean>(true);
  const [logedIn, setLogedIn] = React.useState<boolean>(false);

  firebase.auth().onAuthStateChanged(async user => {
    if (user) {
      await userService.setUser(user.uid);
      setLogedIn(true);
    } else {
      setLoading(false)
    }
  })

  return (<IonApp>
    <IonReactRouter>

      {loading && !logedIn ? (
        <IonLoading
          isOpen={true}
          message={'기다려 주세요...'}
        />
      ) : (
          <IonRouterOutlet>
            <Route path="/home" component={SearchPage} />
            <Route path="/reserve" component={ReservationPage} />
            <Route path="/mylot" component={AddPage} />
            <Route path="/mypage" component={MyPage} />
            <Route path="/signin" component={SignIn} exact={true} />
            <Route path="/info/:tab/:id" component={LocationInfo} />
            <Route path="/add" component={AddLocation} />
            <Route path="/login" component={Login} exact={true} />
            <Route path="/nearby" component={Nearby} exact={true} />
            <Route path="/keyword" component={Keyword} exact={true} />
            <Route path="/" render={() => <Redirect to={logedIn ? '/home' : '/login'} />} exact={true} />
          </IonRouterOutlet>
        )}
    </IonReactRouter>
  </IonApp>
  )
};

export default App;
