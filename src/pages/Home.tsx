import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import {
    IonPage,
    IonContent,
    IonFooter,
    IonSlides,
    IonSlide,
    IonIcon
} from '@ionic/react';
import { searchOutline, bookOutline, addCircleOutline, person, personCircleOutline } from 'ionicons/icons';
import Tab1 from './Tab1';
import Tab2 from './Tab2';
import Tab3 from './Tab3';
import Tab4 from './Tab4';

import './Home.css';

const Home: React.FC<RouteComponentProps> = ({ history }) => (
    <IonPage>
        <Tab1></Tab1>
    </IonPage>
);

export default Home;
