import React from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButtons, IonButton, IonIcon, useIonViewWillEnter } from '@ionic/react';
import './Tab3.css';
import ParkingList from '../components/ParkingList';
import { ParkingLot } from '../models/ParkingLot';
import locationService from '../services/location.service';
import { RouteComponentProps } from 'react-router';
import { OddHeader } from '../components/OddHeader';
import { OddModal } from '../components/OddModal';

const Tab3: React.FC<RouteComponentProps> = ({ history }) => {
  const [myLocation, setMyLocation] = React.useState<ParkingLot[] | null>(null);
  useIonViewWillEnter(()=>{
    getMyLocation()
  })

  const getMyLocation = async ()=>setMyLocation( await locationService.getMyLocation() )

  const [scrollY, setScrollY] = React.useState<number>(0);

  return (
    <IonPage>
      <IonContent className="white" scrollEvents={true} onIonScroll={(ev)=>setScrollY(ev.detail.scrollTop)}>
        <OddHeader history={history} scrollY={scrollY}>내 주차장</OddHeader>
        <ParkingList history={history} tab="3" list={myLocation} removable={true}></ParkingList>
        <OddModal color="blue" title="등록하기"></OddModal>
      </IonContent>
    </IonPage>
  );
};

export default Tab3;
