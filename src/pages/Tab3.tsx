import React from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButtons, IonButton, IonIcon } from '@ionic/react';
import './Tab3.css';
import { addOutline } from 'ionicons/icons';
import ParkingList from '../components/ParkingList';
import { ParkingLot } from '../models/ParkingLot';
import locationService from '../services/location.service';

const Tab3: React.FC = () => {
  const [myLocation, setMyLocation] = React.useState<ParkingLot[] | null>(null);

  const getMyLocation = async ()=>setMyLocation( await locationService.getMyLocation() )

  if (myLocation == null) {
    getMyLocation()
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>주차공간등록</IonTitle>
          <IonButtons slot="end">
            <IonButton fill="clear" routerLink="/add">
              <IonIcon slot="icon-only" icon={addOutline}></IonIcon>
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <ParkingList tab="3" list={myLocation as ParkingLot[]} removable={true}></ParkingList>
      </IonContent>
    </IonPage>
  );
};

export default Tab3;
