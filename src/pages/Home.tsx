import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import {
    IonApp,
    IonIcon,
    IonLabel,
    IonRouterOutlet,
    IonTabBar,
    IonTabButton,
    IonTabs,
    IonPage,
    IonFab,
    IonFabButton
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { searchOutline, bookOutline, addCircleOutline, person, personCircleOutline } from 'ionicons/icons';
import Tab1 from './Tab1';
import Tab2 from './Tab2';
import Tab3 from './Tab3';
import Tab4 from './Tab4';

const Home: React.FC = () => (
    <IonTabs>
        <IonRouterOutlet>
            <Route path="/home/tab1" component={Tab1} exact={true} />
            <Route path="/home/tab2" component={Tab2} exact={true} />
            <Route path="/home/tab3" component={Tab3} />
            <Route path="/home/tab4" component={Tab4} exact={true} />
            <Route path="/home" render={() => <Redirect to="/home/tab1" />} exact={true} />
        </IonRouterOutlet>
        <IonTabBar slot="bottom">
            <IonTabButton tab="tab1" href="/home/tab1">
                <IonIcon icon={searchOutline} />
                <IonLabel>검색</IonLabel>
            </IonTabButton>
            <IonTabButton tab="tab2" href="/home/tab2">
                <IonIcon icon={bookOutline} />
                <IonLabel>예약</IonLabel>
            </IonTabButton>
            <IonTabButton tab="tab3" href="/home/tab3">
                <IonIcon icon={addCircleOutline} />
                <IonLabel>등록</IonLabel>
            </IonTabButton>
            <IonTabButton tab="tab4" href="/home/tab4">
                <IonIcon icon={personCircleOutline} />
                <IonLabel>내정보</IonLabel>
            </IonTabButton>
        </IonTabBar>
    </IonTabs>
);

export default Home;
