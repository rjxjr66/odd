import React, { useState } from 'react';
import { IonContent, IonPage, useIonViewWillEnter } from '@ionic/react';
import './Tab2.css';
import ParkingList from '../components/ParkingList';
import { ParkingLot } from '../models/ParkingLot';
import locationService from '../services/location.service';
import { OddHeader } from '../components/OddHeader';
import { RouteComponentProps } from 'react-router';

const Tab2: React.FC<RouteComponentProps> = ({ history }) => {
  const [myLocation, setMyLocation] = React.useState<ParkingLot[]>([]);
  useIonViewWillEnter(async () => {
    locationService.getMyReservation().then(setMyLocation)
  })

  const [scrollY, setScrollY] = React.useState<number>(0);

  return (
    <IonPage>
      <IonContent className="white" scrollEvents={true} onIonScroll={(ev)=>setScrollY(ev.detail.scrollTop)}>
        <OddHeader history={history} scrollY={scrollY}>예약목록</OddHeader>
        <ParkingList tab="2" list={myLocation} removable={false}></ParkingList>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
      </IonContent>
    </IonPage>
  );
};

export default Tab2;
