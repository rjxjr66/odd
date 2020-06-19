import React from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import './Tab2.css';
import ParkingList from '../components/ParkingList';
import { ParkingLot } from '../models/ParkingLot';
import locationService from '../services/location.service';

const Tab2: React.FC = () => {
  const [myList, setMyList] = React.useState<ParkingLot[]>([]);

  React.useEffect(()=>{
    locationService.getMyReservation().then(setMyList)
  }, [])

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>예약관리</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <ParkingList tab="2" list={myList} removable={false}></ParkingList>
      </IonContent>
    </IonPage>
  );
};

export default Tab2;
