import React from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButtons, IonButton, IonIcon, useIonViewWillEnter } from '@ionic/react';
import './Tab3.css';
import { addOutline } from 'ionicons/icons';
import ParkingList from '../components/ParkingList';
import { ParkingLot } from '../models/ParkingLot';
import locationService from '../services/location.service';
import { RouteComponentProps } from 'react-router';

const Tab3: React.FC<RouteComponentProps> = ({ history }) => {
  const [myLocation, setMyLocation] = React.useState<ParkingLot[]>([]);
  useIonViewWillEnter(()=>{
    getMyLocation()
  })

  const getMyLocation = async ()=>setMyLocation( await locationService.getMyLocation() )

  return (
      <div className="container">
        <ParkingList history={history} tab="3" list={myLocation} removable={true}></ParkingList>
      </div>
  );
};

export default Tab3;
