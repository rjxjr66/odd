import React from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, useIonViewWillEnter } from '@ionic/react';
import './Tab2.css';
import ParkingList from '../components/ParkingList';
import { ParkingLot } from '../models/ParkingLot';
import locationService from '../services/location.service';

const Tab2: React.FC = () => {
  const [myLocation, setMyLocation] = React.useState<ParkingLot[]>([]);
  useIonViewWillEnter(()=>{
    getMyLocation()
  })

  const getMyLocation = async ()=>setMyLocation( await locationService.getMyReservation() )

  return (
    <div className="container">
      <ParkingList tab="2" list={myLocation} removable={false}></ParkingList>
    </div>
  );
};

export default Tab2;
