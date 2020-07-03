import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import {
    IonPage,
    IonContent,
    IonFooter,
    IonSlides,
    IonSlide
} from '@ionic/react';
import { searchOutline, bookOutline, addCircleOutline, person, personCircleOutline } from 'ionicons/icons';
import Tab1 from './Tab1';
import Tab2 from './Tab2';
import Tab3 from './Tab3';
import Tab4 from './Tab4';

import './Home.css';

const Home: React.FC<RouteComponentProps> = ({ history }) => (
    <IonPage>
        <IonContent>
            <IonSlides>
                <IonSlide><Tab1></Tab1></IonSlide>
                <IonSlide><Tab2></Tab2></IonSlide>
                <IonSlide><Tab3></Tab3></IonSlide>
                <IonSlide><Tab4 history={ history }></Tab4></IonSlide>
            </IonSlides>
        </IonContent>
        <IonFooter>
            <ul>
                <li>검색</li>
                <li>예약</li>
                <li>등록</li>
                <li>내정보</li>
            </ul>
        </IonFooter>
    </IonPage>
    // <IonTabs>
    //     <IonRouterOutlet>
    //         <Route path="/home/tab1" component={Tab1} exact={true} />
    //         <Route path="/home/tab2" component={Tab2} exact={true} />
    //         <Route path="/home/tab3" component={Tab3} />
    //         <Route path="/home/tab4" component={Tab4} exact={true} />
    //         <Route path="/home" render={() => <Redirect to="/home/tab1" />} exact={true} />
    //     </IonRouterOutlet>
    //     <IonTabBar slot="bottom">
    //         <IonTabButton tab="tab1" href="/home/tab1">
    //             <IonIcon icon={searchOutline} />
    //             <IonLabel>검색</IonLabel>
    //         </IonTabButton>
    //         <IonTabButton tab="tab2" href="/home/tab2">
    //             <IonIcon icon={bookOutline} />
    //             <IonLabel>예약</IonLabel>
    //         </IonTabButton>
    //         <IonTabButton tab="tab3" href="/home/tab3">
    //             <IonIcon icon={addCircleOutline} />
    //             <IonLabel>등록</IonLabel>
    //         </IonTabButton>
    //         <IonTabButton tab="tab4" href="/home/tab4">
    //             <IonIcon icon={personCircleOutline} />
    //             <IonLabel>내정보</IonLabel>
    //         </IonTabButton>
    //     </IonTabBar>
    // </IonTabs>
);

export default Home;
