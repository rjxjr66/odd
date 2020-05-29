import React from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import './Tab2.css';
import ParkingList from '../components/ParkingList';

const Tab2: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>예약관리</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <ParkingList tab="2" list={[]} removable={false}></ParkingList>
      </IonContent>
    </IonPage>
  );
};

export default Tab2;
